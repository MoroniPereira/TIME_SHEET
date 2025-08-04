<script setup lang="ts">
import { ref, computed } from 'vue'
import TimeEntryForm from '../components/TimeEntryForm.vue'
import TimeEntryList from '../components/TimeEntryList.vue'
import { useTimeEntriesStore } from '../stores/timeEntries'

interface TimeEntry {
  id: number
  date: string
  startTime: string
  endTime: string
  description: string
  durationHours: number
  entryType?: string
  lunchStartTime?: string
  lunchEndTime?: string
}

const timeEntriesStore = useTimeEntriesStore()
const showJustificationForm = ref(false)

// Obter registros do dia atual
const todayEntries = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return timeEntriesStore.entries.filter(entry => entry.date === today)
})

// Determinar próximo tipo de ponto
const nextPunchType = computed(() => {
  const todayEntry = todayEntries.value[0]
  
  if (!todayEntry) {
    return 'Entrada'
  }
  
  if (todayEntry.entryType === 'full') {
    if (!todayEntry.lunchStartTime) return 'Saída para Almoço'
    if (!todayEntry.lunchEndTime) return 'Retorno do Almoço'
    if (!todayEntry.endTime) return 'Saída'
  } else {
    if (!todayEntry.endTime) return 'Saída'
  }
  
  return 'Entrada' // Novo dia
})

// Status do dia
const dayStatus = computed(() => {
  const todayEntry = todayEntries.value[0]
  
  if (!todayEntry) {
    return 'Não iniciado'
  }
  
  if (todayEntry.entryType === 'full') {
    if (!todayEntry.lunchStartTime) return 'Trabalhando (manhã)'
    if (!todayEntry.lunchEndTime) return 'Pausa para almoço'
    if (!todayEntry.endTime) return 'Trabalhando (tarde)'
    return 'Finalizado'
  } else {
    if (!todayEntry.endTime) return 'Trabalhando'
    return 'Finalizado'
  }
})

// Bater ponto
const punchClock = () => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().slice(0, 5)
  
  const todayEntry = todayEntries.value[0]
  
  if (!todayEntry) {
    // Primeiro registro do dia - sempre entrada
    const newEntry: TimeEntry = {
      id: Date.now(),
      date: today,
      startTime: currentTime,
      endTime: '',
      description: 'Registro automático de ponto',
      durationHours: 0,
      entryType: 'simple'
    }
    timeEntriesStore.addEntry(newEntry)
  } else {
    // Atualizar registro existente
    const updatedEntry = { ...todayEntry }
    
    if (todayEntry.entryType === 'full') {
      if (!todayEntry.lunchStartTime) {
        updatedEntry.lunchStartTime = currentTime
      } else if (!todayEntry.lunchEndTime) {
        updatedEntry.lunchEndTime = currentTime
      } else if (!todayEntry.endTime) {
        updatedEntry.endTime = currentTime
        updatedEntry.durationHours = calculateFullDayDuration(updatedEntry)
      }
    } else {
      if (!todayEntry.endTime) {
        updatedEntry.endTime = currentTime
        updatedEntry.durationHours = calculateSimpleDuration(updatedEntry.startTime, currentTime)
      }
    }
    
    // Remover entrada antiga e adicionar atualizada
    timeEntriesStore.deleteEntry(todayEntry.id)
    timeEntriesStore.addEntry(updatedEntry)
  }
}

// Calcular duração para dia completo
const calculateFullDayDuration = (entry: TimeEntry) => {
  let totalDuration = 0
  
  if (entry.lunchStartTime) {
    const [startHours, startMinutes] = entry.startTime.split(':').map(Number)
    const [lunchStartHours, lunchStartMinutes] = entry.lunchStartTime.split(':').map(Number)
    
    let morningHours = lunchStartHours - startHours
    let morningMinutes = lunchStartMinutes - startMinutes
    
    if (morningMinutes < 0) {
      morningHours--
      morningMinutes += 60
    }
    
    totalDuration += morningHours + (morningMinutes / 60)
  }
  
  if (entry.lunchEndTime && entry.endTime) {
    const [lunchEndHours, lunchEndMinutes] = entry.lunchEndTime.split(':').map(Number)
    const [endHours, endMinutes] = entry.endTime.split(':').map(Number)
    
    let afternoonHours = endHours - lunchEndHours
    let afternoonMinutes = endMinutes - lunchEndMinutes
    
    if (afternoonMinutes < 0) {
      afternoonHours--
      afternoonMinutes += 60
    }
    
    totalDuration += afternoonHours + (afternoonMinutes / 60)
  }
  
  return totalDuration
}

// Calcular duração simples
const calculateSimpleDuration = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)
  
  let durationHours = endHours - startHours
  let durationMinutes = endMinutes - startMinutes
  
  if (durationMinutes < 0) {
    durationHours--
    durationMinutes += 60
  }
  
  return durationHours + (durationMinutes / 60)
}

// Alternar entre registro completo e simples
const toggleEntryType = () => {
  const todayEntry = todayEntries.value[0]
  
  if (todayEntry && !todayEntry.lunchStartTime) {
    const updatedEntry = { ...todayEntry }
    updatedEntry.entryType = updatedEntry.entryType === 'full' ? 'simple' : 'full'
    
    timeEntriesStore.deleteEntry(todayEntry.id)
    timeEntriesStore.addEntry(updatedEntry)
  }
}
</script>

