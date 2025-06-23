import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { LearningContent, ContentCategory } from '../../types';

export const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [filteredContents, setFilteredContents] = useState<LearningContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<LearningContent | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadContents();
    loadCategories();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, searchQuery, categoryFilter, statusFilter, audienceFilter]);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockContents: LearningContent[] = [
        {
          id: 'content-1',
          title: 'JavaScript基礎講座',
          titleTranslations: { en: 'JavaScript Fundamentals' },
          description: 'JavaScriptの基本文法から始めて、実際のアプリケーション開発まで学習します。',
          descriptionTranslations: { en: 'Learn JavaScript from basic syntax to real application development.' },
          categoryId: 'cat-1',
          contentType: 'video',
          contentTypes: ['video', 'quiz'],
          difficultyLevel: 'beginner',
          estimatedDuration: 120,
          thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          publishedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin-1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-2',
          title: 'Python データ分析入門',
          titleTranslations: { en: 'Python Data Analysis Introduction' },
          description: 'Pythonを使ったデータ分析の基礎を学習します。pandas、matplotlib等のライブラリの使い方も解説。',
          descriptionTranslations: { en: 'Learn the basics of data analysis using Python, including pandas and matplotlib libraries.' },
          categoryId: 'cat-2',
          contentType: 'video',
          contentTypes: ['video', 'text', 'quiz'],
          difficultyLevel: 'intermediate',
          estimatedDuration: 180,
          thumbnailUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          publishedAt: '2024-01-02T00:00:00Z',
          createdBy: 'admin-1',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-3',
          title: '機械学習アルゴリズム基礎',
          titleTranslations: { en: 'Machine Learning Algorithms Basics' },
          description: '機械学習の主要なアルゴリズムを理論と実践の両面から学習します。',
          descriptionTranslations: { en: 'Learn major machine learning algorithms from both theoretical and practical perspectives.' },
          categoryId: 'cat-3',
          contentType: 'video',
          contentTypes: ['video', 'interactive'],
          difficultyLevel: 'advanced',
          estimatedDuration: 240,
          thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          publishedAt: '2024-01-03T00:00:00Z',
          createdBy: 'admin-1',
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z',
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-4',
          title: 'React フロントエンド開発',
          titleTranslations: { en: 'React Frontend Development' },
          description: 'Reactを使ったモダンなフロントエンド開発の手法を学びます。',
          descriptionTranslations: { en: 'Learn modern frontend development techniques using React.' },
          categoryId: 'cat-1',
          contentType: 'video',
          contentTypes: ['video', 'quiz'],
          difficultyLevel: 'intermediate',
          estimatedDuration: 200,
          thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: false,
          createdBy: 'admin-1',
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-04T00:00:00Z',
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-5',
          title: '日本語会話基礎',
          titleTranslations: { en: 'Basic Japanese Conversation', vi: 'Hội thoại tiếng Nhật cơ bản' },
          description: '日常生活や職場で使える基本的な日本語会話を学びます。',
          descriptionTranslations: { 
            en: 'Learn basic Japanese conversation for daily life and workplace.',
            vi: 'Học hội thoại tiếng Nhật cơ bản để sử dụng trong cuộc sống hàng ngày và nơi làm việc.'
          },
          categoryId: 'cat-4',
          contentType: 'video',
          contentTypes: ['video', 'quiz', 'interactive'],
          difficultyLevel: 'beginner',
          estimatedDuration: 150,
          thumbnailUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          publishedAt: '2024-01-05T00:00:00Z',
          createdBy: 'admin-1',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-05T00:00:00Z',
          targetAudience: 'foreign_talent'
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

  const loadCategories = async () => {
    try {
      // Mock data - in a real app, this would be an API call
      const mockCategories: ContentCategory[] = [
        {
          id: 'cat-1',
          name: 'プログラミング基礎',
          nameTranslations: { en: 'Programming Basics' },
          description: 'プログラミングの基本的なスキルを学習',
          sortOrder: 1,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-2',
          name: 'データ分析',
          nameTranslations: { en: 'Data Analysis' },
          description: 'データ分析の手法とツールを学習',
          sortOrder: 2,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-3',
          name: 'AI・機械学習',
          nameTranslations: { en: 'AI & Machine Learning' },
          description: 'AI・機械学習の基礎から応用まで',
          sortOrder: 3,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-4',
          name: '日本語学習',
          nameTranslations: { 
            en: 'Japanese Language Learning',
            vi: 'Học tiếng Nhật'
          },
          description: '日本語の会話、読み書きスキルを学習',
          sortOrder: 4,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
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
    
    // Status filter
    if (statusFilter !== 'all') {
      const isPublished = statusFilter === 'published';
      filtered = filtered.filter(content => content.isPublished === isPublished);
    }
    
    // Audience filter
    if (audienceFilter !== 'all') {
      filtered = filtered.filter(content => 
        content.targetAudience === audienceFilter || content.targetAudience === 'both'
      );
    }
    
    setFilteredContents(filtered);
  };

  const handleAddContent = () => {
    setShowAddModal(true);
  };

  const handleEditContent = (content: LearningContent) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

  const handleSaveContent = (contentData: Partial<LearningContent>) => {
    if (selectedContent) {
      // Edit existing content
      setContents(prevContents => 
        prevContents.map(content => 
          content.id === selectedContent.id ? { ...content, ...contentData, updatedAt: new Date().toISOString() } : content
        )
      );
      toast.success(t('common.success'));
    } else {
      // Add new content
      const newContent: LearningContent = {
        id: `content-${Date.now()}`,
        title: contentData.title || '',
        titleTranslations: contentData.titleTranslations || { en: '' },
        description: contentData.description || '',
        descriptionTranslations: contentData.descriptionTranslations || { en: '' },
        categoryId: contentData.categoryId || '',
        contentType: contentData.contentType || 'video',
        contentTypes: contentData.contentTypes || ['video'],
        difficultyLevel: contentData.difficultyLevel || 'beginner',
        estimatedDuration: contentData.estimatedDuration || 60,
        thumbnailUrl: contentData.thumbnailUrl || '',
        isPublished: contentData.isPublished || false,
        publishedAt: contentData.isPublished ? new Date().toISOString() : undefined,
        createdBy: 'admin-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetAudience: contentData.targetAudience || 'dx_talent'
      };
      
      setContents(prevContents => [...prevContents, newContent]);
      toast.success(t('common.success'));
    }
    
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedContent(null);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm(t('common.confirm'))) {
      setContents(prevContents => prevContents.filter(content => content.id !== contentId));
      toast.success(t('common.success'));
    }
  };

  const handleTogglePublish = (contentId: string) => {
    setContents(prevContents => 
      prevContents.map(content => {
        if (content.id === contentId) {
          const isPublished = !content.isPublished;
          return {
            ...content,
            isPublished,
            publishedAt: isPublished ? new Date().toISOString() : content.publishedAt,
            updatedAt: new Date().toISOString()
          };
        }
        return content;
      })
    );
    toast.success(t('common.success'));
  };

  const handleAddCategory = (categoryData: Partial<ContentCategory>) => {
    const newCategory: ContentCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name || '',
      nameTranslations: categoryData.nameTranslations || { en: '' },
      description: categoryData.description || '',
      sortOrder: categories.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setShowCategoryModal(false);
    toast.success(t('common.success'));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getDifficultyLabel = (level: string) => {
    return t(`lms.difficulty.${level}`);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceLabel = (audience?: string) => {
    switch (audience) {
      case 'dx_talent': return 'DX人材';
      case 'foreign_talent': return '海外人材';
      case 'both': return '両方';
      default: return '未設定';
    }
  };

  const getAudienceBadge = (audience?: string) => {
    switch (audience) {
      case 'dx_talent':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">DX人材</span>;
      case 'foreign_talent':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">海外人材</span>;
      case 'both':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">両方</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">未設定</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">コンテンツ管理</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowCategoryModal(true)}
          >
            カテゴリ追加
          </Button>
          <Button
            onClick={handleAddContent}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            コンテンツ追加
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
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">全ステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
            >
              <option value="all">全対象者</option>
              <option value="dx_talent">DX人材</option>
              <option value="foreign_talent">海外人材</option>
              <option value="both">両方</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コンテンツ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    対象者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    難易度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
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
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {content.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(content.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAudienceBadge(content.targetAudience)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(content.difficultyLevel)}`}>
                        {getDifficultyLabel(content.difficultyLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.estimatedDuration}分
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {content.isPublished ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          公開中
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          下書き
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublish(content.id)}
                          className={content.isPublished ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"}
                          title={content.isPublished ? "下書きに戻す" : "公開する"}
                        >
                          {content.isPublished ? (
                            <ClockIcon className="h-5 w-5" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditContent(content)}
                          className="text-blue-600 hover:text-blue-900"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600 hover:text-red-900"
                          title="削除"
                        >
                          <TrashIcon className="h-5 w-5" />
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

      {/* Add/Edit Content Modal */}
      {(showAddModal || showEditModal) && (
        <ContentFormModal
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedContent(null);
          }}
          onSave={handleSaveContent}
          title={showAddModal ? "コンテンツ追加" : "コンテンツ編集"}
          content={selectedContent}
          categories={categories}
        />
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <CategoryFormModal
          onClose={() => setShowCategoryModal(false)}
          onSave={handleAddCategory}
        />
      )}
    </div>
  );
};

interface ContentFormModalProps {
  onClose: () => void;
  onSave: (contentData: Partial<LearningContent>) => void;
  title: string;
  content?: LearningContent | null;
  categories: ContentCategory[];
}

const ContentFormModal: React.FC<ContentFormModalProps> = ({ 
  onClose, 
  onSave, 
  title, 
  content, 
  categories 
}) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    titleEn: content?.titleTranslations?.en || '',
    description: content?.description || '',
    descriptionEn: content?.descriptionTranslations?.en || '',
    categoryId: content?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    contentType: content?.contentType || 'video',
    contentTypes: content?.contentTypes || ['video'],
    difficultyLevel: content?.difficultyLevel || 'beginner',
    estimatedDuration: content?.estimatedDuration || 60,
    thumbnailUrl: content?.thumbnailUrl || '',
    isPublished: content?.isPublished || false,
    targetAudience: content?.targetAudience || 'dx_talent'
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentTypeChange = (type: string) => {
    const currentTypes = [...formData.contentTypes];
    if (currentTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        contentTypes: currentTypes.filter(t => t !== type)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contentTypes: [...currentTypes, type]
      }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          thumbnailUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, you would upload the thumbnail file to a server
    // and get back a URL to store in the database
    
    const contentData: Partial<LearningContent> = {
      title: formData.title,
      titleTranslations: { en: formData.titleEn },
      description: formData.description,
      descriptionTranslations: { en: formData.descriptionEn },
      categoryId: formData.categoryId,
      contentType: formData.contentType as 'video' | 'text' | 'quiz' | 'interactive',
      contentTypes: formData.contentTypes,
      difficultyLevel: formData.difficultyLevel as 'beginner' | 'intermediate' | 'advanced',
      estimatedDuration: Number(formData.estimatedDuration),
      thumbnailUrl: formData.thumbnailUrl,
      isPublished: formData.isPublished,
      targetAudience: formData.targetAudience as 'dx_talent' | 'foreign_talent' | 'both'
    };
    
    onSave(contentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル (日本語)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル (英語)
              </label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明 (日本語)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明 (英語)
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主要コンテンツタイプ
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="video">ビデオ</option>
                <option value="text">テキスト</option>
                <option value="quiz">クイズ</option>
                <option value="interactive">インタラクティブ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                難易度
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                コンテンツタイプ（複数選択可）
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="type-video"
                    checked={formData.contentTypes.includes('video')}
                    onChange={() => handleContentTypeChange('video')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-video" className="ml-2 block text-sm text-gray-900">
                    ビデオ
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="type-text"
                    checked={formData.contentTypes.includes('text')}
                    onChange={() => handleContentTypeChange('text')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-text" className="ml-2 block text-sm text-gray-900">
                    テキスト
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="type-quiz"
                    checked={formData.contentTypes.includes('quiz')}
                    onChange={() => handleContentTypeChange('quiz')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-quiz" className="ml-2 block text-sm text-gray-900">
                    クイズ
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="type-interactive"
                    checked={formData.contentTypes.includes('interactive')}
                    onChange={() => handleContentTypeChange('interactive')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="type-interactive" className="ml-2 block text-sm text-gray-900">
                    インタラクティブ
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対象ユーザー
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="dx_talent">DX人材</option>
                <option value="foreign_talent">海外人材</option>
                <option value="both">両方</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                推定時間 (分)
              </label>
              <input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サムネイル
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      placeholder="画像URL または ファイルをアップロード"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="thumbnail"
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4" />
                    </label>
                  </div>
                </div>
                {formData.thumbnailUrl && (
                  <div className="h-16 w-16 border border-gray-200 rounded overflow-hidden">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              公開する
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
            >
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CategoryFormModalProps {
  onClose: () => void;
  onSave: (categoryData: Partial<ContentCategory>) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: ''
  });
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData: Partial<ContentCategory> = {
      name: formData.name,
      nameTranslations: { en: formData.nameEn },
      description: formData.description
    };
    
    onSave(categoryData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">カテゴリ追加</h3>
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
              カテゴリ名 (日本語)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ名 (英語)
            </label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
            >
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};