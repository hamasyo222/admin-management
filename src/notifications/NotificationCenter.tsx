import React, { useState, useEffect } from 'react';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Notification } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  onNotificationClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      // In a real implementation, this would call an API
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: 'notif-1',
          userId: user?.id || '',
          type: 'info',
          title: 'コース更新',
          message: 'JavaScript基礎講座に新しいコンテンツが追加されました',
          isRead: false,
          actionUrl: '/lms/course/content-1',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        {
          id: 'notif-2',
          userId: user?.id || '',
          type: 'success',
          title: '修了証発行',
          message: 'Python データ分析入門の修了証が発行されました',
          isRead: true,
          actionUrl: '/lms',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
          id: 'notif-3',
          userId: user?.id || '',
          type: 'warning',
          title: 'サブスクリプション更新',
          message: 'サブスクリプションが7日後に更新されます',
          isRead: false,
          actionUrl: '/payment',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // In a real implementation, this would call an API
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would call an API
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
      
      toast.success('すべての通知を既読にしました');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('通知の更新に失敗しました');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Close notification center
    setIsOpen(false);
    
    // Call callback if provided
    if (onNotificationClick) {
      onNotificationClick(notification);
    } else if (notification.actionUrl) {
      // Navigate to action URL
      window.location.href = notification.actionUrl;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
          <CheckIcon className="h-5 w-5" />
        </div>;
      case 'warning':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
          <BellIcon className="h-5 w-5" />
        </div>;
      case 'error':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          <XMarkIcon className="h-5 w-5" />
        </div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
          <BellIcon className="h-5 w-5" />
        </div>;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return '今';
    } else if (diffMin < 60) {
      return `${diffMin}分前`;
    } else if (diffHour < 24) {
      return `${diffHour}時間前`;
    } else if (diffDay < 30) {
      return `${diffDay}日前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">通知</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                すべて既読にする
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                通知はありません
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <li 
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${notification.isRead ? '' : 'bg-blue-50'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};