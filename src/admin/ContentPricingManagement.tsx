import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Pen as Yen, Percent, History, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { LearningContent } from '../../types';

export const ContentPricingManagement: React.FC = () => {
  const [contents, setContents] = useState<(LearningContent & { pricing?: ContentPricing })[]>([]);
  const [filteredContents, setFilteredContents] = useState<(LearningContent & { pricing?: ContentPricing })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<(LearningContent & { pricing?: ContentPricing }) | null>(null);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [priceHistories, setPriceHistories] = useState<PriceHistory[]>([]);
  const { t } = useTranslation();

  // Content pricing interface
  interface ContentPricing {
    listPrice: number; // 定価
    salePrice: number; // 販売価格
    discountPrice?: number; // 割引価格
    discountPercentage?: number; // 割引率
    discountStartDate?: string; // 割引開始日
    discountEndDate?: string; // 割引終了日
    lastUpdated: string; // 最終更新日
    updatedBy: string; // 更新者
  }

  // Price history interface
  interface PriceHistory {
    id: string;
    contentId: string;
    listPrice: number;
    salePrice: number;
    discountPrice?: number;
    discountPercentage?: number;
    effectiveDate: string;
    updatedBy: string;
    reason?: string;
  }

  useEffect(() => {
    loadContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, searchQuery, categoryFilter, priceFilter]);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockContents = [
        {
          id: 'content-1',
          title: 'JavaScript基礎講座',
          description: 'JavaScriptの基本文法から始めて、実際のアプリケーション開発まで学習します。',
          categoryId: 'cat-1',
          contentType: 'video',
          difficultyLevel: 'beginner',
          estimatedDuration: 120,
          thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          pricing: {
            listPrice: 15000,
            salePrice: 12000,
            discountPrice: 9800,
            discountPercentage: 35,
            discountStartDate: '2024-06-01',
            discountEndDate: '2024-07-31',
            lastUpdated: '2024-06-01T10:30:00Z',
            updatedBy: 'Admin User'
          }
        },
        {
          id: 'content-2',
          title: 'Python データ分析入門',
          description: 'Pythonを使ったデータ分析の基礎を学習します。pandas、matplotlib等のライブラリの使い方も解説。',
          categoryId: 'cat-2',
          contentType: 'video',
          difficultyLevel: 'intermediate',
          estimatedDuration: 180,
          thumbnailUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          pricing: {
            listPrice: 18000,
            salePrice: 18000,
            lastUpdated: '2024-05-15T14:20:00Z',
            updatedBy: 'Admin User'
          }
        },
        {
          id: 'content-3',
          title: '機械学習アルゴリズム基礎',
          description: '機械学習の主要なアルゴリズムを理論と実践の両面から学習します。',
          categoryId: 'cat-3',
          contentType: 'video',
          difficultyLevel: 'advanced',
          estimatedDuration: 240,
          thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          pricing: {
            listPrice: 25000,
            salePrice: 22000,
            discountPrice: 19800,
            discountPercentage: 20,
            discountStartDate: '2024-06-15',
            discountEndDate: '2024-08-15',
            lastUpdated: '2024-06-10T09:45:00Z',
            updatedBy: 'Admin User'
          }
        },
        {
          id: 'content-4',
          title: 'React フロントエンド開発',
          description: 'Reactを使ったモダンなフロントエンド開発の手法を学びます。',
          categoryId: 'cat-1',
          contentType: 'video',
          difficultyLevel: 'intermediate',
          estimatedDuration: 200,
          thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: false
        },
        {
          id: 'content-5',
          title: '日本語会話基礎',
          description: '日常生活や職場で使える基本的な日本語会話を学びます。',
          categoryId: 'cat-4',
          contentType: 'video',
          difficultyLevel: 'beginner',
          estimatedDuration: 150,
          thumbnailUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          pricing: {
            listPrice: 12000,
            salePrice: 9800,
            lastUpdated: '2024-05-20T11:15:00Z',
            updatedBy: 'Admin User'
          }
        }
      ];
      
      setContents(mockContents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading contents:', error);
      setIsLoading(false);
      toast.error(t('common.error'));
    }
  };

  const filterContents = () => {
    let filtered = contents;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(query) ||
        content.description.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(content => content.categoryId === categoryFilter);
    }
    
    // Price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'has_price':
          filtered = filtered.filter(content => content.pricing !== undefined);
          break;
        case 'no_price':
          filtered = filtered.filter(content => content.pricing === undefined);
          break;
        case 'discounted':
          filtered = filtered.filter(content => 
            content.pricing?.discountPrice !== undefined && 
            content.pricing.discountPrice < content.pricing.salePrice
          );
          break;
      }
    }
    
    setFilteredContents(filtered);
  };

  const handleEditPricing = (content: LearningContent & { pricing?: ContentPricing }) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

  const handleBulkEdit = () => {
    setShowBulkEditModal(true);
  };

  const handleViewPriceHistory = (contentId: string) => {
    // In a real implementation, this would fetch price history from an API
    const mockHistories: PriceHistory[] = [
      {
        id: 'history-1',
        contentId,
        listPrice: 15000,
        salePrice: 12000,
        discountPrice: 9800,
        discountPercentage: 35,
        effectiveDate: '2024-06-01T10:30:00Z',
        updatedBy: 'Admin User',
        reason: '夏季キャンペーン'
      },
      {
        id: 'history-2',
        contentId,
        listPrice: 15000,
        salePrice: 13500,
        discountPrice: 11500,
        discountPercentage: 23,
        effectiveDate: '2024-05-01T09:15:00Z',
        updatedBy: 'Admin User',
        reason: 'GWキャンペーン'
      },
      {
        id: 'history-3',
        contentId,
        listPrice: 15000,
        salePrice: 15000,
        effectiveDate: '2024-04-01T14:20:00Z',
        updatedBy: 'Admin User',
        reason: '初期設定'
      }
    ];
    
    setPriceHistories(mockHistories);
    setShowHistoryModal(true);
  };

  const handleSavePricing = (pricingData: ContentPricing) => {
    if (!selectedContent) return;
    
    // Update content pricing
    setContents(prevContents => 
      prevContents.map(content => 
        content.id === selectedContent.id 
          ? { ...content, pricing: { ...pricingData, lastUpdated: new Date().toISOString(), updatedBy: 'Admin User' } } 
          : content
      )
    );
    
    setShowEditModal(false);
    setSelectedContent(null);
    toast.success('価格設定を保存しました');
  };

  const handleBulkSavePricing = (pricingData: Partial<ContentPricing>) => {
    // Update selected contents pricing
    setContents(prevContents => 
      prevContents.map(content => 
        selectedContents.includes(content.id) 
          ? { 
              ...content, 
              pricing: { 
                ...(content.pricing || { listPrice: 0, salePrice: 0 }),
                ...pricingData,
                lastUpdated: new Date().toISOString(),
                updatedBy: 'Admin User'
              } 
            } 
          : content
      )
    );
    
    setShowBulkEditModal(false);
    setSelectedContents([]);
    toast.success('一括価格設定を保存しました');
  };

  const handleToggleSelectContent = (contentId: string) => {
    setSelectedContents(prev => 
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAllContents = () => {
    if (selectedContents.length === filteredContents.length) {
      setSelectedContents([]);
    } else {
      setSelectedContents(filteredContents.map(content => content.id));
    }
  };

  const handleExportPricing = () => {
    const pricingData = contents
      .filter(content => content.pricing)
      .map(content => ({
        id: content.id,
        title: content.title,
        listPrice: content.pricing?.listPrice,
        salePrice: content.pricing?.salePrice,
        discountPrice: content.pricing?.discountPrice,
        discountPercentage: content.pricing?.discountPercentage,
        discountStartDate: content.pricing?.discountStartDate,
        discountEndDate: content.pricing?.discountEndDate,
        lastUpdated: content.pricing?.lastUpdated
      }));
    
    const jsonString = JSON.stringify(pricingData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content_pricing.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('価格設定をエクスポートしました');
  };

  const handleImportPricing = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Update content pricing
        setContents(prevContents => 
          prevContents.map(content => {
            const importedItem = importedData.find((item: any) => item.id === content.id);
            if (importedItem) {
              return {
                ...content,
                pricing: {
                  listPrice: importedItem.listPrice,
                  salePrice: importedItem.salePrice,
                  discountPrice: importedItem.discountPrice,
                  discountPercentage: importedItem.discountPercentage,
                  discountStartDate: importedItem.discountStartDate,
                  discountEndDate: importedItem.discountEndDate,
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin User'
                }
              };
            }
            return content;
          })
        );
        
        toast.success('価格設定をインポートしました');
      } catch (error) {
        console.error('Error parsing imported data:', error);
        toast.error('インポートに失敗しました。ファイル形式を確認してください。');
      }
    };
    reader.readAsText(file);
  };

  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    return price.toLocaleString() + '円';
  };

  const getDiscountRate = (listPrice?: number, discountPrice?: number) => {
    if (!listPrice || !discountPrice || listPrice === 0) return '-';
    const rate = Math.round((1 - discountPrice / listPrice) * 100);
    return `${rate}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">コンテンツ価格管理</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            id="import-pricing"
            className="hidden"
            accept=".json"
            onChange={handleImportPricing}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-pricing')?.click()}
            leftIcon={<ArrowUpTrayIcon className="w-4 h-4" />}
          >
            インポート
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPricing}
            leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            エクスポート
          </Button>
          <Button
            onClick={handleBulkEdit}
            leftIcon={<PencilIcon className="w-4 h-4" />}
            disabled={selectedContents.length === 0}
          >
            一括編集
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="コンテンツを検索..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">全カテゴリ</option>
              <option value="cat-1">プログラミング基礎</option>
              <option value="cat-2">データ分析</option>
              <option value="cat-3">AI・機械学習</option>
              <option value="cat-4">日本語学習</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">全価格状態</option>
              <option value="has_price">価格設定あり</option>
              <option value="no_price">価格設定なし</option>
              <option value="discounted">割引中</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">コンテンツが見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">
              検索条件を変更してお試しください
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedContents.length === filteredContents.length && filteredContents.length > 0}
                      onChange={handleSelectAllContents}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コンテンツ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    定価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    販売価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    割引価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    割引率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    割引期間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終更新
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContents.includes(content.id)}
                        onChange={() => handleToggleSelectContent(content.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 rounded overflow-hidden">
                          {content.thumbnailUrl ? (
                            <img
                              src={content.thumbnailUrl}
                              alt={content.title}
                              className="h-10 w-16 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-16 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {content.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {content.isPublished ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                公開中
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                下書き
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(content.pricing?.listPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(content.pricing?.salePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.pricing?.discountPrice ? (
                        <span className="text-red-600 font-medium">
                          {formatPrice(content.pricing.discountPrice)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.pricing?.discountPercentage ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          {content.pricing.discountPercentage}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.pricing?.discountStartDate && content.pricing?.discountEndDate ? (
                        <span>
                          {new Date(content.pricing.discountStartDate).toLocaleDateString()} - {new Date(content.pricing.discountEndDate).toLocaleDateString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.pricing?.lastUpdated ? (
                        <span>
                          {new Date(content.pricing.lastUpdated).toLocaleDateString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewPriceHistory(content.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="価格履歴"
                        >
                          <History className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditPricing(content)}
                          className="text-blue-600 hover:text-blue-900"
                          title="価格編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Pricing Modal */}
      {showEditModal && selectedContent && (
        <PricingEditModal
          content={selectedContent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedContent(null);
          }}
          onSave={handleSavePricing}
        />
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <BulkPricingEditModal
          selectedCount={selectedContents.length}
          onClose={() => setShowBulkEditModal(false)}
          onSave={handleBulkSavePricing}
        />
      )}

      {/* Price History Modal */}
      {showHistoryModal && (
        <PriceHistoryModal
          histories={priceHistories}
          onClose={() => {
            setShowHistoryModal(false);
            setPriceHistories([]);
          }}
        />
      )}
    </div>
  );
};

interface PricingEditModalProps {
  content: LearningContent & { 
    pricing?: {
      listPrice: number;
      salePrice: number;
      discountPrice?: number;
      discountPercentage?: number;
      discountStartDate?: string;
      discountEndDate?: string;
      lastUpdated: string;
      updatedBy: string;
    } 
  };
  onClose: () => void;
  onSave: (pricingData: any) => void;
}

const PricingEditModal: React.FC<PricingEditModalProps> = ({ 
  content, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    listPrice: content.pricing?.listPrice || 0,
    salePrice: content.pricing?.salePrice || 0,
    discountPrice: content.pricing?.discountPrice || 0,
    discountPercentage: content.pricing?.discountPercentage || 0,
    discountStartDate: content.pricing?.discountStartDate || '',
    discountEndDate: content.pricing?.discountEndDate || '',
    applyDiscount: !!content.pricing?.discountPrice,
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
      
      // 自動計算
      if (name === 'listPrice' || name === 'discountPercentage') {
        const listPrice = name === 'listPrice' ? numValue : prev.listPrice;
        const discountPercentage = name === 'discountPercentage' ? numValue : prev.discountPercentage;
        const calculatedDiscountPrice = Math.round(listPrice * (1 - discountPercentage / 100));
        setFormData(prev => ({ 
          ...prev, 
          discountPrice: calculatedDiscountPrice
        }));
      } else if (name === 'discountPrice') {
        const calculatedDiscountPercentage = prev.listPrice > 0 
          ? Math.round((1 - numValue / prev.listPrice) * 100) 
          : 0;
        setFormData(prev => ({ 
          ...prev, 
          discountPercentage: calculatedDiscountPercentage
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pricingData = {
      listPrice: formData.listPrice,
      salePrice: formData.salePrice,
      ...(formData.applyDiscount && {
        discountPrice: formData.discountPrice,
        discountPercentage: formData.discountPercentage,
        discountStartDate: formData.discountStartDate,
        discountEndDate: formData.discountEndDate
      })
    };
    
    onSave(pricingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">価格設定: {content.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              定価
            </label>
            <div className="relative">
              <input
                type="number"
                name="listPrice"
                value={formData.listPrice}
                onChange={handleChange}
                min="0"
                step="100"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Yen className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              販売価格
            </label>
            <div className="relative">
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                min="0"
                step="100"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Yen className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="applyDiscount"
              name="applyDiscount"
              checked={formData.applyDiscount}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="applyDiscount" className="ml-2 block text-sm text-gray-900">
              割引を適用する
            </label>
          </div>
          
          {formData.applyDiscount && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引価格
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.applyDiscount}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Yen className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引率
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.applyDiscount}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引開始日
                  </label>
                  <input
                    type="date"
                    name="discountStartDate"
                    value={formData.discountStartDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.applyDiscount}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引終了日
                  </label>
                  <input
                    type="date"
                    name="discountEndDate"
                    value={formData.discountEndDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.applyDiscount}
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              変更理由
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="例: 夏季キャンペーン"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
            >
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BulkPricingEditModalProps {
  selectedCount: number;
  onClose: () => void;
  onSave: (pricingData: any) => void;
}

const BulkPricingEditModal: React.FC<BulkPricingEditModalProps> = ({ 
  selectedCount, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    updateListPrice: false,
    listPrice: 0,
    updateSalePrice: false,
    salePrice: 0,
    applyDiscount: false,
    discountPercentage: 0,
    discountStartDate: '',
    discountEndDate: '',
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pricingData: any = {};
    
    if (formData.updateListPrice) {
      pricingData.listPrice = formData.listPrice;
    }
    
    if (formData.updateSalePrice) {
      pricingData.salePrice = formData.salePrice;
    }
    
    if (formData.applyDiscount) {
      pricingData.discountPercentage = formData.discountPercentage;
      pricingData.discountStartDate = formData.discountStartDate;
      pricingData.discountEndDate = formData.discountEndDate;
      
      // 各コンテンツの定価に基づいて割引価格を計算
      // 実際の実装では、この計算は個別のコンテンツごとに行う必要があります
      // ここでは単純化のため、onSave側で処理することを想定
    }
    
    onSave(pricingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">一括価格設定 ({selectedCount}件)</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="updateListPrice"
              name="updateListPrice"
              checked={formData.updateListPrice}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="updateListPrice" className="ml-2 block text-sm text-gray-900">
              定価を更新する
            </label>
          </div>
          
          {formData.updateListPrice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                定価
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="listPrice"
                  value={formData.listPrice}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.updateListPrice}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Yen className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="updateSalePrice"
              name="updateSalePrice"
              checked={formData.updateSalePrice}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="updateSalePrice" className="ml-2 block text-sm text-gray-900">
              販売価格を更新する
            </label>
          </div>
          
          {formData.updateSalePrice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                販売価格
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.updateSalePrice}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Yen className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="applyDiscount"
              name="applyDiscount"
              checked={formData.applyDiscount}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="applyDiscount" className="ml-2 block text-sm text-gray-900">
              割引を適用する
            </label>
          </div>
          
          {formData.applyDiscount && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  割引率
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.applyDiscount}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Percent className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引開始日
                  </label>
                  <input
                    type="date"
                    name="discountStartDate"
                    value={formData.discountStartDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.applyDiscount}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    割引終了日
                  </label>
                  <input
                    type="date"
                    name="discountEndDate"
                    value={formData.discountEndDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.applyDiscount}
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              変更理由
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="例: 夏季キャンペーン"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
            >
              一括適用
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PriceHistoryModalProps {
  histories: {
    id: string;
    contentId: string;
    listPrice: number;
    salePrice: number;
    discountPrice?: number;
    discountPercentage?: number;
    effectiveDate: string;
    updatedBy: string;
    reason?: string;
  }[];
  onClose: () => void;
}

const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ 
  histories, 
  onClose 
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString() + '円';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">価格変更履歴</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  適用日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  定価
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  販売価格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  割引価格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  割引率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  変更理由
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {histories.map((history) => (
                <tr key={history.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(history.effectiveDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(history.listPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(history.salePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.discountPrice ? (
                      <span className="text-red-600 font-medium">
                        {formatPrice(history.discountPrice)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.discountPercentage ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {history.discountPercentage}%
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.updatedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.reason || '-'}
                  </td>
                </tr>
              ))}
              {histories.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    価格変更履歴がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};