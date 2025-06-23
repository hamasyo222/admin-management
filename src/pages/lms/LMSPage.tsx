import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  BookOpenIcon, 
  PlayIcon, 
  ClockIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';

interface LearningContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  enrolledCount: number;
  isCompleted?: boolean;
  progress?: number;
  targetAudience: 'dx_talent' | 'foreign_talent' | 'both';
}

const LMSPage: React.FC = () => {
  const { user } = useAuthStore();
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<LearningContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, [user]);

  useEffect(() => {
    filterContents();
  }, [contents, searchQuery, categoryFilter, difficultyFilter]);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockContents: LearningContent[] = [
        {
          id: 'content-1',
          title: 'JavaScript基礎講座',
          description: 'JavaScriptの基本文法から始めて、実際のアプリケーション開発まで学習します。',
          thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 120,
          difficulty: 'beginner',
          category: 'プログラミング',
          rating: 4.5,
          enrolledCount: 1250,
          isCompleted: false,
          progress: 0,
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-2',
          title: 'Python データ分析入門',
          description: 'Pythonを使ったデータ分析の基礎を学習します。pandas、matplotlib等のライブラリの使い方も解説。',
          thumbnailUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 180,
          difficulty: 'intermediate',
          category: 'データサイエンス',
          rating: 4.7,
          enrolledCount: 890,
          isCompleted: true,
          progress: 100,
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-3',
          title: '機械学習アルゴリズム基礎',
          description: '機械学習の主要なアルゴリズムを理論と実践の両面から学習します。',
          thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 240,
          difficulty: 'advanced',
          category: 'AI・機械学習',
          rating: 4.8,
          enrolledCount: 567,
          isCompleted: false,
          progress: 45,
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-4',
          title: 'React フロントエンド開発',
          description: 'Reactを使ったモダンなフロントエンド開発の手法を学びます。',
          thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 200,
          difficulty: 'intermediate',
          category: 'プログラミング',
          rating: 4.6,
          enrolledCount: 723,
          isCompleted: false,
          progress: 0,
          targetAudience: 'dx_talent'
        },
        {
          id: 'content-5',
          title: '日本語会話基礎',
          description: '日常生活や職場で使える基本的な日本語会話を学びます。',
          thumbnailUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 150,
          difficulty: 'beginner',
          category: '日本語学習',
          rating: 4.4,
          enrolledCount: 1456,
          isCompleted: false,
          progress: 25,
          targetAudience: 'foreign_talent'
        },
        {
          id: 'content-6',
          title: '日本文化理解',
          description: '日本の文化、習慣、ビジネスマナーについて学習します。',
          thumbnailUrl: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 90,
          difficulty: 'beginner',
          category: '文化学習',
          rating: 4.3,
          enrolledCount: 892,
          isCompleted: true,
          progress: 100,
          targetAudience: 'foreign_talent'
        }
      ];

      // Filter content based on user type
      let userContents = mockContents;
      if (user?.userType === 'dx_talent') {
        userContents = mockContents.filter(content => 
          content.targetAudience === 'dx_talent' || content.targetAudience === 'both'
        );
      } else if (user?.userType === 'foreign_talent') {
        userContents = mockContents.filter(content => 
          content.targetAudience === 'foreign_talent' || content.targetAudience === 'both'
        );
      }

      setContents(userContents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading contents:', error);
      setIsLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = contents;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(query) ||
        content.description.toLowerCase().includes(query) ||
        content.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(content => content.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(content => content.difficulty === difficultyFilter);
    }

    setFilteredContents(filtered);
  };

  const getUniqueCategories = () => {
    const categories = contents.map(content => content.category);
    return Array.from(new Set(categories));
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">学習管理システム (LMS)</h1>
        <p className="text-gray-600">
          {user?.userType === 'dx_talent' 
            ? 'DXスキルを向上させるためのコースを受講しましょう'
            : user?.userType === 'foreign_talent'
            ? '日本での生活と仕事に必要なスキルを学習しましょう'
            : 'あなたに最適な学習コンテンツを見つけましょう'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="コースを検索..."
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
              <option value="all">全カテゴリ</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">全難易度</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">コースが見つかりません</h3>
          <p className="mt-1 text-sm text-gray-500">
            検索条件を変更してお試しください
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                {content.thumbnailUrl ? (
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpenIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Progress overlay */}
                {content.progress !== undefined && content.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>進捗: {content.progress}%</span>
                      {content.isCompleted && (
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${content.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{content.category}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(content.difficulty)}`}>
                    {getDifficultyLabel(content.difficulty)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {content.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {content.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatDuration(content.duration)}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    {content.rating}
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {content.enrolledCount}
                  </div>
                </div>

                {/* Action button */}
                <Link to={`/lms/course/${content.id}`}>
                  <Button className="w-full">
                    {content.isCompleted ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        復習する
                      </>
                    ) : content.progress && content.progress > 0 ? (
                      <>
                        <PlayIcon className="h-4 w-4 mr-2" />
                        続きを学習
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-4 w-4 mr-2" />
                        学習開始
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LMSPage;