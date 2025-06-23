import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { analyticsService } from '../../services/analyticsService';
import { mlService } from '../../services/mlService';
import { useAuthStore } from '../../stores/authStore';
import { UserGrowthChart } from './charts/UserGrowthChart';
import { RegionalDistributionChart } from './charts/RegionalDistributionChart';
import { ContentUsageChart } from './charts/ContentUsageChart';
import { RegionalMatchingChart } from './charts/RegionalMatchingChart';
import { MatchingTrendChart } from './charts/MatchingTrendChart';
import { CategoryCompletionChart } from './charts/CategoryCompletionChart';
import { PredictionChart } from './charts/PredictionChart';

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'matching' | 'learning' | 'predictions'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [platformMetrics, setPlatformMetrics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [matchingAnalytics, setMatchingAnalytics] = useState<any>(null);
  const [learningAnalytics, setLearningAnalytics] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const { user } = useAuthStore();
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
          if (user?.id) {
            const userData = await analyticsService.analyzeUserBehavior(user.id, timeRangeObj);
            setUserAnalytics(userData);
          }
          break;
        case 'matching':
          // モックデータ
          setMatchingAnalytics({
            totalMatches: 120,
            successfulMatches: 85,
            successRate: 0.71,
            averageTimeToMatch: 14,
            topSkills: ['介護技術', '日本語コミュニケーション', 'チームワーク'],
            matchingByRegion: [
              { region: '静岡県', count: 45 },
              { region: '愛知県', count: 30 },
              { region: '東京都', count: 25 },
              { region: '大阪府', count: 15 },
              { region: '神奈川県', count: 5 }
            ],
            matchingTrend: [
              { month: '1月', success: 10, total: 15 },
              { month: '2月', success: 12, total: 16 },
              { month: '3月', success: 15, total: 20 },
              { month: '4月', success: 18, total: 25 },
              { month: '5月', success: 20, total: 26 },
              { month: '6月', success: 22, total: 28 }
            ]
          });
          break;
        case 'learning':
          // モックデータ
          setLearningAnalytics({
            totalCourses: 50,
            totalEnrollments: 1200,
            averageCompletionRate: 0.68,
            averageScore: 82,
            popularCourses: [
              { id: 'course1', title: '介護基礎講座', enrollments: 150 },
              { id: 'course2', title: '日本語N3対策', enrollments: 120 },
              { id: 'course3', title: '日本文化理解', enrollments: 100 }
            ],
            completionByCategory: [
              { category: '介護', rate: 0.75 },
              { category: '日本語', rate: 0.65 },
              { category: '文化', rate: 0.80 },
              { category: 'IT', rate: 0.72 },
              { category: 'ビジネス', rate: 0.68 }
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
                { date: '2024-01-01', value: 1200 },
                { date: '2024-02-01', value: 1300 },
                { date: '2024-03-01', value: 1450 },
                { date: '2024-04-01', value: 1600 },
                { date: '2024-05-01', value: 1750 },
                { date: '2024-06-01', value: 1900 }
              ],
              confidenceIntervals: [
                { date: '2024-01-01', lowerBound: 1150, upperBound: 1250 },
                { date: '2024-02-01', lowerBound: 1220, upperBound: 1380 },
                { date: '2024-03-01', lowerBound: 1350, upperBound: 1550 },
                { date: '2024-04-01', lowerBound: 1480, upperBound: 1720 },
                { date: '2024-05-01', lowerBound: 1600, upperBound: 1900 },
                { date: '2024-06-01', lowerBound: 1720, upperBound: 2080 }
              ],
              insights: [
                '予測期間中に58%の成長が見込まれます',
                '予測は比較的安定しており、信頼性が高いと考えられます'
              ]
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
      case 'matching':
        dataToExport = matchingAnalytics;
        filename = 'matching-analytics.json';
        break;
      case 'learning':
        dataToExport = learningAnalytics;
        filename = 'learning-analytics.json';
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
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 主要指標 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.userGrowth?.totalUsers || 0}</p>
              <p className="text-xs text-green-600">+{platformMetrics?.userGrowth?.growthRate ? Math.round(platformMetrics.userGrowth.growthRate * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">マッチング成功率</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.matchingEffectiveness?.successRate ? Math.round(platformMetrics.matchingEffectiveness.successRate * 100) : 0}%</p>
              <p className="text-xs text-green-600">+{platformMetrics?.trends?.matchingSuccessTrend ? Math.round(platformMetrics.trends.matchingSuccessTrend * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">コンテンツ完了率</p>
              <p className="text-2xl font-bold text-gray-900">{platformMetrics?.contentUsage?.completionRate ? Math.round(platformMetrics.contentUsage.completionRate * 100) : 0}%</p>
              <p className="text-xs text-green-600">+{platformMetrics?.trends?.contentCompletionTrend ? Math.round(platformMetrics.trends.contentCompletionTrend * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-orange-500" />
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
        <div className="h-64">
          <UserGrowthChart data={platformMetrics?.userGrowth} />
        </div>
      </div>

      {/* 地域分布 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">地域分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <RegionalDistributionChart data={platformMetrics?.geographicalDistribution?.topLocations} />
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
          <div className="h-64">
            <ContentUsageChart data={platformMetrics?.contentUsage?.contentTypeAnalysis} />
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

      {/* 学習進捗グラフ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学習進捗</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">学習進捗グラフ表示エリア</p>
        </div>
      </div>

      {/* レコメンデーション */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">パーソナライズドレコメンデーション</h3>
        <div className="space-y-3">
          {userAnalytics?.recommendations?.map((recommendation: string, index: number) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMatchingAnalyticsTab = () => (
    <div className="space-y-6">
      {/* マッチング統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">マッチング成功率</p>
              <p className="text-2xl font-bold text-gray-900">{matchingAnalytics?.successRate ? Math.round(matchingAnalytics.successRate * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総マッチング数</p>
              <p className="text-2xl font-bold text-gray-900">{matchingAnalytics?.totalMatches || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均マッチング期間</p>
              <p className="text-2xl font-bold text-gray-900">{matchingAnalytics?.averageTimeToMatch || 0}日</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">成功マッチング</p>
              <p className="text-2xl font-bold text-gray-900">{matchingAnalytics?.successfulMatches || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* マッチング詳細分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">地域別マッチング</h3>
          <div className="h-64">
            <RegionalMatchingChart data={matchingAnalytics?.matchingByRegion} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">人気スキル</h3>
          <div className="space-y-4">
            {matchingAnalytics?.topSkills?.map((skill: string, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{skill}</span>
                  <span className="text-sm text-gray-600">{100 - (index * 15)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${100 - (index * 15)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* マッチングトレンド */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">マッチングトレンド</h3>
        <div className="h-64">
          <MatchingTrendChart data={matchingAnalytics?.matchingTrend} />
        </div>
      </div>
    </div>
  );

  const renderLearningAnalyticsTab = () => (
    <div className="space-y-6">
      {/* 学習統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均完了率</p>
              <p className="text-2xl font-bold text-gray-900">{learningAnalytics?.averageCompletionRate ? Math.round(learningAnalytics.averageCompletionRate * 100) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均スコア</p>
              <p className="text-2xl font-bold text-gray-900">{learningAnalytics?.averageScore || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総受講登録</p>
              <p className="text-2xl font-bold text-gray-900">{learningAnalytics?.totalEnrollments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総コース数</p>
              <p className="text-2xl font-bold text-gray-900">{learningAnalytics?.totalCourses || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 人気コース */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">人気コース</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コースタイトル</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受講者数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人気度</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {learningAnalytics?.popularCourses?.map((course: any, index: number) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollments}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(course.enrollments / learningAnalytics.popularCourses[0].enrollments) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* カテゴリ別完了率 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別完了率</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <CategoryCompletionChart data={learningAnalytics?.completionByCategory} />
          </div>
          <div className="space-y-4">
            {learningAnalytics?.completionByCategory?.map((category: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm text-gray-600">{Math.round(category.rate * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${category.rate * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
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
        <div className="h-64">
          <PredictionChart 
            predictions={predictions?.predictions} 
            confidenceIntervals={predictions?.confidenceIntervals} 
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
    { id: 'overview', name: '概要', icon: BarChart3 },
    { id: 'users', name: 'ユーザー分析', icon: Users },
    { id: 'matching', name: 'マッチング分析', icon: TrendingUp },
    { id: 'learning', name: '学習分析', icon: LineChart },
    { id: 'predictions', name: '予測分析', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分析ダッシュボード</h1>
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
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
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
            {activeTab === 'matching' && renderMatchingAnalyticsTab()}
            {activeTab === 'learning' && renderLearningAnalyticsTab()}
            {activeTab === 'predictions' && renderPredictionsTab()}
          </>
        )}
      </div>
    </div>
  );
};