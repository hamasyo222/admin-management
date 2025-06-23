import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { Company } from '../../types';

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [showContentAccessModal, setShowContentAccessModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, industryFilter, certificationFilter]);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockCompanies: Company[] = [
        {
          id: 'company-1',
          name: '株式会社テックソリューションズ',
          nameKana: 'カブシキガイシャテックソリューションズ',
          industry: 'IT',
          employeeCount: 120,
          address: {
            country: 'Japan',
            prefecture: 'Shizuoka',
            city: 'Hamamatsu',
            street: '中区板屋町111-2',
            postalCode: '430-0000'
          },
          phone: '053-123-4567',
          email: 'info@techsolutions.example.com',
          website: 'https://techsolutions.example.com',
          description: 'IT・システム開発を専門とする企業。Web開発、モバイルアプリ開発、AIソリューションを提供。',
          isSpecificSkillCertified: true,
          certificationNumber: 'SSC-12345',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          code: 'TECH123',
          accessibleContents: ['content-1', 'content-2', 'content-3']
        },
        {
          id: 'company-2',
          name: '浜松製造株式会社',
          nameKana: 'ハママツセイゾウカブシキガイシャ',
          industry: '製造業',
          employeeCount: 250,
          address: {
            country: 'Japan',
            prefecture: 'Shizuoka',
            city: 'Hamamatsu',
            street: '南区若林町123',
            postalCode: '432-0000'
          },
          phone: '053-234-5678',
          email: 'info@hamamatsu-mfg.example.com',
          website: 'https://hamamatsu-mfg.example.com',
          description: '自動車部品、電子部品の製造を行う企業。高品質な製品を国内外に提供。',
          isSpecificSkillCertified: true,
          certificationNumber: 'SSC-23456',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
          code: 'HAMA456',
          accessibleContents: ['content-4']
        },
        {
          id: 'company-3',
          name: '静岡介護サービス株式会社',
          nameKana: 'シズオカカイゴサービスカブシキガイシャ',
          industry: '介護・福祉',
          employeeCount: 80,
          address: {
            country: 'Japan',
            prefecture: 'Shizuoka',
            city: 'Shizuoka',
            street: '葵区追手町456',
            postalCode: '420-0000'
          },
          phone: '054-345-6789',
          email: 'info@shizuoka-care.example.com',
          website: 'https://shizuoka-care.example.com',
          description: '介護施設の運営、訪問介護サービスを提供する企業。',
          isSpecificSkillCertified: true,
          certificationNumber: 'SSC-34567',
          createdAt: '2023-02-01T00:00:00Z',
          updatedAt: '2023-02-01T00:00:00Z',
          code: 'SHIZ789',
          accessibleContents: ['content-5']
        },
        {
          id: 'company-4',
          name: '富士建設株式会社',
          nameKana: 'フジケンセツカブシキガイシャ',
          industry: '建設・不動産',
          employeeCount: 150,
          address: {
            country: 'Japan',
            prefecture: 'Shizuoka',
            city: 'Fuji',
            street: '富士見町789',
            postalCode: '417-0000'
          },
          phone: '0545-67-8901',
          email: 'info@fuji-construction.example.com',
          website: 'https://fuji-construction.example.com',
          description: '建設・土木工事、不動産開発を行う企業。',
          isSpecificSkillCertified: false,
          createdAt: '2023-02-15T00:00:00Z',
          updatedAt: '2023-02-15T00:00:00Z',
          code: 'FUJI012',
          accessibleContents: []
        },
        {
          id: 'company-5',
          name: '静岡フードサービス株式会社',
          nameKana: 'シズオカフードサービスカブシキガイシャ',
          industry: '飲食・宿泊',
          employeeCount: 60,
          address: {
            country: 'Japan',
            prefecture: 'Shizuoka',
            city: 'Shizuoka',
            street: '駿河区南町234',
            postalCode: '422-0000'
          },
          phone: '054-456-7890',
          email: 'info@shizuoka-food.example.com',
          website: 'https://shizuoka-food.example.com',
          description: 'レストラン、カフェの運営、ケータリングサービスを提供する企業。',
          isSpecificSkillCertified: false,
          createdAt: '2023-03-01T00:00:00Z',
          updatedAt: '2023-03-01T00:00:00Z',
          code: 'FOOD345',
          accessibleContents: []
        }
      ];
      
      setCompanies(mockCompanies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading companies:', error);
      setIsLoading(false);
      toast.error(t('common.error'));
    }
  };

  const filterCompanies = () => {
    let filtered = companies;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query) ||
        company.nameKana?.toLowerCase().includes(query) ||
        company.industry?.toLowerCase().includes(query) ||
        company.description?.toLowerCase().includes(query)
      );
    }
    
    // Industry filter
    if (industryFilter) {
      filtered = filtered.filter(company => company.industry === industryFilter);
    }
    
    // Certification filter
    if (certificationFilter !== 'all') {
      const isCertified = certificationFilter === 'certified';
      filtered = filtered.filter(company => company.isSpecificSkillCertified === isCertified);
    }
    
    setFilteredCompanies(filtered);
  };

  const handleAddCompany = () => {
    setShowAddModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleViewEmployees = (company: Company) => {
    setSelectedCompany(company);
    setShowEmployeesModal(true);
  };

  const handleManageContentAccess = (company: Company) => {
    setSelectedCompany(company);
    setShowContentAccessModal(true);
  };

  const handleSaveCompany = (companyData: Partial<Company>) => {
    if (selectedCompany) {
      // Edit existing company
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id === selectedCompany.id ? { ...company, ...companyData, updatedAt: new Date().toISOString() } : company
        )
      );
      toast.success(t('common.success'));
    } else {
      // Add new company
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        name: companyData.name || '',
        nameKana: companyData.nameKana,
        industry: companyData.industry,
        employeeCount: companyData.employeeCount,
        address: companyData.address || {},
        phone: companyData.phone,
        email: companyData.email,
        website: companyData.website,
        description: companyData.description,
        isSpecificSkillCertified: companyData.isSpecificSkillCertified || false,
        certificationNumber: companyData.certificationNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        code: generateCompanyCode()
      };
      
      setCompanies(prevCompanies => [...prevCompanies, newCompany]);
      toast.success(t('common.success'));
    }
    
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const handleSaveContentAccess = (contentIds: string[]) => {
    if (selectedCompany) {
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id === selectedCompany.id ? { ...company, accessibleContents: contentIds, updatedAt: new Date().toISOString() } : company
        )
      );
      toast.success('コンテンツアクセス権限を更新しました');
    }
    
    setShowContentAccessModal(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId: string) => {
    if (confirm(t('common.confirm'))) {
      setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== companyId));
      toast.success(t('common.success'));
    }
  };

  const handleToggleCertification = (companyId: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id === companyId) {
          const isCertified = !company.isSpecificSkillCertified;
          return {
            ...company,
            isSpecificSkillCertified: isCertified,
            certificationNumber: isCertified ? `SSC-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return company;
      })
    );
    toast.success(t('common.success'));
  };

  const getUniqueIndustries = () => {
    const industries = companies.map(company => company.industry).filter(Boolean) as string[];
    return Array.from(new Set(industries));
  };

  const getAddressString = (address?: Partial<{
    country?: string;
    prefecture?: string;
    city?: string;
    street?: string;
    postalCode?: string;
  }>) => {
    if (!address) return '';
    
    const parts = [
      address.postalCode,
      address.prefecture,
      address.city,
      address.street
    ].filter(Boolean);
    
    return parts.join(' ');
  };

  const generateCompanyCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">企業管理</h2>
        <Button
          onClick={handleAddCompany}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          企業追加
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="企業を検索..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">全業種</option>
              {getUniqueIndustries().map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={certificationFilter}
              onChange={(e) => setCertificationFilter(e.target.value)}
            >
              <option value="all">全認証状況</option>
              <option value="certified">特定技能認証あり</option>
              <option value="not_certified">特定技能認証なし</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">企業が見つかりません</h3>
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
                    企業名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    業種
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所在地
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    企業コード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    従業員数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    特定技能認証
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {company.nameKana}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getAddressString(company.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {company.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.employeeCount}名
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.isSpecificSkillCertified ? (
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-sm text-gray-900">{company.certificationNumber}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">未認証</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleManageContentAccess(company)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="コンテンツアクセス管理"
                        >
                          <BookOpenIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewEmployees(company)}
                          className="text-purple-600 hover:text-purple-900"
                          title="従業員一覧"
                        >
                          <UserGroupIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleCertification(company.id)}
                          className={company.isSpecificSkillCertified ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"}
                          title={company.isSpecificSkillCertified ? "認証を解除" : "認証する"}
                        >
                          {company.isSpecificSkillCertified ? (
                            <XMarkIcon className="h-5 w-5" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-blue-600 hover:text-blue-900"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
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

      {/* Add/Edit Company Modal */}
      {(showAddModal || showEditModal) && (
        <CompanyFormModal
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCompany(null);
          }}
          onSave={handleSaveCompany}
          title={showAddModal ? "企業追加" : "企業編集"}
          company={selectedCompany}
        />
      )}

      {/* Employees Modal */}
      {showEmployeesModal && selectedCompany && (
        <EmployeesModal
          company={selectedCompany}
          onClose={() => {
            setShowEmployeesModal(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {/* Content Access Modal */}
      {showContentAccessModal && selectedCompany && (
        <ContentAccessModal
          company={selectedCompany}
          onClose={() => {
            setShowContentAccessModal(false);
            setSelectedCompany(null);
          }}
          onSave={handleSaveContentAccess}
        />
      )}
    </div>
  );
};

interface CompanyFormModalProps {
  onClose: () => void;
  onSave: (companyData: Partial<Company>) => void;
  title: string;
  company?: Company | null;
}

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({ 
  onClose, 
  onSave, 
  title, 
  company 
}) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    nameKana: company?.nameKana || '',
    industry: company?.industry || '',
    employeeCount: company?.employeeCount || 0,
    postalCode: company?.address?.postalCode || '',
    prefecture: company?.address?.prefecture || '',
    city: company?.address?.city || '',
    street: company?.address?.street || '',
    phone: company?.phone || '',
    email: company?.email || '',
    website: company?.website || '',
    description: company?.description || '',
    isSpecificSkillCertified: company?.isSpecificSkillCertified || false,
    certificationNumber: company?.certificationNumber || '',
    code: company?.code || ''
  });
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyData: Partial<Company> = {
      name: formData.name,
      nameKana: formData.nameKana,
      industry: formData.industry,
      employeeCount: formData.employeeCount,
      address: {
        postalCode: formData.postalCode,
        prefecture: formData.prefecture,
        city: formData.city,
        street: formData.street,
        country: 'Japan'
      },
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      description: formData.description,
      isSpecificSkillCertified: formData.isSpecificSkillCertified,
      certificationNumber: formData.isSpecificSkillCertified ? formData.certificationNumber : undefined,
      code: formData.code
    };
    
    onSave(companyData);
  };

  const industryOptions = [
    'IT・情報通信',
    '製造業',
    '建設・不動産',
    '介護・福祉',
    '飲食・宿泊',
    '小売・流通',
    '金融・保険',
    '教育',
    '医療',
    '運輸・物流',
    '農業・林業・水産業',
    'その他'
  ];

  const prefectureOptions = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

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
                企業名
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
                企業名（カナ）
              </label>
              <input
                type="text"
                name="nameKana"
                value={formData.nameKana}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                業種
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">業種を選択</option>
                {industryOptions.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                従業員数
              </label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              企業コード
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              readOnly={!!company} // 既存企業の場合は編集不可
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              この企業コードは企業従業員がアカウント登録時に使用します
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="郵便番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  name="prefecture"
                  value={formData.prefecture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">都道府県を選択</option>
                  {prefectureOptions.map(prefecture => (
                    <option key={prefecture} value={prefecture}>
                      {prefecture}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="市区町村"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="番地・建物名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webサイト
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              企業概要
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isSpecificSkillCertified"
              name="isSpecificSkillCertified"
              checked={formData.isSpecificSkillCertified}
              onChange={(e) => setFormData(prev => ({ ...prev, isSpecificSkillCertified: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSpecificSkillCertified" className="ml-2 block text-sm text-gray-900">
              特定技能受入れ機関認定
            </label>
          </div>
          
          {formData.isSpecificSkillCertified && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                認定番号
              </label>
              <input
                type="text"
                name="certificationNumber"
                value={formData.certificationNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.isSpecificSkillCertified}
              />
            </div>
          )}
          
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

interface EmployeesModalProps {
  company: Company;
  onClose: () => void;
}

const EmployeesModal: React.FC<EmployeesModalProps> = ({ company, onClose }) => {
  // Mock employees data
  const employees = [
    {
      id: 'user-1',
      name: '山田太郎',
      email: 'company@dxseed.com',
      role: 'company_admin',
      status: 'active',
      joinedAt: '2023-01-15T00:00:00Z'
    },
    {
      id: 'user-2',
      name: '鈴木次郎',
      email: 'employee@dxseed.com',
      role: 'company_employee',
      status: 'active',
      joinedAt: '2023-02-01T00:00:00Z'
    },
    {
      id: 'user-3',
      name: '佐藤三郎',
      email: 'sato@example.com',
      role: 'company_employee',
      status: 'inactive',
      joinedAt: '2023-03-15T00:00:00Z'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">従業員一覧: {company.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">企業情報</h4>
                <p className="text-sm text-blue-700">
                  企業コード: <span className="font-mono font-medium">{company.code}</span>
                </p>
                <p className="text-sm text-blue-700">
                  このコードを従業員に共有して、アカウント登録時に使用してもらいます。
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    従業員名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    役割
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.role === 'company_admin' ? '企業管理者' : '企業従業員'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employee.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {employees.length === 0 && (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">従業員がいません</h3>
              <p className="mt-1 text-sm text-gray-500">
                この企業にはまだ従業員が登録されていません
              </p>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContentAccessModalProps {
  company: Company;
  onClose: () => void;
  onSave: (contentIds: string[]) => void;
}

const ContentAccessModal: React.FC<ContentAccessModalProps> = ({ company, onClose, onSave }) => {
  // Mock content data
  const mockContents = [
    { id: 'content-1', title: 'JavaScript基礎講座', category: 'プログラミング基礎', targetAudience: 'dx_talent' },
    { id: 'content-2', title: 'Python データ分析入門', category: 'データ分析', targetAudience: 'dx_talent' },
    { id: 'content-3', title: '機械学習アルゴリズム基礎', category: 'AI・機械学習', targetAudience: 'dx_talent' },
    { id: 'content-4', title: 'React フロントエンド開発', category: 'プログラミング基礎', targetAudience: 'dx_talent' },
    { id: 'content-5', title: '日本語会話基礎', category: '日本語学習', targetAudience: 'foreign_talent' }
  ];
  
  const [selectedContents, setSelectedContents] = useState<string[]>(
    company.accessibleContents || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContents = mockContents.filter(content => 
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleContent = (contentId: string) => {
    if (selectedContents.includes(contentId)) {
      setSelectedContents(prev => prev.filter(id => id !== contentId));
    } else {
      setSelectedContents(prev => [...prev, contentId]);
    }
  };

  const handleSelectAll = () => {
    setSelectedContents(filteredContents.map(content => content.id));
  };

  const handleDeselectAll = () => {
    setSelectedContents([]);
  };

  const handleSave = () => {
    onSave(selectedContents);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">コンテンツアクセス管理</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {company.name}
            </h4>
            <p className="text-sm text-gray-600">
              この企業の従業員がアクセスできるコンテンツを選択してください
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="コンテンツを検索..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSelectAll}
              >
                すべて選択
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeselectAll}
              >
                選択解除
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    選択
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コンテンツ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    対象者
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map(content => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContents.includes(content.id)}
                        onChange={() => handleToggleContent(content.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {content.targetAudience === 'dx_talent' ? 'DX人材' : 
                         content.targetAudience === 'foreign_talent' ? '海外人材' : '両方'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredContents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      コンテンツが見つかりません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">選択中:</span> {selectedContents.length}コンテンツ
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};