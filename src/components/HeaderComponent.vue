<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTimeEntriesStore } from '../stores/timeEntries'

const props = defineProps({
  handleShowFullAside: {
    type: Function,
    required: true
  }
})

const router = useRouter()
const timeEntriesStore = useTimeEntriesStore()

const username = ref('')
const nomeUsuario = ref('')

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    router.push('/login')
    return
  }
  
  try {
    const user = JSON.parse(userStr)
    username.value = user.username
    nomeUsuario.value = user.nome || user.username
  
    timeEntriesStore.loadEntries()
  } catch (error) {
    console.error('Erro ao processar dados:', error)
    router.push('/login')
  }
})
</script>

<template>
  <header class="dashboard-header">
    <div class="content-header-title">
      <button class="toggle-btn" @click="props.handleShowFullAside()">☰</button>

      <router-link to="/dashboard" class="logo">
        <span class="logo-text">TIME</span>
        <span class="logo-accent">SHEET</span>
      </router-link>
    </div>

    <div class="user-info">
      <span class="welcome-message">Olá, {{ nomeUsuario }}</span>
      <button @click="logout" class="btn logout-btn">
        <span class="btn-icon">🚪</span>
        <span>Sair</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding: 20px;
}

.content-header-title {
  display: flex;
  gap: 1rem;
}
.toggle-btn {
  border-radius: 8px;
  width: 40px;
  height: 40px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: none;
  outline: none;
  font-size: 1.3rem;
}

.toggle-btn:hover {
  transform: scale(1.05);
}

.logo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  display: inline-block;
}

.logo-text {
  color: var(--color-text);
}

.logo-accent {
  color: var(--color-accent);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome-message {
  color: var(--color-text-secondary);
  font-size: 16px;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--color-surface-variant);
  border-color: var(--color-accent);
}

.btn-icon {
  font-size: 16px;
}
</style>