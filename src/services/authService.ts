import { apiService } from './api'
import type { LoginResponse, User, LoginCredentials } from '@/types/user'
import { useAuthStore } from '@/stores/AuthUser'

// Serviços de autenticação e logout
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const useAuth = useAuthStore()

    try {
      const { data } = await apiService.post('/auth/login', credentials)
      useAuth.setUser(data as LoginResponse)
      return data as LoginResponse
    } catch (error) {
      throw error
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Obter token atual
  getToken: (): string | null => {
    return localStorage.getItem('authToken')
  },

  // Obter dados do usuário atual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        return null
      }
    }
    return null
  },

  // Verificar validade do token
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await apiService.get<{ valid: boolean }>('/auth/validate')
      return response.data.valid
    } catch (error) {
      console.error('Erro ao validar token:', error)
      return false
    }
  },

  // Renovar token
  refreshToken: async (): Promise<string> => {
    try {
      const response = await apiService.post<{ token: string }>('/auth/refresh')
      const newToken = response.data.token
      
      localStorage.setItem('authToken', newToken)
      return newToken
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      throw error
    }
  },

  // Alterar senha
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      throw error
    }
  },

  // Solicitar recuperação de senha
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await apiService.post('/auth/forgot-password', { email })
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error)
      throw error
    }
  },

  // Redefinir senha com token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiService.post('/auth/reset-password', {
        token,
        newPassword
      })
    } catch (error) {
      console.error('Erro ao redefinir senha:', error)
      throw error
    }
  }
}