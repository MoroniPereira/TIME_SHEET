<script setup lang="ts">
const props = defineProps({
  handleShowFullAside: {
    type: Function,
    required: true
  },
  showFullAside: {
    type: Boolean,
    required: true
  },
})
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': !props.showFullAside }">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item active">
          <router-link to="/dashboard/employee" class="nav-link" :title="!props.showFullAside ? 'Funcionários' : ''">
            <span class="nav-icon">👥</span>
            <span class="nav-text" v-if="props.showFullAside">Funcionários</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="#" class="nav-link" :title="!props.showFullAside ? 'Banco' : ''">
            <span class="nav-icon">🏢</span>
            <span class="nav-text" v-if="props.showFullAside">Banco</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="#" class="nav-link" :title="!props.showFullAside ? 'Justificativas' : ''">
            <span class="nav-icon">📝</span>
            <span class="nav-text" v-if="props.showFullAside">Justificativas</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="#" class="nav-link" :title="!props.showFullAside ? 'Relatórios' : ''">
            <span class="nav-icon">📊</span>
            <span class="nav-text" v-if="props.showFullAside">Relatórios</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <nav class="sidebar-nav" v-if="false">
      <ul class="nav-list">
        <li class="nav-item active">
          <router-link to="/dashboard/employee" class="nav-link" :title="!props.showFullAside ? 'Funcionários' : ''">
            <span class="nav-icon">👥</span>
            <span class="nav-text" v-if="props.showFullAside">Pontos</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="#" class="nav-link" :title="!props.showFullAside ? 'Departamentos' : ''">
            <span class="nav-icon">🏢</span>
            <span class="nav-text" v-if="props.showFullAside">Justificativas</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="#" class="nav-link" :title="!props.showFullAside ? 'Relatórios' : ''">
            <span class="nav-icon">📊</span>
            <span class="nav-text" v-if="props.showFullAside">Relatórios</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow-y: auto;
  transition: width 0.3s ease;
  min-width: 250px;
  padding: 1rem 0;
}

.sidebar-collapsed {
  min-width: 70px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 1rem;
}

.nav-list {
  list-style: none;
  padding: 0 1rem;
  margin: 0;
  flex: 1;
}

.sidebar-collapsed .nav-list {
  padding: 0 0.5rem;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: #b0b0b0;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem 0.5rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sidebar:not(.sidebar-collapsed) .nav-link:hover {
  transform: translateX(5px);
}

.nav-item.active .nav-link {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .nav-text {
  opacity: 0;
  width: 0;
}

/* Tooltip para modo colapsado */
.sidebar-collapsed .nav-link {
  position: relative;
}

.sidebar-collapsed .nav-link:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1001;
  margin-left: 0.5rem;
  pointer-events: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease, width 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    width: 250px;
  }
}
</style>