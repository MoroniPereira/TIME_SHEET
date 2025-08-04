<script setup lang="ts">
import { computed, ref } from 'vue'

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

const props = defineProps<{
  entries: TimeEntry[]
}>()

const emit = defineEmits(['entry-deleted'])

const sortedEntries = computed(() => {
  return [...props.entries].sort((a, b) => {
    // Ordenar por data (mais recente primeiro) e depois por hora de início
    const dateA = new Date(`${a.date}T${a.startTime}`)
    const dateB = new Date(`${b.date}T${b.startTime}`)
    return dateB.getTime() - dateA.getTime()
  })
})

const hasEntriesWithLunch = computed(() => {
  return props.entries.some(entry => entry.entryType === 'full' && entry.lunchStartTime && entry.lunchEndTime)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const formatDuration = (hours: number) => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  
  if (wholeHours === 0) {
    return `${minutes} min`
  } else if (minutes === 0) {
    return `${wholeHours}h`
  } else {
    return `${wholeHours}h ${minutes}min`
  }
}

const deleteEntry = (id: number) => {
  if (confirm('Tem certeza que deseja excluir este registro?')) {
    emit('entry-deleted', id)
  }
}
</script>

<template>
  <div class="time-entry-list">
    <h2>Registros de Horas</h2>
    
    <div v-if="sortedEntries.length === 0" class="empty-state">
      <p>Nenhum registro encontrado.</p>
    </div>
    
    <table v-else class="entries-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Entrada</th>
          <th v-if="hasEntriesWithLunch">Saída Almoço</th>
          <th v-if="hasEntriesWithLunch">Retorno Almoço</th>
          <th>Saída</th>
          <th>Duração</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in sortedEntries" :key="entry.id">
          <td>{{ formatDate(entry.date) }}</td>
          <td>{{ entry.startTime }}</td>
          <td v-if="hasEntriesWithLunch">{{ entry.lunchStartTime || '-' }}</td>
          <td v-if="hasEntriesWithLunch">{{ entry.lunchEndTime || '-' }}</td>
          <td>{{ entry.endTime }}</td>
          <td>{{ formatDuration(entry.durationHours) }}</td>
          <td class="description-cell">{{ entry.description }}</td>
          <td>
            <button @click="deleteEntry(entry.id)" class="btn-delete">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.time-entry-list {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--color-shadow);
}

h2 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: var(--color-accent);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--color-text-secondary);
  font-style: italic;
  background-color: var(--color-surface-variant);
  border-radius: 4px;
  margin-top: 20px;
}

.entries-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 25px;
  border-radius: 4px;
  overflow: hidden;
}

.entries-table th,
.entries-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.entries-table th {
  background-color: var(--color-surface-variant);
  color: var(--color-text);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.entries-table tr:hover {
  background-color: rgba(187, 134, 252, 0.05);
}

.entries-table tr:last-child td {
  border-bottom: none;
}

.description-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-secondary);
}

.btn-delete {
  background-color: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background-color: var(--color-error);
  color: var(--color-text);
}
</style>