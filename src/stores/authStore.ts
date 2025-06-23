import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Mock authentication - in a real app, this would call an API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data based on email
          let mockUser: User;
          
          if (email === 'admin@dxseed.com') {
            mockUser = {
              id: '1',
              email: 'admin@dxseed.com',
              firstName: '管理者',
              lastName: 'システム',
              userType: 'admin',
              status: 'active',
              emailVerified: true,
              createdAt: '2023-01-01T00:00:00Z',
              lastLoginAt: new Date().toISOString()
            };
          } else if (email === 'company@dxseed.com') {
            mockUser = {
              id: '2',
              email: 'company@dxseed.com',
              firstName: '太郎',
              lastName: '山田',
              userType: 'company_admin',
              status: 'active',
              emailVerified: true,
              companyId: 'company-1',
              companyName: '株式会社テックソリューションズ',
              companyCode: 'TECH123',
              createdAt: '2023-01-15T00:00:00Z',
              lastLoginAt: new Date().toISOString()
            };
          } else if (email === 'employee@dxseed.com') {
            mockUser = {
              id: '3',
              email: 'employee@dxseed.com',
              firstName: '次郎',
              lastName: '鈴木',
              userType: 'company_employee',
              status: 'active',
              emailVerified: true,
              companyId: 'company-1',
              companyName: '株式会社テックソリューションズ',
              createdAt: '2023-02-01T00:00:00Z',
              lastLoginAt: new Date().toISOString()
            };
          } else if (email === 'dx-talent@dxseed.com') {
            mockUser = {
              id: '4',
              email: 'dx-talent@dxseed.com',
              firstName: '花子',
              lastName: '佐藤',
              userType: 'dx_talent',
              status: 'active',
              emailVerified: true,
              accessibleContents: ['content-1', 'content-2'],
              createdAt: '2023-02-01T00:00:00Z',
              lastLoginAt: new Date().toISOString()
            };
          } else if (email === 'foreign-talent@dxseed.com') {
            mockUser = {
              id: '5',
              email: 'foreign-talent@dxseed.com',
              firstName: 'ヴァン・アン',
              lastName: 'グエン',
              userType: 'foreign_talent',
              status: 'active',
              emailVerified: true,
              accessibleContents: ['content-5'],
              createdAt: '2023-02-15T00:00:00Z',
              lastLoginAt: new Date().toISOString()
            };
          } else {
            throw new Error('Invalid credentials');
          }
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          // Mock registration - in a real app, this would call an API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email!,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userData.userType || 'dx_talent',
            status: 'active',
            emailVerified: false,
            companyId: userData.companyId,
            companyName: userData.companyName,
            companyCode: userData.companyCode,
            createdAt: new Date().toISOString()
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...userData,
              updatedAt: new Date().toISOString()
            } 
          });
        }
      },

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);