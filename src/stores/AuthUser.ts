import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginResponse } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const userLocale = localStorage.getItem('user')
  const tokenLocale = localStorage.getItem('token')

  const user = ref(userLocale ? JSON.parse(userLocale) : null)
  const token = ref<string | null>(tokenLocale)

  const setUser = (dataUser: LoginResponse) => {
    user.value = dataUser.user
    token.value = dataUser.token
    localStorage.setItem('user', JSON.stringify(dataUser.user))
    localStorage.setItem('token', dataUser.token)
  }

  const isAuthenticated = computed(() => {
    return user.value !== null
  })

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    setUser,
    isAuthenticated,
  }
})