<template>
  <main class="dashboard-main">
    <h1 class="dashboard-title">Sistema de Controle de Ponto</h1>
    
    <!-- Informativo do Dia -->
    <div class="day-info-section">
      <div class="day-info-card">
        <h3 class="day-info-title">Registros de Hoje</h3>
        <div class="day-status">
          <span class="status-label">Status:</span>
          <span class="status-value" :class="dayStatus.toLowerCase().replace(/\s+/g, '-')">{{ dayStatus }}</span>
        </div>
        
        <div v-if="todayEntries.length > 0" class="today-entries">
          <div class="entry-item" v-for="entry in todayEntries" :key="entry.id">
            <div class="entry-times">
              <span class="time-item">📍 Entrada: {{ entry.startTime }}</span>
              <span v-if="entry.lunchStartTime" class="time-item">🍽️ Saída Almoço: {{ entry.lunchStartTime }}</span>
              <span v-if="entry.lunchEndTime" class="time-item">🔄 Retorno Almoço: {{ entry.lunchEndTime }}</span>
              <span v-if="entry.endTime" class="time-item">🚪 Saída: {{ entry.endTime }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="no-entries">
          <p>Nenhum registro hoje</p>
        </div>
      </div>
      
      <!-- Botão Bater Ponto -->
      <div class="punch-clock-section">
        <button 
          @click="punchClock" 
          class="punch-btn"
          :disabled="dayStatus === 'Finalizado'"
        >
          <span class="punch-icon">⏰</span>
          <span class="punch-text">{{ nextPunchType }}</span>
        </button>
        
        <div v-if="todayEntries.length > 0 && !todayEntries[0].lunchStartTime" class="entry-type-toggle">
          <button @click="toggleEntryType" class="toggle-btn">
            {{ todayEntries[0].entryType === 'full' ? '🍽️ Com Almoço' : '⚡ Sem Almoço' }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="dashboard-summary">
      <div class="summary-card">
        <h3 class="summary-title">Total de Horas</h3>
        <div class="summary-value">{{ timeEntriesStore.formattedTotalHours }}</div>
      </div>
    </div>
    
    <!-- Seção de Justificativas -->
    <div class="justification-section">
      <div class="section-header">
        <h2>Lançar Justificativa</h2>
        <button @click="showJustificationForm = !showJustificationForm" class="toggle-form-btn">
          {{ showJustificationForm ? 'Ocultar' : 'Mostrar' }} Formulário
        </button>
      </div>
      
      <div v-if="showJustificationForm" class="form-container">
        <TimeEntryForm @entry-added="timeEntriesStore.addEntry" />
      </div>
    </div>
    
    <div class="entries-section">
      <TimeEntryList 
        :entries="timeEntriesStore.sortedEntries" 
        @entry-deleted="timeEntriesStore.deleteEntry" 
      />
    </div>
  </main>
</template>

<style scoped>
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  color: var(--color-text);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.dashboard-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--color-shadow);
  flex: 1;
  text-align: center;
}

.summary-title {
  color: var(--color-text-secondary);
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
}

.summary-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-accent);
}

.day-info-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.day-info-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--color-shadow);
}

.day-info-title {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.day-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.status-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.status-value {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-value.não-iniciado {
  background-color: rgba(128, 128, 128, 0.2);
  color: var(--color-text-secondary);
}

.status-value.trabalhando,
.status-value.trabalhando-manha,
.status-value.trabalhando-tarde {
  background-color: rgba(3, 218, 198, 0.2);
  color: var(--color-accent);
}

.status-value.pausa-para-almoço {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-value.finalizado {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.today-entries {
  margin-top: 15px;
}

.entry-item {
  margin-bottom: 10px;
}

.entry-times {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item {
  color: var(--color-text);
  font-size: 14px;
  padding: 8px 12px;
  background-color: var(--color-surface-variant);
  border-radius: 6px;
  border-left: 3px solid var(--color-accent);
}

.no-entries {
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
  padding: 20px;
}

.punch-clock-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.punch-btn {
  background: linear-gradient(135deg, var(--color-accent), #a56ef2);
  color: var(--color-background);
  border: none;
  padding: 20px 30px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 150px;
  box-shadow: 0 4px 15px rgba(187, 134, 252, 0.3);
}

.punch-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 134, 252, 0.4);
}

.punch-btn:disabled {
  background: var(--color-surface-variant);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.punch-icon {
  font-size: 24px;
}

.punch-text {
  font-size: 16px;
}

.entry-type-toggle {
  width: 100%;
}

.toggle-btn {
  background-color: var(--color-surface-variant);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  width: 100%;
}

.toggle-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-background);
  border-color: var(--color-accent);
}

.justification-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.toggle-form-btn {
  background-color: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.toggle-form-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-background);
}

.form-container {
  margin-top: 20px;
}

.entries-section {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .day-info-section {
    grid-template-columns: 1fr;
  }
  
  .punch-clock-section {
    order: -1;
  }
  
  .section-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>