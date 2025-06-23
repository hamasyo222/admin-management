import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { useLMSStore } from '../../stores/lmsStore';
import { useAuthStore } from '../../stores/authStore';
import { LearningProgress, LearningContent, User } from '../../types';
import { getUserTypeLabel } from '../../components/admin/UserManagement';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { UserProgressDetail } from '../../components/admin/UserProgressDetail';

const LearningProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'analytics'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [allUserProgress, setAllUserProgress] = useState<Record<string, LearningProgress[]>>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'userType' | 'completedCourses' | 'inProgressCourses' | 'totalTime'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { t } = useTranslation();
  const { contents, fetchContents } = useLMSStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchContents();
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, userTypeFilter, progressFilter, sortField, sortDirection]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data
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
        }
      ];
      
      setUsers(mockUsers);
      
      // Load progress for each user
      const progressByUser: Record<string, LearningProgress[]> = {};
      
      // In a real implementation, this would call an API
      // For now, we'll generate mock data
      mockUsers.forEach(user => {
        // Generate random progress for each user
        const userProgressData: LearningProgress[] = [];
        
        // For DX talent, add completed JavaScript course
        if (user.userType === 'dx_talent') {
          userProgressData.push({
            id: `progress-${user.id}-1`,
            userId: user.id,
            contentId: 'content-1',
            status: 'completed',
            progressPercentage: 100,
            startedAt: '2024-01-10T00:00:00Z',
            completedAt: '2024-01-15T00:00:00Z',
            lastAccessedAt: '2024-01-15T00:00:00Z',
            timeSpent: 36000, // 10 hours in seconds
            attempts: 1,
            bestScore: 95,
          });
          
          // Add in-progress Python course
          userProgressData.push({
            id: `progress-${user.id}-2`,
            userId: user.id,
            contentId: 'content-2',
            status: 'in_progress',
            progressPercentage: 60,
            startedAt: '2024-01-16T00:00:00Z',
            lastAccessedAt: '2024-01-20T00:00:00Z',
            timeSpent: 25200, // 7 hours in seconds
            attempts: 1,
          });
        }
        
        // For foreign talent, add in-progress Japanese course
        if (user.userType === 'foreign_talent') {
          userProgressData.push({
            id: `progress-${user.id}-1`,
            userId: user.id,
            contentId: 'content-5',
            status: 'in_progress',
            progressPercentage: 75,
            startedAt: '2024-01-05T00:00:00Z',
            lastAccessedAt: '2024-01-18T00:00:00Z',
            timeSpent: 28800, // 8 hours in seconds
            attempts: 1,
          });
        }
        
        // For company employee, add some courses
        if (user.userType === 'company_employee') {
          userProgressData.push({
            id: `progress-${user.id}-1`,
            userId: user.id,
            contentId: 'content-1',
            status: 'completed',
            progressPercentage: 100,
            startedAt: '2024-01-05T00:00:00Z',
            completedAt: '2024-01-12T00:00:00Z',
            lastAccessedAt: '2024-01-12T00:00:00Z',
            timeSpent: 32400, // 9 hours in seconds
            attempts: 1,
            bestScore: 88,
          });
          
          userProgressData.push({
            id: `progress-${user.id}-2`,
            userId: user.id,
            contentId: 'content-5',
            status: 'in_progress',
            progressPercentage: 30,
            startedAt: '2024-01-15T00:00:00Z',
            lastAccessedAt: '2024-01-19T00:00:00Z',
            timeSpent: 10800, // 3 hours in seconds
            attempts: 1,
          });
        }
        
        progressByUser[user.id] = userProgressData;
      });
      
      setAllUserProgress(progressByUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsLoading(false);
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
    
    // Progress filter
    if (progressFilter !== 'all') {
      filtered = filtered.filter(user => {
        const userProgress = allUserProgress[user.id] || [];
        
        if (progressFilter === 'completed') {
          return userProgress.some(p => p.status === 'completed');
        } else if (progressFilter === 'in_progress') {
          return userProgress.some(p => p.status === 'in_progress');
        } else if (progressFilter === 'not_started') {
          return userProgress.length === 0;
        }
        
        return true;
      });
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        const nameA = `${a.lastName} ${a.firstName}`;
        const nameB = `${b.lastName} ${b.firstName}`;
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      } else if (sortField === 'userType') {
        return sortDirection === 'asc'
          ? a.userType.localeCompare(b.userType)
          : b.userType.localeCompare(a.userType);
      } else if (sortField === 'completedCourses') {
        const completedA = (allUserProgress[a.id] || []).filter(p => p.status === 'completed').length;
        const completedB = (allUserProgress[b.id] || []).filter(p => p.status === 'completed').length;
        return sortDirection === 'asc' ? completedA - completedB : completedB - completedA;
      } else if (sortField === 'inProgressCourses') {
        const inProgressA = (allUserProgress[a.id] || []).filter(p => p.status === 'in_progress').length;
        const inProgressB = (allUserProgress[b.id] || []).filter(p => p.status === 'in_progress').length;
        return sortDirection === 'asc' ? inProgressA - inProgressB : inProgressB - inProgressA;
      } else if (sortField === 'totalTime') {
        const timeA = (allUserProgress[a.id] || []).reduce((sum, p) => sum + p.timeSpent, 0);
        const timeB = (allUserProgress[b.id] || []).reduce((sum, p) => sum + p.timeSpent, 0);
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      
      return 0;
    });
    
    setFilteredUsers(filtered);
  };

  const handleSort = (field: 'name' | 'userType' | 'completedCourses' | 'inProgressCourses' | 'totalTime') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportReport = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set font for Japanese support
      doc.setFont('helvetica');
      doc.setLanguage('ja');
      
      // Add title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('学習進捗レポート', 105, 20, { align: 'center' });
      
      // Add report info
      doc.setFontSize(12);
      doc.text(`生成日: ${new Date().toLocaleDateString('ja-JP')}`, 20, 30);
      doc.text(`ユーザー数: ${filteredUsers.length}`, 20, 40);
      
      // Add table header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ユーザー名', 20, 60);
      doc.text('ユーザー種別', 80, 60);
      doc.text('完了コース', 130, 60);
      doc.text('学習中コース', 160, 60);
      doc.text('総学習時間', 190, 60);
      
      // Draw header line
      doc.setLineWidth(0.5);
      doc.line(20, 62, 190, 62);
      
      // Add table content
      doc.setFont('helvetica', 'normal');
      let yPos = 70;
      
      filteredUsers.forEach((user, index) => {
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
          
          // Add table header on new page
          doc.setFont('helvetica', 'bold');
          doc.text('ユーザー名', 20, yPos);
          doc.text('ユーザー種別', 80, yPos);
          doc.text('完了コース', 130, yPos);
          doc.text('学習中コース', 160, yPos);
          doc.text('総学習時間', 190, yPos);
          
          // Draw header line
          doc.line(20, yPos + 2, 190, yPos + 2);
          yPos += 10;
          doc.setFont('helvetica', 'normal');
        }
        
        const userProgress = allUserProgress[user.id] || [];
        const completedCourses = userProgress.filter(p => p.status === 'completed').length;
        const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;
        const totalTime = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
        const hours = Math.floor(totalTime / 3600);
        const minutes = Math.floor((totalTime % 3600) / 60);
        
        doc.text(`${user.lastName} ${user.firstName}`, 20, yPos);
        doc.text(getUserTypeLabel(user.userType), 80, yPos);
        doc.text(completedCourses.toString(), 130, yPos);
        doc.text(inProgressCourses.toString(), 160, yPos);
        doc.text(`${hours}時間${minutes}分`, 190, yPos);
        
        // Draw row separator
        if (index < filteredUsers.length - 1) {
          doc.setLineWidth(0.1);
          doc.line(20, yPos + 2, 190, yPos + 2);
        }
        
        yPos += 10;
      });
      
      // Draw bottom line
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
      
      // Add summary
      yPos += 15;
      doc.setFont('helvetica', 'bold');
      doc.text('サマリー', 20, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      
      const totalCompletedCourses = filteredUsers.reduce((sum, user) => {
        const userProgress = allUserProgress[user.id] || [];
        return sum + userProgress.filter(p => p.status === 'completed').length;
      }, 0);
      
      const totalInProgressCourses = filteredUsers.reduce((sum, user) => {
        const userProgress = allUserProgress[user.id] || [];
        return sum + userProgress.filter(p => p.status === 'in_progress').length;
      }, 0);
      
      const totalLearningTime = filteredUsers.reduce((sum, user) => {
        const userProgress = allUserProgress[user.id] || [];
        return sum + userProgress.reduce((timeSum, p) => timeSum + p.timeSpent, 0);
      }, 0);
      
      const totalLearningHours = Math.floor(totalLearningTime / 3600);
      const totalLearningMinutes = Math.floor((totalLearningTime % 3600) / 60);
      
      doc.text(`総完了コース数: ${totalCompletedCourses}`, 20, yPos);
      yPos += 8;
      doc.text(`総学習中コース数: ${totalInProgressCourses}`, 20, yPos);
      yPos += 8;
      doc.text(`総学習時間: ${totalLearningHours}時間${totalLearningMinutes}分`, 20, yPos);
      
      // Save the PDF
      doc.save('学習進捗レポート.pdf');
      toast.success('レポートをダウンロードしました');
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('レポートの生成中にエラーが発生しました');
    }
  };

  const handleViewUserProgress = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseUserProgress = () => {
    setSelectedUserId(null);
  };

  // If a user is selected, show their detailed progress
  if (selectedUserId) {
    const selectedUser = users.find(u => u.id === selectedUserId);
    const userProgress = allUserProgress[selectedUserId] || [];
    
    if (!selectedUser) {
      return <div>ユーザーが見つかりません</div>;
    }
    
    return (
      <UserProgressDetail 
        user={selectedUser}
        userProgress={userProgress}
        contents={contents}
        onBack={handleCloseUserProgress}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">学習進捗管理</h2>
          <p className="text-gray-600">ユーザーの学習進捗状況を確認・管理します</p>
        </div>
        <Button
          onClick={handleExportReport}
          leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
        >
          レポート出力
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
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
            >
              <option value="all">全進捗状況</option>
              <option value="completed">完了あり</option>
              <option value="in_progress">学習中</option>
              <option value="not_started">未開始</option>
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      ユーザー
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                          <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('userType')}
                  >
                    <div className="flex items-center">
                      ユーザー種別
                      {sortField === 'userType' && (
                        sortDirection === 'asc' ? 
                          <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                          <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('completedCourses')}
                  >
                    <div className="flex items-center">
                      完了コース
                      {sortField === 'completedCourses' && (
                        sortDirection === 'asc' ? 
                          <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                          <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('inProgressCourses')}
                  >
                    <div className="flex items-center">
                      学習中コース
                      {sortField === 'inProgressCourses' && (
                        sortDirection === 'asc' ? 
                          <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                          <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalTime')}
                  >
                    <div className="flex items-center">
                      総学習時間
                      {sortField === 'totalTime' && (
                        sortDirection === 'asc' ? 
                          <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                          <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userProgress = allUserProgress[user.id] || [];
                  const completedCourses = userProgress.filter(p => p.status === 'completed').length;
                  const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;
                  const totalTime = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
                  const totalHours = Math.floor(totalTime / 3600);
                  const totalMinutes = Math.floor((totalTime % 3600) / 60);
                  
                  return (
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
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getUserTypeLabel(user.userType)}
                        </div>
                        {user.companyName && (
                          <div className="text-xs text-gray-500">
                            {user.companyName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-sm text-gray-900">{completedCourses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-blue-500 mr-1" />
                          <span className="text-sm text-gray-900">{inProgressCourses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {totalHours}時間{totalMinutes}分
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUserProgress(user.id)}
                        >
                          詳細を表示
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgressPage;