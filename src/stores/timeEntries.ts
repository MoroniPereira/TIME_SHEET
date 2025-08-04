import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

export const useTimeEntriesStore = defineStore('timeEntries', () => {
  const entries = ref<TimeEntry[]>([])
  const totalHours = ref(0)

  // Carregar dados do localStorage ao inicializar
  const loadEntries = () => {
    const entriesStr = localStorage.getItem('timeEntries')
    if (entriesStr) {
      entries.value = JSON.parse(entriesStr)
      calculateTotalHours()
    }
  }

  // Salvar dados no localStorage
  const saveEntries = () => {
    localStorage.setItem('timeEntries', JSON.stringify(entries.value))
  }

  // Adicionar uma nova entrada
  const addEntry = (entry: TimeEntry) => {
    entries.value.push(entry)
    saveEntries()
    calculateTotalHours()
  }

  // Remover uma entrada
  const deleteEntry = (id: number) => {
    entries.value = entries.value.filter(entry => entry.id !== id)
    saveEntries()
    calculateTotalHours()
  }

  // Calcular total de horas
  const calculateTotalHours = () => {
    totalHours.value = entries.value.reduce((sum, entry) => sum + entry.durationHours, 0)
  }

  // Entradas ordenadas por data (mais recente primeiro)
  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`)
      const dateB = new Date(`${b.date}T${b.startTime}`)
      return dateB.getTime() - dateA.getTime()
    })
  })

  // Formatar o total de horas
  const formattedTotalHours = computed(() => {
    const hours = Math.floor(totalHours.value)
    const minutes = Math.round((totalHours.value - hours) * 60)
    return `${hours}h ${minutes}min`
  })

  return {
    entries,
    totalHours,
    sortedEntries,
    formattedTotalHours,
    loadEntries,
    addEntry,
    deleteEntry
  }
})