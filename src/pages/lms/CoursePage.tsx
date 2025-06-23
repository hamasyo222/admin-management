import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  ArrowLeftIcon,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface LearningContent {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  contentType: 'video' | 'text' | 'quiz' | 'interactive';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  targetAudience?: 'dx_talent' | 'foreign_talent' | 'both';
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  contentType: 'video' | 'text' | 'quiz' | 'interactive';
  isCompleted: boolean;
  isLocked: boolean;
}

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<LearningContent | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'reviews'>('overview');

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock course data
      const mockCourses: Record<string, LearningContent> = {
        'content-1': {
          id: 'content-1',
          title: 'JavaScript基礎講座',
          description: 'JavaScriptの基本文法から始めて、実際のアプリケーション開発まで学習します。変数、関数、オブジェクト、配列などの基本概念から、DOM操作、イベント処理、非同期プログラミングまで幅広くカバーします。',
          categoryId: 'cat-1',
          contentType: 'video',
          difficultyLevel: 'beginner',
          estimatedDuration: 120,
          thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          targetAudience: 'dx_talent'
        },
        'content-2': {
          id: 'content-2',
          title: 'Python データ分析入門',
          description: 'Pythonを使ったデータ分析の基礎を学習します。pandas、matplotlib等のライブラリの使い方も解説。',
          categoryId: 'cat-2',
          contentType: 'video',
          difficultyLevel: 'intermediate',
          estimatedDuration: 180,
          thumbnailUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          targetAudience: 'dx_talent'
        },
        'content-5': {
          id: 'content-5',
          title: '日本語会話基礎',
          description: '日常生活や職場で使える基本的な日本語会話を学びます。',
          categoryId: 'cat-4',
          contentType: 'video',
          difficultyLevel: 'beginner',
          estimatedDuration: 150,
          thumbnailUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPublished: true,
          targetAudience: 'foreign_talent'
        }
      };

      const courseData = mockCourses[id];
      if (!courseData) {
        throw new Error('Course not found');
      }

      setCourse(courseData);

      // Mock modules data
      const mockModules: Record<string, Module[]> = {
        'content-1': [
          {
            id: 'module-1',
            title: 'JavaScript入門',
            description: 'JavaScriptの基本概念と歴史',
            duration: 30,
            contentType: 'video',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'module-2',
            title: '変数と データ型',
            description: '変数の宣言方法とデータ型について',
            duration: 45,
            contentType: 'video',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'module-3',
            title: '関数とスコープ',
            description: '関数の定義と呼び出し、スコープの概念',
            duration: 60,
            contentType: 'video',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 'module-4',
            title: 'DOM操作',
            description: 'HTMLドキュメントの操作方法',
            duration: 75,
            contentType: 'video',
            isCompleted: false,
            isLocked: true
          }
        ],
        'content-2': [
          {
            id: 'module-1',
            title: 'Python基礎',
            description: 'Pythonの基本文法',
            duration: 45,
            contentType: 'video',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 'module-2',
            title: 'Pandas入門',
            description: 'データ操作ライブラリPandasの使い方',
            duration: 60,
            contentType: 'video',
            isCompleted: false,
            isLocked: true
          }
        ],
        'content-5': [
          {
            id: 'module-1',
            title: 'ひらがな・カタカナ',
            description: '基本的な文字の読み書き',
            duration: 40,
            contentType: 'video',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'module-2',
            title: '基本的な挨拶',
            description: '日常的な挨拶表現',
            duration: 35,
            contentType: 'video',
            isCompleted: false,
            isLocked: false
          }
        ]
      };

      const moduleData = mockModules[id] || [];
      setModules(moduleData);

      // Calculate progress
      const completedModules = moduleData.filter(m => m.isCompleted).length;
      const progressPercentage = moduleData.length > 0 ? (completedModules / moduleData.length) * 100 : 0;
      setProgress(progressPercentage);

      // Check if user is enrolled (mock logic)
      setIsEnrolled(true);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading course:', error);
      setIsLoading(false);
      toast.error('コースの読み込みに失敗しました');
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    toast.success('コースに登録しました');
  };

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      toast.success(`${module.title}を開始しました`);
      // In a real app, this would navigate to the module content
    } else {
      toast.error('このモジュールはまだ利用できません');
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return level;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-5 w-5" />;
      case 'text':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-5 w-5" />;
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">コースが見つかりません</h3>
        <p className="mt-1 text-sm text-gray-500">
          指定されたコースは存在しないか、アクセス権限がありません
        </p>
        <Button
          onClick={() => navigate('/lms')}
          className="mt-4"
        >
          LMSに戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/lms')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficultyLevel)}`}>
              {getDifficultyLabel(course.difficultyLevel)}
            </span>
            <div className="flex items-center text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{course.estimatedDuration}分</span>
            </div>
            <div className="flex items-center text-gray-500">
              <StarIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">4.5 (123件)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Image */}
          {course.thumbnailUrl && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'modules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                モジュール
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                レビュー
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">コース概要</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">学習内容</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    基本概念の理解
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    実践的なスキルの習得
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    プロジェクトベースの学習
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        {module.isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs text-gray-500">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-500">{module.description}</p>
                        <div className="flex items-center mt-1 space-x-4">
                          <div className="flex items-center text-gray-500">
                            {getContentTypeIcon(module.contentType)}
                            <span className="ml-1 text-xs">{module.contentType}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">{module.duration}分</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleStartModule(module.id)}
                      disabled={module.isLocked}
                      variant={module.isCompleted ? "outline" : "primary"}
                    >
                      {module.isCompleted ? '復習' : module.isLocked ? 'ロック中' : '開始'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">レビュー</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">山田太郎</span>
                  </div>
                  <p className="text-gray-700">とても分かりやすい内容でした。初心者にもおすすめです。</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <StarIcon className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">佐藤花子</span>
                  </div>
                  <p className="text-gray-700">実践的な内容が多くて良かったです。</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {isEnrolled ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">学習進捗</h3>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <Button className="w-full">
                  学習を続ける
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">このコースを受講</h3>
                <Button
                  className="w-full"
                  onClick={handleEnroll}
                >
                  コースに登録
                </Button>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">コース情報</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">レベル</span>
                <span className="text-gray-900">{getDifficultyLabel(course.difficultyLevel)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">所要時間</span>
                <span className="text-gray-900">{course.estimatedDuration}分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">モジュール数</span>
                <span className="text-gray-900">{modules.length}個</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">受講者数</span>
                <span className="text-gray-900">1,234人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;