<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import { required, email, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const router = useRouter()
const route = useRoute()

const rules = {
  email: { required, email },
  password: { required, minLength:minLength(6) }
}

const state = reactive({
  email: 'dev01.txc@gmail.com',
  password: 'Txc@2015'
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  v$.value.$touch()
  if (v$.value.$valid) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authService.login(state)
    router.push('/dashboard')
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = 'Email ou senha incorretos'
    } else if (error.request) {
      errorMessage.value = 'Erro de conexão. Verifique sua internet'
    } else {
      errorMessage.value = 'Erro inesperado. Tente novamente'
    }
  } finally {
    isLoading.value = false
  }
}

const onBlur = (field: 'email' | 'password') => {
  v$.value[field].$touch()
}

onMounted(() => {
  if (route.query.expired === 'true') {
    errorMessage.value = 'Sua sessão expirou. Faça login novamente.'
  } else if (route.query.error === 'true') {
    errorMessage.value = 'Erro de autenticação. Faça login novamente.'
  }
})

const v$ = useVuelidate(rules, state)
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">TIME</span>
            <span class="logo-accent">SHEET</span>
          </div>
          <h1 class="login-title">Sistema de Banco de Horas</h1>
          <p class="login-subtitle">Faça login para acessar sua conta</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>

            <div class="input-container">
              <span class="input-icon">📧</span>
              <input 
                id="email" 
                v-model="state.email" 
                type="email" 
                class="form-control" 
                placeholder="Digite seu email"
                autocomplete="email"
                @blur="onBlur('email')"
                :class="{ 'error': v$.email.$error }"
              >
            </div>

            <div v-if="v$.email.$error" class="field-error">
              E-mail inválido
             </div>
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <div class="input-container">
              <span class="input-icon">🔒</span>
              <input 
                id="password" 
                v-model="state.password" 
                type="password" 
                class="form-control" 
                placeholder="Digite sua senha"
                autocomplete="current-password"
                @blur="onBlur('password')"
                :class="{ 'error': v$.password.$error }"
               >
            </div>
            <div v-if="v$.password.$error" class="field-error">
              A senha deve ter no mínimo 6 caracteres
             </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn login-btn" :disabled="isLoading || (v$.email.$error || v$.password.$error)">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
          </button>
        </form>
      </div>
      
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} Sistema de Banco de Horas</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-error: #dc2626;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-border: #d1d5db;
  --color-bg: #f9fafb;
  --color-white: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(45, 45, 45, 0.2) 0%, rgba(18, 18, 18, 0) 70%);
  z-index: 1;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  z-index: 2;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--color-shadow);
  margin-bottom: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 16px;
  display: inline-block;
}

.logo-text {
  color: var(--color-text);
}

.logo-accent {
  color: var(--color-accent);
}

.login-title {
  color: var(--color-text);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--color-text-secondary);
}

.form-control {
  padding-left: 40px;
}

.login-btn {
  width: 100%;
  margin-top: 24px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 48px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-background);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(207, 102, 121, 0.1);
  border-radius: 4px;
}

.field-error {
  color: var(--color-error);
  font-size: 14px;
  margin-top: 4px;
}

.form-control.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 2px rgba(207, 102, 121, 0.2);
}

.error-icon {
  font-size: 16px;
}

.login-footer {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-top: 20px;
}

/* Responsividade */
@media (max-width: 600px) {
  .login-card {
    padding: 30px 20px;
    max-width: 90%;
  }
  
  .logo {
    font-size: 28px;
  }
  
  .login-title {
    font-size: 20px;
  }
}
</style>