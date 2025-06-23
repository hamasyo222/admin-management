export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: 'admin' | 'company_admin' | 'company_employee' | 'dx_talent' | 'foreign_talent' | 'support_staff';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  companyId?: string;
  companyName?: string;
  companyCode?: string;
  accessibleContents?: string[];
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface LearningContent {
  id: string;
  title: string;
  titleTranslations?: Record<string, string>;
  description: string;
  descriptionTranslations?: Record<string, string>;
  categoryId: string;
  contentType: 'video' | 'text' | 'quiz' | 'interactive';
  contentTypes?: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  thumbnailUrl?: string;
  fileUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  targetUserType?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  targetAudience?: 'dx_talent' | 'foreign_talent' | 'both';
  modules?: string[];
  accessibleTo?: string[];
}

export interface ContentCategory {
  id: string;
  name: string;
  nameTranslations?: Record<string, string>;
  description?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  contentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt?: string;
  timeSpent: number;
  attempts: number;
  bestScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  nameKana?: string;
  industry?: string;
  employeeCount?: number;
  address?: {
    country?: string;
    prefecture?: string;
    city?: string;
    street?: string;
    postalCode?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  isSpecificSkillCertified: boolean;
  certificationNumber?: string;
  createdAt: string;
  updatedAt: string;
  code?: string;
  accessibleContents?: string[];
}