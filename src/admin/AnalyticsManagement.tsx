import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { analyticsService } from '../../services/analyticsService';
import toast from 'react-hot-toast';

export const AnalyticsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies' | 'content' | 'predictions'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [platformMetrics, setPlatformMetrics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [companyAnalytics, setCompanyAnalytics] = useState<any>(null);
  const [contentAnalytics, setContentAnalytics] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, activeTab]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // 時間範囲の計算
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      
      const timeRangeObj = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      // タブに応じたデータ読み込み
      switch (activeTab) {
        case 'overview':
          const platformData = await analyticsService.analyzePlatformMetrics(timeRangeObj);
          setPlatformMetrics(platformData);
          break;
        case 'users':
          // モックデータ
          setUserAnalytics({
            totalUsers: 1234,
            newUsers: 56,
            activeUsers: 789,
            userTypeDistribution: [
              { type: 'dx_talent', count: 450, percentage: 36.5 },
              { type: 'foreign_talent', count: 350, percentage: 28.4 },
              { type: 'company_admin', count: 200, percentage: 16.2 },
              { type: 'company_employee', count: 180, percentage: 14.6 },
              { type: 'support_staff', count: 30, percentage: 2.4 },
              { type: 'admin', count: 24, percentage: 1.9 }
            ],
            userGrowth: [
              { date: '2023-08-01', count: 1000 },
              { date: '2023-09-01', count: 1050 },
              { date: '2023-10-01', count: 1100 },
              { date: '2023-11-01', count: 1150 },
              { date: '2023-12-01', count: 1180 },
              { date: '2024-01-01', count: 1234 }
            ],
            userActivity: {
              averageSessionDuration: 15.3,
              averageSessionsPerUser: 4.2,
              bounceRate: 32.5
            },
            geographicalDistribution: [
              { prefecture: '静岡県', count: 450, percentage: 36.5 },
              { prefecture: '愛知県', count: 250, percentage: 20.3 },
              { prefecture: '東京都', count: 200, percentage: 16.2 },
              { prefecture: '大阪府', count: 150, percentage: 12.2 },
              { prefecture: 'その他', count: 184, percentage: 14.8 }
            ]
          });
          break;
        case 'companies':
          // モックデータ
          setCompanyAnalytics({
            totalCompanies: 89,
            newCompanies: 5,
            activeCompanies: 78,
            industryDistribution: [
              { industry: 'IT・情報通信', count: 25, percentage: 28.1 },
              { industry: '製造業', count: 20, percentage: 22.5 },
              { industry: '介護・福祉', count: 15, percentage: 16.9 },
              { industry: '建設・不動産', count: 12, percentage: 13.5 },
              { industry: '飲食・宿泊', count: 8, percentage: 9.0 },
              { industry: 'その他', count: 9, percentage: 10.0 }
            ],
            companyGrowth: [
              { date: '2023-08-01', count: 70 },
              { date: '2023-09-01', count: 74 },
              { date: '2023-10-01', count: 78 },
              { date: '2023-11-01', count: 82 },
              { date: '2023-12-01', count: 85 },
              { date: '2024-01-01', count: 89 }
            ],
            employmentStats: {
              totalEmployees: 1250,
              averageEmployeesPerCompany: 14.0,
              specificSkillCertified: 65
            },
            geographicalDistribution: [
              { prefecture: '静岡県', count: 45, percentage: 50.6 },
              { prefecture: '愛知県', count: 20, percentage: 22.5 },
              { prefecture: '東京都', count: 12, percentage: 13.5 },
              { prefecture: 'その他', count: 12, percentage: 13.4 }
            ]
          });
          break;
        case 'content':
          // モックデータ
          setContentAnalytics({
            totalContents: 156,
            newContents: 12,
            publishedContents: 134,
            draftContents: 22,
            categoryDistribution: [
              { category: 'プログラミング基礎', count: 45, percentage: 28.8 },
              { category: 'データ分析', count: 35, percentage: 22.4 },
              { category: 'AI・機械学習', count: 30, percentage: 19.2 },
              { category: 'Web開発', count: 25, percentage: 16.0 },
              { category: 'モバイルアプリ開発', count: 15, percentage: 9.6 },
              { category: 'その他', count: 6, percentage: 4.0 }
            ],
            contentGrowth: [
              { date: '2023-08-01', count: 100 },
              { date: '2023-09-01', count: 110 },
              { date: '2023-10-01', count: 120 },
              { date: '2023-11-01', count: 130 },
              { date: '2023-12-01', count: 145 },
              { date: '2024-01-01', count: 156 }
            ],
            contentUsage: {
              totalViews: 12500,
              totalCompletions: 8750,
              completionRate: 0.7,
              averageRating: 4.2
            },
            popularContents: [
              { id: 'content-1', title: 'JavaScript基礎講座', views: 1200, completions: 950 },
              { id: 'content-2', title: 'Python データ分析入門', views: 980, completions: 720 },
              { id: 'content-3', title: '機械学習アルゴリズム基礎', views: 850, completions: 580 },
              { id: 'content-4', title: 'React フロントエンド開発', views: 780, completions: 520 },
              { id: 'content-5', title: 'ビッグデータ処理入門', views: 650, completions: 420 }
            ]
          });
          break;
        case 'predictions':
          // 予測データ
          const predictionConfig = {
            targetMetric: 'user_growth',
            timeRange: timeRangeObj,
            predictionHorizon: 6,
            confidenceLevel: 0.95
          };
          
          try {
            const predictionResult = await analyticsService.generatePredictions(predictionConfig);
            setPredictions(predictionResult);
          } catch (error) {
            console.error('Prediction error:', error);
            // モックデータ
            setPredictions({
              targetMetric: 'user_growth',
              predictions: [
                { date: '2024-02-01', value: 1300 },
                { date: '2024-03-01', value: 1380 },
                { date: '2024-04-01', value: 1450 },
                { date: '2024-05-01', value: 1530 },
                { date: '2024-06-01', value: 1620 },
                { date: '2024-07-01', value: 1700 }
              ],
              confidenceIntervals: [
                { date: '2024-02-01', lowerBound: 1250, upperBound: 1350 },
                { date: '2024-03-01', lowerBound: 1320, upperBound: 1440 },
                { date: '2024-04-01', lowerBound: 1380, upperBound: 1520 },
                { date: '2024-05-01', lowerBound: 1450, upperBound: 1610 },
                { date: '2024-06-01', lowerBound: 1530, upperBound: 1710 },
                { date: '2024-07-01', lowerBound: 1600, upperBound: 1800 }
              ],
              insights: [
                '予測期間中に37.8%の成長が見込まれます',
                '成長率は安定しており、月平均5.5%の増加が予測されます',
                'ユーザー獲得施策の効果が継続していると考えられます'
              ],
              modelAccuracy: {
                mape: 4.2,
                rmse: 25.3,
                r2: 0.92
              }
            });
          }
          break;
      }
    } catch (error) {
      console.error('Analytics data loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    let dataToExport;
    let filename;
    
    switch (activeTab) {
      case 'overview':
        dataToExport = platformMetrics;
        filename = 'platform-metrics.json';
        break;
      case 'users':
        dataToExport = userAnalytics;
        filename = 'user-analytics.json';
        break;
      case 'companies':
        dataToExport = companyAnalytics;
        filename = 'company-analytics.json';
        break;
      case 'content':
        dataToExport = contentAnalytics;
        filename = 'content-analytics.json';
        break;
      case 'predictions':
        dataToExport = predictions;
        filename = 'predictions.json';
        break;
      default:
        dataToExport = {};
        filename = 'analytics.json';
    }
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('データをエクスポートしました');
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 主要指標 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.userGrowth?.totalUsers || 0}</p>
              <p className="text-xs text-green-600">+{platformMetrics?.userGrowth?.growthRate ? Math.round(platformMetrics.userGrowth.growthRate * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChartComponent className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">マッチング成功率</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.matchingEffectiveness?.successRate ? Math.round(platformMetrics.matchingEffectiveness.successRate * 100) : 0}%</p>
              <p className="text-xs text-green-600">+{platformMetrics?.trends?.matchingSuccessTrend ? Math.round(platformMetrics.trends.matchingSuccessTrend * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <LineChartComponent className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">コンテンツ完了率</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.contentUsage?.completionRate ? Math.round(platformMetrics.contentUsage.completionRate * 100) : 0}%</p>
              <p className="text-xs text-green-600">+{platformMetrics?.trends?.contentCompletionTrend ? Math.round(platformMetrics.trends.contentCompletionTrend * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <PieChartComponent className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">地域分布</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.geographicalDistribution?.totalLocations || 0}</p>
              <p className="text-xs text-gray-600">都道府県</p>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザー成長グラフ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ユーザー成長推移</h3>
        <div className="h-64 bg-gray-50 rounded-lg">
          <UserGrowthChart data={platformMetrics?.userGrowth?.userGrowthData || []} />
        </div>
      </div>

      {/* 地域分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">地域分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <GeographicalDistributionMap data={platformMetrics?.geographicalDistribution?.topLocations || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">上位地域</h4>
            <div className="space-y-2">
              {platformMetrics?.geographicalDistribution?.topLocations?.map((location: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${(location.count / platformMetrics.geographicalDistribution.topLocations[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 min-w-[80px]">{location.prefecture}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{location.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* コンテンツ利用分析 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">コンテンツ利用分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <ContentUsageChart data={platformMetrics?.contentUsage?.contentTypeAnalysis || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">コンテンツタイプ別完了率</h4>
            <div className="space-y-4">
              {platformMetrics?.contentUsage?.contentTypeAnalysis?.map((content: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{content.type}</span>
                    <span className="text-sm text-gray-600">{Math.round(content.completionRate * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${content.completionRate * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserAnalyticsTab = () => (
    <div className="space-y-6">
      {/* ユーザー活動サマリー */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">活動サマリー</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">学習パターン</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">平均学習時間:</span> {userAnalytics?.learningPatterns?.averageDuration || 0}分/セッション</p>
              <p><span className="font-medium">完了率:</span> {userAnalytics?.learningPatterns?.completionRate ? Math.round(userAnalytics.learningPatterns.completionRate * 100) : 0}%</p>
              <p><span className="font-medium">好みの学習時間帯:</span> {userAnalytics?.learningPatterns?.preferredTimeOfDay === 'morning' ? '朝' : 
                                                                  userAnalytics?.learningPatterns?.preferredTimeOfDay === 'afternoon' ? '昼' :
                                                                  userAnalytics?.learningPatterns?.preferredTimeOfDay === 'evening' ? '夕方' : '夜'}</p>
              <p><span className="font-medium">一貫性スコア:</span> {userAnalytics?.learningPatterns?.consistencyScore ? Math.round(userAnalytics.learningPatterns.consistencyScore * 100) : 0}/100</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">相談パターン</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">主な相談カテゴリ:</span> {userAnalytics?.consultationPatterns?.mostCommonCategory || 'なし'}</p>
              <p><span className="font-medium">平均緊急度:</span> {userAnalytics?.consultationPatterns?.averageUrgency ? userAnalytics.consultationPatterns.averageUrgency.toFixed(1) : 0}/4</p>
              <p><span className="font-medium">解決率:</span> {userAnalytics?.consultationPatterns?.resolutionRate ? Math.round(userAnalytics.consultationPatterns.resolutionRate * 100) : 0}%</p>
              <p><span className="font-medium">相談頻度:</span> {userAnalytics?.consultationPatterns?.frequency ? Math.round(userAnalytics.consultationPatterns.frequency * 30) : 0}回/月</p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">活動傾向</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ログイン頻度:</span> {userAnalytics?.activityTrends?.loginFrequency ? Math.round(userAnalytics.activityTrends.loginFrequency * 30) : 0}回/月</p>
              <p><span className="font-medium">好みのデバイス:</span> {userAnalytics?.activityTrends?.preferredDevice === 'mobile' ? 'モバイル' : 'デスクトップ'}</p>
              <p><span className="font-medium">エンゲージメントスコア:</span> {userAnalytics?.activityTrends?.engagementScore ? Math.round(userAnalytics.activityTrends.engagementScore * 100) : 0}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザー種別分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ユーザー種別分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <UserTypeDistributionChart data={userAnalytics?.userTypeDistribution || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">ユーザー種別</h4>
            <div className="space-y-2">
              {userAnalytics?.userTypeDistribution?.map((type: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 min-w-[120px]">{t(`userType.${type.type}`)}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 地域分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">地域分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <GeographicalDistributionMap data={userAnalytics?.geographicalDistribution || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">上位地域</h4>
            <div className="space-y-2">
              {userAnalytics?.geographicalDistribution?.map((location: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 min-w-[80px]">{location.prefecture}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{location.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyAnalyticsTab = () => (
    <div className="space-y-6">
      {/* 企業統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総企業数</p>
              <p className="text-2xl font-bold text-gray-900">{companyAnalytics?.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">新規企業</p>
              <p className="text-2xl font-bold text-gray-900">{companyAnalytics?.newCompanies}</p>
              <p className="text-xs text-gray-600">過去30日間</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">アクティブ企業</p>
              <p className="text-2xl font-bold text-gray-900">{companyAnalytics?.activeCompanies}</p>
              <p className="text-xs text-gray-600">過去30日間</p>
            </div>
          </div>
        </div>
      </div>

      {/* 業種分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">業種分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <IndustryDistributionChart data={companyAnalytics?.industryDistribution || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">業種別企業数</h4>
            <div className="space-y-2">
              {companyAnalytics?.industryDistribution?.map((industry: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full"
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 min-w-[120px]">{industry.industry}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{industry.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 企業成長推移 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">企業成長推移</h3>
        <div className="h-64 bg-gray-50 rounded-lg">
          <CompanyGrowthChart data={companyAnalytics?.companyGrowth || []} />
        </div>
      </div>
    </div>
  );

  const renderContentAnalyticsTab = () => (
    <div className="space-y-6">
      {/* コンテンツ統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総コンテンツ数</p>
              <p className="text-2xl font-bold text-gray-900">{contentAnalytics?.totalContents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">新規コンテンツ</p>
              <p className="text-2xl font-bold text-gray-900">{contentAnalytics?.newContents}</p>
              <p className="text-xs text-gray-600">過去30日間</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">公開中</p>
              <p className="text-2xl font-bold text-gray-900">{contentAnalytics?.publishedContents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">下書き</p>
              <p className="text-2xl font-bold text-gray-900">{contentAnalytics?.draftContents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリ分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-lg">
            <CategoryDistributionChart data={contentAnalytics?.categoryDistribution || []} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">カテゴリ別コンテンツ数</h4>
            <div className="space-y-2">
              {contentAnalytics?.categoryDistribution?.map((category: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 min-w-[150px]">{category.category}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 人気コンテンツ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">人気コンテンツ</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  コンテンツ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  閲覧数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了率
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentAnalytics?.popularContents?.map((content: any, index: number) => (
                <tr key={content.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {content.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.completions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round((content.completions / content.views) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPredictionsTab = () => (
    <div className="space-y-6">
      {/* 予測概要 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">予測概要</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">予測対象メトリック</p>
            <p className="font-medium text-gray-900 mb-4">{predictions?.targetMetric === 'user_growth' ? 'ユーザー成長' : predictions?.targetMetric}</p>
            
            <p className="text-sm text-gray-600 mb-2">予測期間</p>
            <p className="font-medium text-gray-900 mb-4">{predictions?.predictionHorizon || 0}ヶ月</p>
            
            <p className="text-sm text-gray-600 mb-2">モデル精度</p>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(predictions?.modelAccuracy?.r2 || 0) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{predictions?.modelAccuracy?.r2 ? Math.round(predictions.modelAccuracy.r2 * 100) : 0}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">インサイト</p>
            {predictions?.insights?.map((insight: string, index: number) => (
              <div key={index} className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 予測グラフ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">予測グラフ</h3>
        <div className="h-64 bg-gray-50 rounded-lg">
          <PredictionChart 
            predictions={predictions?.predictions || []}
            confidenceIntervals={predictions?.confidenceIntervals || []}
          />
        </div>
      </div>

      {/* 予測データテーブル */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">予測データ</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予測値</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">下限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上限</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions?.predictions?.map((prediction: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prediction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{Math.round(prediction.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{predictions.confidenceIntervals[index] ? Math.round(predictions.confidenceIntervals[index].lowerBound) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{predictions.confidenceIntervals[index] ? Math.round(predictions.confidenceIntervals[index].upperBound) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: '概要', icon: ChartBarIcon },
    { id: 'users', name: 'ユーザー分析', icon: UsersIcon },
    { id: 'companies', name: '企業分析', icon: BuildingOfficeIcon },
    { id: 'content', name: 'コンテンツ分析', icon: BookOpenIcon },
    { id: 'predictions', name: '予測分析', icon: ArrowTrendingUpIcon }
  ];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">分析ダッシュボード</h2>
          <p className="text-gray-600">データに基づく意思決定をサポート</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">過去7日間</option>
              <option value="month">過去30日間</option>
              <option value="quarter">過去3ヶ月</option>
              <option value="year">過去1年</option>
            </select>
            <CalendarDaysIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalyticsData}
            leftIcon={<ArrowPathIcon className="w-4 h-4" />}
          >
            更新
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            エクスポート
          </Button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
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

      {/* タブコンテンツ */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'users' && renderUserAnalyticsTab()}
            {activeTab === 'companies' && renderCompanyAnalyticsTab()}
            {activeTab === 'content' && renderContentAnalyticsTab()}
            {activeTab === 'predictions' && renderPredictionsTab()}
          </>
        )}
      </div>
    </div>
  );
};

// Chart Components
const BarChartComponent = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const LineChartComponent = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
  </svg>
);

const PieChartComponent = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

// Chart Components
const UserGrowthChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line chart
    if (data.length > 0) {
      const maxValue = Math.max(...data.map(d => d.count));
      const minValue = Math.min(...data.map(d => d.count));
      const range = maxValue - minValue;
      
      const xStep = (width - padding * 2) / (data.length - 1);
      
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((point.count - minValue) / range) * (height - padding * 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.stroke();
      
      // Draw area under the line
      ctx.beginPath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((point.count - minValue) / range) * (height - padding * 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.lineTo(padding + (data.length - 1) * xStep, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fill();
      
      // Draw X-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const date = new Date(point.date);
        const label = `${date.getMonth() + 1}月`;
        ctx.fillText(label, x, height - padding + 15);
      });
      
      // Draw Y-axis labels
      ctx.textAlign = 'right';
      const yStep = (height - padding * 2) / 5;
      
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - i * yStep;
        const value = Math.round(minValue + (i / 5) * range);
        ctx.fillText(value.toString(), padding - 5, y + 3);
      }
    }
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const GeographicalDistributionMap = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple map of Japan (simplified for this example)
    // In a real implementation, you would use a proper map visualization library
    
    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw prefectures as circles with size based on count
    const maxCount = Math.max(...data.map(d => d.count));
    
    // Simplified prefecture positions (not accurate)
    const prefecturePositions: Record<string, [number, number]> = {
      '静岡県': [400, 200],
      '愛知県': [350, 220],
      '東京都': [450, 180],
      '大阪府': [300, 230],
      'その他': [380, 300]
    };
    
    data.forEach(prefecture => {
      const position = prefecturePositions[prefecture.prefecture] || [400, 200];
      const radius = 10 + (prefecture.count / maxCount) * 40;
      
      ctx.beginPath();
      ctx.arc(position[0], position[1], radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(prefecture.prefecture, position[0], position[1] - radius - 5);
      ctx.font = '10px sans-serif';
      ctx.fillText(prefecture.count.toString(), position[0], position[1] + 4);
    });
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const ContentUsageChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.views, 0);
    
    // Colors
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
    ];
    
    // Draw slices
    data.forEach((item, index) => {
      const sliceAngle = (item.views / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Add label if slice is big enough
      if (sliceAngle > 0.3) {
        const labelAngle = startAngle + (sliceAngle / 2);
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.round((item.views / total) * 100)}%`, 
          labelX, 
          labelY
        );
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = width - radius - 20;
    const legendY = padding;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    data.forEach((item, index) => {
      const y = legendY + (index * 20);
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      ctx.fillStyle = '#1f2937';
      ctx.fillText(item.type, legendX + 20, y + 12);
    });
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const UserTypeDistributionChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Colors
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
    ];
    
    // Draw slices
    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Add label if slice is big enough
      if (sliceAngle > 0.3) {
        const labelAngle = startAngle + (sliceAngle / 2);
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.round((item.count / total) * 100)}%`, 
          labelX, 
          labelY
        );
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = width - radius - 20;
    const legendY = padding;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    data.forEach((item, index) => {
      const y = legendY + (index * 20);
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      ctx.fillStyle = '#1f2937';
      
      // Map user type to display name
      const userTypeNames: Record<string, string> = {
        'dx_talent': 'DX人材',
        'foreign_talent': '海外人材',
        'company_admin': '企業管理者',
        'company_employee': '企業従業員',
        'support_staff': 'サポートスタッフ',
        'admin': '管理者'
      };
      
      ctx.fillText(userTypeNames[item.type] || item.type, legendX + 20, y + 12);
    });
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const IndustryDistributionChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Colors
    const colors = [
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#f59e0b', // amber-500
      '#10b981', // emerald-500
      '#3b82f6', // blue-500
      '#6366f1', // indigo-500
    ];
    
    // Draw slices
    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Add label if slice is big enough
      if (sliceAngle > 0.3) {
        const labelAngle = startAngle + (sliceAngle / 2);
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.round((item.count / total) * 100)}%`, 
          labelX, 
          labelY
        );
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = width - radius - 20;
    const legendY = padding;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    data.forEach((item, index) => {
      const y = legendY + (index * 20);
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      ctx.fillStyle = '#1f2937';
      ctx.fillText(item.industry, legendX + 20, y + 12);
    });
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const CompanyGrowthChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line chart
    if (data.length > 0) {
      const maxValue = Math.max(...data.map(d => d.count));
      const minValue = Math.min(...data.map(d => d.count));
      const range = maxValue - minValue;
      
      const xStep = (width - padding * 2) / (data.length - 1);
      
      ctx.beginPath();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((point.count - minValue) / range) * (height - padding * 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.stroke();
      
      // Draw area under the line
      ctx.beginPath();
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((point.count - minValue) / range) * (height - padding * 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.lineTo(padding + (data.length - 1) * xStep, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fill();
      
      // Draw X-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      
      data.forEach((point, i) => {
        const x = padding + i * xStep;
        const date = new Date(point.date);
        const label = `${date.getMonth() + 1}月`;
        ctx.fillText(label, x, height - padding + 15);
      });
      
      // Draw Y-axis labels
      ctx.textAlign = 'right';
      const yStep = (height - padding * 2) / 5;
      
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - i * yStep;
        const value = Math.round(minValue + (i / 5) * range);
        ctx.fillText(value.toString(), padding - 5, y + 3);
      }
    }
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const CategoryDistributionChart = ({ data }: { data: any[] }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Colors
    const colors = [
      '#10b981', // emerald-500
      '#3b82f6', // blue-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
    ];
    
    // Draw slices
    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Add label if slice is big enough
      if (sliceAngle > 0.3) {
        const labelAngle = startAngle + (sliceAngle / 2);
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.round((item.count / total) * 100)}%`, 
          labelX, 
          labelY
        );
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = width - radius - 20;
    const legendY = padding;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    data.forEach((item, index) => {
      const y = legendY + (index * 20);
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      ctx.fillStyle = '#1f2937';
      
      // Truncate long category names
      const categoryName = item.category.length > 15 
        ? item.category.substring(0, 15) + '...' 
        : item.category;
      
      ctx.fillText(categoryName, legendX + 20, y + 12);
    });
  }, [data]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};

const PredictionChart = ({ 
  predictions, 
  confidenceIntervals 
}: { 
  predictions: any[],
  confidenceIntervals: any[]
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !predictions || predictions.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Find min and max values
    const allValues = [
      ...predictions.map(p => p.value),
      ...confidenceIntervals.map(ci => ci.lowerBound),
      ...confidenceIntervals.map(ci => ci.upperBound)
    ];
    
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;
    
    const xStep = (width - padding * 2) / (predictions.length - 1);
    
    // Draw confidence interval area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    
    // Upper bound
    confidenceIntervals.forEach((interval, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((interval.upperBound - minValue) / range) * (height - padding * 2);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Lower bound (in reverse order)
    for (let i = confidenceIntervals.length - 1; i >= 0; i--) {
      const x = padding + i * xStep;
      const y = height - padding - ((confidenceIntervals[i].lowerBound - minValue) / range) * (height - padding * 2);
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw prediction line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    predictions.forEach((prediction, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((prediction.value - minValue) / range) * (height - padding * 2);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.stroke();
    
    // Draw X-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    predictions.forEach((prediction, i) => {
      const x = padding + i * xStep;
      const date = new Date(prediction.date);
      const label = `${date.getMonth() + 1}月`;
      ctx.fillText(label, x, height - padding + 15);
    });
    
    // Draw Y-axis labels
    ctx.textAlign = 'right';
    const yStep = (height - padding * 2) / 5;
    
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - i * yStep;
      const value = Math.round(minValue + (i / 5) * range);
      ctx.fillText(value.toString(), padding - 5, y + 3);
    }
  }, [predictions, confidenceIntervals]);
  
  return (
    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
  );
};