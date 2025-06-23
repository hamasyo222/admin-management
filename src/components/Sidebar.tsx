import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
      { name: 'プロフィール', href: '/profile', icon: UserIcon },
      { name: 'LMS', href: '/lms', icon: BookOpenIcon },
      { name: 'チャット', href: '/chat', icon: ChatBubbleLeftRightIcon },
    ];

    if (user?.userType === 'admin') {
      return [
        ...baseItems,
        { name: 'ユーザー管理', href: '/admin/users', icon: UsersIcon },
        { name: '企業管理', href: '/admin/companies', icon: BuildingOfficeIcon },
        { name: 'コンテンツ管理', href: '/admin/content', icon: BookOpenIcon },
        { name: '分析', href: '/analytics', icon: ChartBarIcon },
        { name: '設定', href: '/admin/settings', icon: Cog6ToothIcon },
      ];
    }

    if (user?.userType === 'company_admin') {
      return [
        ...baseItems,
        { name: 'マッチング', href: '/matching', icon: UsersIcon },
        { name: '企業管理', href: '/company', icon: BuildingOfficeIcon },
        { name: '分析', href: '/analytics', icon: ChartBarIcon },
      ];
    }

    if (user?.userType === 'company_employee') {
      return [
        ...baseItems,
        { name: 'マッチング', href: '/matching', icon: UsersIcon },
      ];
    }

    if (user?.userType === 'dx_talent') {
      return [
        ...baseItems,
        { name: 'プロジェクト', href: '/projects', icon: BriefcaseIcon },
        { name: '支払い', href: '/payment', icon: CreditCardIcon },
      ];
    }

    if (user?.userType === 'foreign_talent') {
      return [
        ...baseItems,
        { name: 'サポート', href: '/support', icon: QuestionMarkCircleIcon },
        { name: '支払い', href: '/payment', icon: CreditCardIcon },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">DX Seed</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.lastName} {user?.firstName}
            </p>
            <p className="text-xs text-gray-500">{user?.userType}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Sidebar;