<script setup lang="ts">
import { ref } from 'vue'

import AsideMenu from '@/components/AsideMenu.vue'
import HeaderComponent from '@/components/HeaderComponent.vue';

const showFullAside = ref(false);

const handleShowFullAside = () => {
  showFullAside.value = !showFullAside.value;
}
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <HeaderComponent :handleShowFullAside="handleShowFullAside"/>

      <div class="container-dashboard">
        <AsideMenu :handleShowFullAside="handleShowFullAside" :showFullAside="showFullAside" />
        <router-view></router-view>
      </div>
      
      <div class="dashboard-footer">
        <p>TXC © {{ new Date().getFullYear() }}  - Todos os direitos reservados</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
  overflow: hidden;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100dvh;
  z-index: 2;
}

.container-dashboard {
  display: flex;
  flex: 1;
}

.container-dashboard > *:not(.sidebar) {
  flex: 1;
  transition: margin-left 0.3s ease;
}
.dashboard-footer {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}
</style>