import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  BookOpenIcon, 
  UsersIcon, 
  ChartBarIcon, 
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const getDashboardContent = () => {
    switch (user?.userType) {
      case 'admin':
        return <AdminDashboard />;
      case 'company_admin':
        return <CompanyAdminDashboard />;
      case 'company_employee':
        return <CompanyEmployeeDashboard />;
      case 'dx_talent':
        return <DXTalentDashboard />;
      case 'foreign_talent':
        return <ForeignTalentDashboard />;
      case 'support_staff':
        return <SupportStaffDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ダッシュボード
        </h1>
        <p className="text-gray-600">
          {user?.lastName} {user?.firstName}さん、おかえりなさい
        </p>
      </div>
      
      {getDashboardContent()}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: '総ユーザー数', value: '1,234', change: '+12%', icon: UsersIcon },
    { name: '企業数', value: '89', change: '+5%', icon: BuildingOfficeIcon },
    { name: '学習コンテンツ', value: '156', change: '+8%', icon: BookOpenIcon },
    { name: 'マッチング成約', value: '45', change: '+23%', icon: ChartBarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-900">新規ユーザー登録: 田中花子さん</span>
            <span className="text-xs text-gray-500">2時間前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-900">企業登録: 株式会社サンプル</span>
            <span className="text-xs text-gray-500">4時間前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-900">新規コンテンツ公開: React入門講座</span>
            <span className="text-xs text-gray-500">1日前</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-6">
      {/* Company Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">企業情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">企業名</p>
            <p className="font-medium">{user?.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">企業コード</p>
            <p className="font-medium font-mono">{user?.companyCode}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <UsersIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">人材マッチング</h3>
          <p className="text-gray-600 text-sm">優秀な人材を見つけましょう</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BuildingOfficeIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">企業管理</h3>
          <p className="text-gray-600 text-sm">企業情報を管理</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <ChartBarIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">分析</h3>
          <p className="text-gray-600 text-sm">採用データを分析</p>
        </div>
      </div>
    </div>
  );
};

const CompanyEmployeeDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {user?.companyName}へようこそ
        </h3>
        <p className="text-gray-600">
          学習コンテンツで新しいスキルを身につけ、キャリアアップを目指しましょう。
        </p>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">学習進捗</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">JavaScript基礎</span>
                <span className="text-sm text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">React入門</span>
                <span className="text-sm text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">おすすめコース</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Python基礎</p>
                <p className="text-sm text-gray-600">プログラミング入門</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">データ分析入門</p>
                <p className="text-sm text-gray-600">データサイエンス</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DXTalentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BookOpenIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">学習コンテンツ</h3>
          <p className="text-gray-600 text-sm">新しいスキルを学習</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BriefcaseIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">プロジェクト</h3>
          <p className="text-gray-600 text-sm">案件を探す</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <CreditCardIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">支払い</h3>
          <p className="text-gray-600 text-sm">サブスクリプション管理</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-900">JavaScript基礎講座を完了しました</span>
            <span className="text-xs text-gray-500">1日前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-900">新しいプロジェクトに応募しました</span>
            <span className="text-xs text-gray-500">3日前</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForeignTalentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          日本での就労をサポートします
        </h3>
        <p className="text-blue-800">
          学習コンテンツとサポートサービスを活用して、日本での成功を目指しましょう。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BookOpenIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">日本語学習</h3>
          <p className="text-gray-600 text-sm">日本語スキルを向上</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <QuestionMarkCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">サポート</h3>
          <p className="text-gray-600 text-sm">困ったときはご相談ください</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <CreditCardIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">支払い</h3>
          <p className="text-gray-600 text-sm">サブスクリプション管理</p>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学習進捗</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">日本語会話基礎</span>
              <span className="text-sm text-gray-900">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">日本文化理解</span>
              <span className="text-sm text-gray-900">40%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupportStaffDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">24</div>
          <p className="text-sm text-gray-600">未対応チケット</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">156</div>
          <p className="text-sm text-gray-600">今日の対応数</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <p className="text-sm text-gray-600">平均評価</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">2.5h</div>
          <p className="text-sm text-gray-600">平均対応時間</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最新のサポートチケット</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">ログインできません</span>
              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">緊急</span>
            </div>
            <span className="text-xs text-gray-500">5分前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">コース進捗が反映されない</span>
              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">中</span>
            </div>
            <span className="text-xs text-gray-500">15分前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">支払い方法の変更</span>
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">低</span>
            </div>
            <span className="text-xs text-gray-500">30分前</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultDashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        DX Seed Platformへようこそ
      </h3>
      <p className="text-gray-600">
        プロフィールを設定して、プラットフォームを最大限に活用しましょう。
      </p>
    </div>
  );
};

export default DashboardPage;