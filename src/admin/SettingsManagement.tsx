import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cog6ToothIcon,
  GlobeAltIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  ServerIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: string | boolean | number;
  description: string;
  type: 'string' | 'boolean' | 'number' | 'select';
  options?: string[];
}

export const SettingsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'localization' | 'notifications' | 'security' | 'system' | 'documentation'>('general');
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | boolean | number>('');
  const { t } = useTranslation();

  useEffect(() => {
    loadSettings();
  }, [activeTab]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // モックデータ - 実際のアプリではAPIから取得
      const mockSettings: SystemSetting[] = [
        // 一般設定
        {
          id: 'site_name',
          category: 'general',
          key: 'site_name',
          value: 'DX Seed Platform',
          description: 'サイト名',
          type: 'string'
        },
        {
          id: 'site_description',
          category: 'general',
          key: 'site_description',
          value: '包括的人材育成・雇用管理エコシステム',
          description: 'サイトの説明',
          type: 'string'
        },
        {
          id: 'contact_email',
          category: 'general',
          key: 'contact_email',
          value: 'contact@dxseed.example.com',
          description: '問い合わせ用メールアドレス',
          type: 'string'
        },
        {
          id: 'support_phone',
          category: 'general',
          key: 'support_phone',
          value: '03-1234-5678',
          description: 'サポート電話番号',
          type: 'string'
        },
        {
          id: 'maintenance_mode',
          category: 'general',
          key: 'maintenance_mode',
          value: false,
          description: 'メンテナンスモード',
          type: 'boolean'
        },
        
        // ローカライゼーション設定
        {
          id: 'default_language',
          category: 'localization',
          key: 'default_language',
          value: 'ja',
          description: 'デフォルト言語',
          type: 'select',
          options: ['ja', 'en', 'si', 'vi', 'zh', 'fil', 'id', 'th', 'my', 'km', 'ne', 'mn']
        },
        {
          id: 'available_languages',
          category: 'localization',
          key: 'available_languages',
          value: 'ja,en,si,vi,zh,fil',
          description: '利用可能言語（カンマ区切り）',
          type: 'string'
        },
        {
          id: 'timezone',
          category: 'localization',
          key: 'timezone',
          value: 'Asia/Tokyo',
          description: 'タイムゾーン',
          type: 'string'
        },
        {
          id: 'date_format',
          category: 'localization',
          key: 'date_format',
          value: 'YYYY/MM/DD',
          description: '日付フォーマット',
          type: 'string'
        },
        {
          id: 'auto_translate',
          category: 'localization',
          key: 'auto_translate',
          value: true,
          description: '自動翻訳機能',
          type: 'boolean'
        },
        
        // 通知設定
        {
          id: 'email_notifications',
          category: 'notifications',
          key: 'email_notifications',
          value: true,
          description: 'メール通知',
          type: 'boolean'
        },
        {
          id: 'push_notifications',
          category: 'notifications',
          key: 'push_notifications',
          value: true,
          description: 'プッシュ通知',
          type: 'boolean'
        },
        {
          id: 'notification_frequency',
          category: 'notifications',
          key: 'notification_frequency',
          value: 'daily',
          description: '通知頻度',
          type: 'select',
          options: ['realtime', 'hourly', 'daily', 'weekly']
        },
        {
          id: 'admin_alert_email',
          category: 'notifications',
          key: 'admin_alert_email',
          value: 'admin@dxseed.example.com',
          description: '管理者アラートメール',
          type: 'string'
        },
        {
          id: 'system_alerts',
          category: 'notifications',
          key: 'system_alerts',
          value: true,
          description: 'システムアラート',
          type: 'boolean'
        },
        
        // セキュリティ設定
        {
          id: 'mfa_required',
          category: 'security',
          key: 'mfa_required',
          value: true,
          description: '多要素認証必須',
          type: 'boolean'
        },
        {
          id: 'password_expiry_days',
          category: 'security',
          key: 'password_expiry_days',
          value: 90,
          description: 'パスワード有効期限（日）',
          type: 'number'
        },
        {
          id: 'session_timeout_minutes',
          category: 'security',
          key: 'session_timeout_minutes',
          value: 30,
          description: 'セッションタイムアウト（分）',
          type: 'number'
        },
        {
          id: 'login_attempts',
          category: 'security',
          key: 'login_attempts',
          value: 5,
          description: 'ログイン試行回数制限',
          type: 'number'
        },
        {
          id: 'ip_whitelist',
          category: 'security',
          key: 'ip_whitelist',
          value: '',
          description: 'IP制限（カンマ区切り）',
          type: 'string'
        },
        
        // システム設定
        {
          id: 'api_rate_limit',
          category: 'system',
          key: 'api_rate_limit',
          value: 100,
          description: 'API制限（リクエスト/分）',
          type: 'number'
        },
        {
          id: 'cache_ttl',
          category: 'system',
          key: 'cache_ttl',
          value: 3600,
          description: 'キャッシュTTL（秒）',
          type: 'number'
        },
        {
          id: 'log_level',
          category: 'system',
          key: 'log_level',
          value: 'info',
          description: 'ログレベル',
          type: 'select',
          options: ['debug', 'info', 'warn', 'error']
        },
        {
          id: 'backup_enabled',
          category: 'system',
          key: 'backup_enabled',
          value: true,
          description: '自動バックアップ',
          type: 'boolean'
        },
        {
          id: 'backup_frequency',
          category: 'system',
          key: 'backup_frequency',
          value: 'daily',
          description: 'バックアップ頻度',
          type: 'select',
          options: ['hourly', 'daily', 'weekly']
        },
        
        // ドキュメント設定
        {
          id: 'help_url',
          category: 'documentation',
          key: 'help_url',
          value: 'https://help.dxseed.example.com',
          description: 'ヘルプサイトURL',
          type: 'string'
        },
        {
          id: 'api_docs_url',
          category: 'documentation',
          key: 'api_docs_url',
          value: 'https://api.dxseed.example.com/docs',
          description: 'API ドキュメントURL',
          type: 'string'
        },
        {
          id: 'user_guide_url',
          category: 'documentation',
          key: 'user_guide_url',
          value: 'https://docs.dxseed.example.com/user-guide',
          description: 'ユーザーガイドURL',
          type: 'string'
        },
        {
          id: 'admin_guide_url',
          category: 'documentation',
          key: 'admin_guide_url',
          value: 'https://docs.dxseed.example.com/admin-guide',
          description: '管理者ガイドURL',
          type: 'string'
        },
        {
          id: 'show_help_widget',
          category: 'documentation',
          key: 'show_help_widget',
          value: true,
          description: 'ヘルプウィジェット表示',
          type: 'boolean'
        }
      ];
      
      // 現在のタブに関連する設定のみをフィルタリング
      const filteredSettings = mockSettings.filter(setting => setting.category === activeTab);
      setSettings(filteredSettings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsLoading(false);
      toast.error(t('common.error'));
    }
  };

  const handleEditSetting = (settingId: string, currentValue: string | boolean | number) => {
    setEditingSettingId(settingId);
    setEditValue(currentValue);
  };

  const handleSaveSetting = async (settingId: string) => {
    try {
      // 実際のアプリではAPIを呼び出して設定を保存
      setSettings(prevSettings => 
        prevSettings.map(setting => 
          setting.id === settingId ? { ...setting, value: editValue } : setting
        )
      );
      
      setEditingSettingId(null);
      toast.success(t('common.success'));
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error(t('common.error'));
    }
  };

  const handleCancelEdit = () => {
    setEditingSettingId(null);
  };

  const handleValueChange = (value: string | boolean | number) => {
    setEditValue(value);
  };

  const renderSettingInput = (setting: SystemSetting) => {
    const isEditing = editingSettingId === setting.id;
    
    if (!isEditing) {
      // 表示モード
      if (setting.type === 'boolean') {
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            setting.value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {setting.value ? 'オン' : 'オフ'}
          </span>
        );
      }
      
      return <span className="text-gray-900">{setting.value}</span>;
    }
    
    // 編集モード
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id={`toggle-${setting.id}`}
              checked={editValue as boolean}
              onChange={(e) => handleValueChange(e.target.checked)}
              className="sr-only"
            />
            <label
              htmlFor={`toggle-${setting.id}`}
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                editValue ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  editValue ? 'translate-x-4' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={editValue as number}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'select':
        return (
          <select
            value={editValue as string}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={editValue as string}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  const tabs = [
    { id: 'general', name: '一般', icon: Cog6ToothIcon },
    { id: 'localization', name: 'ローカライゼーション', icon: GlobeAltIcon },
    { id: 'notifications', name: '通知', icon: BellAlertIcon },
    { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
    { id: 'system', name: 'システム', icon: ServerIcon },
    { id: 'documentation', name: 'ドキュメント', icon: DocumentTextIcon }
  ];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">システム設定</h2>
        <p className="text-gray-600">プラットフォームの設定を管理します</p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 設定テーブル */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : settings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">設定が見つかりません</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    設定名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    値
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settings.map((setting) => (
                  <tr key={setting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {setting.key}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {setting.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderSettingInput(setting)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingSettingId === setting.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSaveSetting(setting.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditSetting(setting.id, setting.value)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編集
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};