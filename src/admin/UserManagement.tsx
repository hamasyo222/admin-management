import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  companyId?: string;
  companyName?: string;
  companyCode?: string;
  accessibleContents?: string[];
}

interface Company {
  id: string;
  name: string;
  code: string;
  industry: string;
  employeeCount: number;
}

// Export getUserTypeLabel function to make it accessible to other components
export const getUserTypeLabel = (userType: string) => {
  switch (userType) {
    case 'admin':
      return 'システム管理者';
    case 'company_admin':
      return '企業管理者';
    case 'company_employee':
      return '企業従業員';
    case 'dx_talent':
      return 'DX人材';
    case 'foreign_talent':
      return '海外人材';
    case 'support_staff':
      return 'サポートスタッフ';
    default:
      return userType;
  }
};

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContentAccessModal, setShowContentAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, userTypeFilter, statusFilter, companyFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@dxseed.com',
          firstName: '管理者',
          lastName: 'システム',
          userType: 'admin',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-01-01T00:00:00Z',
          lastLoginAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          email: 'company@dxseed.com',
          firstName: '太郎',
          lastName: '山田',
          userType: 'company_admin',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-01-15T00:00:00Z',
          lastLoginAt: '2024-01-14T14:20:00Z',
          companyId: 'company-1',
          companyName: '株式会社テックソリューションズ',
          companyCode: 'TECH123'
        },
        {
          id: '3',
          email: 'employee@dxseed.com',
          firstName: '次郎',
          lastName: '鈴木',
          userType: 'company_employee',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-02-01T00:00:00Z',
          lastLoginAt: '2024-01-13T09:15:00Z',
          companyId: 'company-1',
          companyName: '株式会社テックソリューションズ'
        },
        {
          id: '4',
          email: 'dx-talent@dxseed.com',
          firstName: '花子',
          lastName: '佐藤',
          userType: 'dx_talent',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-02-01T00:00:00Z',
          lastLoginAt: '2024-01-13T09:15:00Z',
          accessibleContents: ['content-1', 'content-2']
        },
        {
          id: '5',
          email: 'foreign-talent@dxseed.com',
          firstName: 'ヴァン・アン',
          lastName: 'グエン',
          userType: 'foreign_talent',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-02-15T00:00:00Z',
          lastLoginAt: '2024-01-12T16:45:00Z',
          accessibleContents: ['content-5']
        },
        {
          id: '6',
          email: 'support@dxseed.com',
          firstName: '健太',
          lastName: '鈴木',
          userType: 'support_staff',
          status: 'active',
          emailVerified: true,
          createdAt: '2023-03-01T00:00:00Z',
          lastLoginAt: '2024-01-11T11:30:00Z'
        },
        {
          id: '7',
          email: 'inactive@dxseed.com',
          firstName: '美咲',
          lastName: '田中',
          userType: 'dx_talent',
          status: 'inactive',
          emailVerified: true,
          createdAt: '2023-03-15T00:00:00Z',
          lastLoginAt: '2023-10-01T08:20:00Z'
        },
        {
          id: '8',
          email: 'suspended@dxseed.com',
          firstName: '次郎',
          lastName: '高橋',
          userType: 'company_employee',
          status: 'suspended',
          emailVerified: true,
          createdAt: '2023-04-01T00:00:00Z',
          lastLoginAt: '2023-09-15T13:10:00Z',
          companyId: 'company-2',
          companyName: '浜松製造株式会社'
        }
      ];
      
      setUsers(mockUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsLoading(false);
      toast.error(t('common.error'));
    }
  };

  const loadCompanies = async () => {
    try {
      // Mock data - in a real app, this would be an API call
      const mockCompanies: Company[] = [
        {
          id: 'company-1',
          name: '株式会社テックソリューションズ',
          code: 'TECH123',
          industry: 'IT',
          employeeCount: 50
        },
        {
          id: 'company-2',
          name: '浜松製造株式会社',
          code: 'HAMA456',
          industry: '製造業',
          employeeCount: 120
        },
        {
          id: 'company-3',
          name: '静岡介護サービス株式会社',
          code: 'SHIZ789',
          industry: '介護・福祉',
          employeeCount: 35
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error(t('common.error'));
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        (user.companyName && user.companyName.toLowerCase().includes(query))
      );
    }
    
    // User type filter
    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.userType === userTypeFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(user => user.companyId === companyFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleManageContentAccess = (user: User) => {
    setSelectedUser(user);
    setShowContentAccessModal(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData } : user
        )
      );
      toast.success(t('common.success'));
    } else {
      // Add new user
      const newUser: User = {
        id: `new-${Date.now()}`,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        userType: userData.userType || 'dx_talent',
        status: userData.status || 'active',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        companyId: userData.companyId,
        companyName: userData.companyName
      };
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      toast.success(t('common.success'));
    }
    
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleSaveContentAccess = (contentIds: string[]) => {
    if (selectedUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, accessibleContents: contentIds } : user
        )
      );
      toast.success('コンテンツアクセス権限を更新しました');
    }
    
    setShowContentAccessModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm(t('common.confirm'))) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success(t('common.success'));
    }
  };

  const handleChangeStatus = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success(t('common.success'));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">アクティブ</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">非アクティブ</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">停止中</span>;
      default:
        return null;
    }
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
        <h2 className="text-xl font-semibold text-gray-900">ユーザー管理</h2>
        <Button
          onClick={handleAddUser}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          ユーザー追加
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
                placeholder="ユーザーを検索..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">全ユーザー種別</option>
              <option value="admin">システム管理者</option>
              <option value="company_admin">企業管理者</option>
              <option value="company_employee">企業従業員</option>
              <option value="dx_talent">DX人材</option>
              <option value="foreign_talent">海外人材</option>
              <option value="support_staff">サポートスタッフ</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">全ステータス</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
              <option value="suspended">停止中</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="all">全企業</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">ユーザーが見つかりません</h3>
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
                    ユーザー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    企業
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終ログイン
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.lastName} {user.firstName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            {user.email}
                            {user.emailVerified && (
                              <CheckIcon className="ml-1 h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getUserTypeLabel(user.userType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.companyName ? (
                        <div>
                          <div className="text-sm text-gray-900">{user.companyName}</div>
                          {user.userType === 'company_admin' && user.companyCode && (
                            <div className="text-xs text-gray-500">
                              企業コード: {user.companyCode}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {(user.userType === 'dx_talent' || user.userType === 'foreign_talent' || 
                          user.userType === 'company_admin' || user.userType === 'company_employee') && (
                          <button
                            onClick={() => handleManageContentAccess(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="コンテンツアクセス管理"
                          >
                            <BookOpenIcon className="h-5 w-5" />
                          </button>
                        )}
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">
                            <ShieldCheckIcon className="h-5 w-5" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button
                              onClick={() => handleChangeStatus(user.id, 'active')}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              disabled={user.status === 'active'}
                            >
                              アクティブ化
                            </button>
                            <button
                              onClick={() => handleChangeStatus(user.id, 'inactive')}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              disabled={user.status === 'inactive'}
                            >
                              非アクティブ化
                            </button>
                            <button
                              onClick={() => handleChangeStatus(user.id, 'suspended')}
                              className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                              disabled={user.status === 'suspended'}
                            >
                              アカウント停止
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Add User Modal */}
      {showAddModal && (
        <UserFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveUser}
          title="ユーザー追加"
          companies={companies}
          generateCompanyCode={generateCompanyCode}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <UserFormModal
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
          title="ユーザー編集"
          user={selectedUser}
          companies={companies}
          generateCompanyCode={generateCompanyCode}
        />
      )}

      {/* Content Access Modal */}
      {showContentAccessModal && selectedUser && (
        <ContentAccessModal
          onClose={() => {
            setShowContentAccessModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveContentAccess}
          user={selectedUser}
        />
      )}
    </div>
  );
};

interface UserFormModalProps {
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  title: string;
  user?: User;
  companies: Company[];
  generateCompanyCode: () => string;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ 
  onClose, 
  onSave, 
  title, 
  user,
  companies,
  generateCompanyCode
}) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userType: user?.userType || 'dx_talent',
    status: user?.status || 'active',
    password: '',
    companyId: user?.companyId || '',
    companyCode: user?.companyCode || '',
    companyName: user?.companyName || '',
    phone: '',
    bio: ''
  });
  
  const [companyCodeInput, setCompanyCodeInput] = useState('');
  const [showCompanyFields, setShowCompanyFields] = useState(
    user?.userType === 'company_admin' || user?.userType === 'company_employee'
  );
  const [isNewCompany, setIsNewCompany] = useState(false);
  
  const { t } = useTranslation();

  useEffect(() => {
    // When userType changes, update showCompanyFields
    setShowCompanyFields(
      formData.userType === 'company_admin' || formData.userType === 'company_employee'
    );
    
    // Reset company fields if not company user
    if (formData.userType !== 'company_admin' && formData.userType !== 'company_employee') {
      setFormData(prev => ({
        ...prev,
        companyId: '',
        companyName: '',
        companyCode: ''
      }));
      setIsNewCompany(false);
    }
  }, [formData.userType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If selecting a company from dropdown
    if (name === 'companyId' && value) {
      const selectedCompany = companies.find(c => c.id === value);
      if (selectedCompany) {
        setFormData(prev => ({
          ...prev,
          companyName: selectedCompany.name,
          companyCode: formData.userType === 'company_admin' ? selectedCompany.code : ''
        }));
        setIsNewCompany(false);
      } else if (value === 'new') {
        setIsNewCompany(true);
        setFormData(prev => ({
          ...prev,
          companyName: '',
          companyCode: formData.userType === 'company_admin' ? generateCompanyCode() : ''
        }));
      }
    }
  };

  const handleCompanyCodeSubmit = () => {
    // Find company by code
    const company = companies.find(c => c.code === companyCodeInput);
    if (company) {
      setFormData(prev => ({
        ...prev,
        companyId: company.id,
        companyName: company.name
      }));
      toast.success('企業が見つかりました');
    } else {
      toast.error('企業コードが見つかりません');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate company fields for company users
    if ((formData.userType === 'company_admin' || formData.userType === 'company_employee') && 
        !formData.companyId && !isNewCompany && !companyCodeInput) {
      toast.error('企業情報を入力してください');
      return;
    }
    
    // For company_employee, require company code
    if (formData.userType === 'company_employee' && !formData.companyId && !companyCodeInput) {
      toast.error('企業コードを入力してください');
      return;
    }
    
    // For new company_admin, generate company code if not exists
    if (formData.userType === 'company_admin' && isNewCompany && !formData.companyCode) {
      setFormData(prev => ({
        ...prev,
        companyCode: generateCompanyCode()
      }));
    }
    
    const userData: Partial<User> = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userType: formData.userType,
      status: formData.status as 'active' | 'inactive' | 'suspended',
      companyId: formData.companyId || (isNewCompany ? `new-company-${Date.now()}` : undefined),
      companyName: formData.companyName || undefined,
      companyCode: formData.userType === 'company_admin' ? formData.companyCode : undefined
    };
    
    onSave(userData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー種別
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="admin">システム管理者</option>
              <option value="company_admin">企業管理者</option>
              <option value="company_employee">企業従業員</option>
              <option value="dx_talent">DX人材</option>
              <option value="foreign_talent">海外人材</option>
              <option value="support_staff">サポートスタッフ</option>
            </select>
          </div>
          
          {showCompanyFields && (
            <>
              {formData.userType === 'company_admin' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企業
                  </label>
                  <select
                    name="companyId"
                    value={formData.companyId || 'new'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="new">新規企業を登録</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企業コード
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={companyCodeInput}
                      onChange={(e) => setCompanyCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="企業管理者から提供された企業コード"
                    />
                    <button
                      type="button"
                      onClick={handleCompanyCodeSubmit}
                      className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      確認
                    </button>
                  </div>
                  {formData.companyName && (
                    <p className="mt-1 text-sm text-green-600">
                      企業: {formData.companyName}
                    </p>
                  )}
                </div>
              )}
              
              {isNewCompany && formData.userType === 'company_admin' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      企業名
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      企業コード (自動生成)
                    </label>
                    <input
                      type="text"
                      name="companyCode"
                      value={formData.companyCode}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      この企業コードを企業従業員に共有してください。登録時に必要となります。
                    </p>
                  </div>
                </>
              )}
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
              <option value="suspended">停止中</option>
            </select>
          </div>
          
          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!user}
                minLength={8}
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

interface ContentAccessModalProps {
  onClose: () => void;
  onSave: (contentIds: string[]) => void;
  user: User;
}

const ContentAccessModal: React.FC<ContentAccessModalProps> = ({ onClose, onSave, user }) => {
  // Mock content data
  const mockContents = [
    { id: 'content-1', title: 'JavaScript基礎講座', category: 'プログラミング基礎', targetAudience: 'dx_talent' },
    { id: 'content-2', title: 'Python データ分析入門', category: 'データ分析', targetAudience: 'dx_talent' },
    { id: 'content-3', title: '機械学習アルゴリズム基礎', category: 'AI・機械学習', targetAudience: 'dx_talent' },
    { id: 'content-4', title: 'React フロントエンド開発', category: 'プログラミング基礎', targetAudience: 'dx_talent' },
    { id: 'content-5', title: '日本語会話基礎', category: '日本語学習', targetAudience: 'foreign_talent' }
  ];
  
  const [selectedContents, setSelectedContents] = useState<string[]>(
    user.accessibleContents || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContents = mockContents.filter(content => 
    (content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     content.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (user.userType === 'company_admin' || user.userType === 'company_employee' || 
     content.targetAudience === user.userType || content.targetAudience === 'both')
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
              {user.lastName} {user.firstName} ({getUserTypeLabel(user.userType)})
            </h4>
            <p className="text-sm text-gray-600">
              このユーザーがアクセスできるコンテンツを選択してください
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