<script setup lang="ts">
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

const date = ref(new Date().toISOString().split('T')[0])
const startTime = ref('')
const endTime = ref('')
const description = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const lunchStartTime = ref('')
const lunchEndTime = ref('')
const hasLunchBreak = ref(false)

const emit = defineEmits(['entry-added'])

const resetForm = () => {
  date.value = new Date().toISOString().split('T')[0]
  startTime.value = ''
  endTime.value = ''
  lunchStartTime.value = ''
  lunchEndTime.value = ''
  description.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  hasLunchBreak.value = false
}

const calculateDuration = () => {
  let totalDuration = 0
  
  // Calcular duração da manhã (se tiver pausa para almoço)
  if (hasLunchBreak.value && lunchStartTime.value) {
    const [startHours, startMinutes] = startTime.value.split(':').map(Number)
    const [lunchStartHours, lunchStartMinutes] = lunchStartTime.value.split(':').map(Number)
    
    let morningHours = lunchStartHours - startHours
    let morningMinutes = lunchStartMinutes - startMinutes
    
    if (morningMinutes < 0) {
      morningHours--
      morningMinutes += 60
    }
    
    totalDuration += morningHours + (morningMinutes / 60)
  }
  
  // Calcular duração da tarde (se tiver pausa para almoço)
  if (hasLunchBreak.value && lunchEndTime.value) {
    const [lunchEndHours, lunchEndMinutes] = lunchEndTime.value.split(':').map(Number)
    const [endHours, endMinutes] = endTime.value.split(':').map(Number)
    
    let afternoonHours = endHours - lunchEndHours
    let afternoonMinutes = endMinutes - lunchEndMinutes
    
    if (afternoonMinutes < 0) {
      afternoonHours--
      afternoonMinutes += 60
    }
    
    totalDuration += afternoonHours + (afternoonMinutes / 60)
  }
  
  // Se não tiver pausa para almoço, calcular duração total diretamente
  if (!hasLunchBreak.value) {
    const [startHours, startMinutes] = startTime.value.split(':').map(Number)
    const [endHours, endMinutes] = endTime.value.split(':').map(Number)
    
    let durationHours = endHours - startHours
    let durationMinutes = endMinutes - startMinutes
    
    if (durationMinutes < 0) {
      durationHours--
      durationMinutes += 60
    }
    
    totalDuration = durationHours + (durationMinutes / 60)
  }
  
  return totalDuration
}

const submitEntry = () => {
  // Validação básica
  if (!date.value || !startTime.value || !endTime.value) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios.'
    return
  }

  // Validar horários com base no tipo de registro (com ou sem pausa para almoço)
  if (hasLunchBreak.value) {
    // Validar campos de pausa para almoço
    if (!lunchStartTime.value || !lunchEndTime.value) {
      errorMessage.value = 'Por favor, preencha os horários de pausa para almoço.'
      return
    }
    
    // Validar sequência de horários
    if (startTime.value >= lunchStartTime.value) {
      errorMessage.value = 'A hora de saída para almoço deve ser posterior à hora de entrada.'
      return
    }
    
    if (lunchStartTime.value >= lunchEndTime.value) {
      errorMessage.value = 'A hora de retorno do almoço deve ser posterior à hora de saída para almoço.'
      return
    }
    
    if (lunchEndTime.value >= endTime.value) {
      errorMessage.value = 'A hora de saída deve ser posterior à hora de retorno do almoço.'
      return
    }
  } else {
    // Validar apenas início e fim para dias sem pausa
    const start = new Date(`${date.value}T${startTime.value}`)
    const end = new Date(`${date.value}T${endTime.value}`)
    
    if (end <= start) {
      errorMessage.value = 'A hora de término deve ser posterior à hora de início.'
      return
    }
  }

  // Calcular duração em horas
  const durationHours = calculateDuration()

  // Criar objeto de entrada
  const entry = {
    id: Date.now(), // ID único baseado no timestamp
    date: date.value,
    startTime: startTime.value,
    endTime: endTime.value,
    description: description.value,
    durationHours,
    entryType: hasLunchBreak.value ? 'full' : 'simple'
  }
  
  // Adicionar horários de almoço se aplicável
  if (hasLunchBreak.value) {
    Object.assign(entry, {
      lunchStartTime: lunchStartTime.value,
      lunchEndTime: lunchEndTime.value
    })
  }
  
  // Emitir evento para o componente pai
  emit('entry-added', entry)
  
  // Mostrar mensagem de sucesso
  successMessage.value = 'Registro adicionado com sucesso!'
  
  // Limpar mensagem de erro se houver
  errorMessage.value = ''
  
  // Limpar formulário após alguns segundos
  setTimeout(() => {
    resetForm()
  }, 3000)
}
</script>

<template>
  <div class="time-entry-form">
    <h2>Registrar Horas</h2>
    
    <form @submit.prevent="submitEntry">
      <div class="form-group">
        <label for="date">Data</label>
        <input 
          id="date" 
          v-model="date" 
          type="date" 
          class="form-control" 
          required
        >
      </div>
      
      <div class="form-group toggle-container">
        <label class="toggle-label">
          <input type="checkbox" v-model="hasLunchBreak">
          <span class="toggle-text">Registrar pausa para almoço</span>
        </label>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="startTime">Hora de Entrada</label>
          <input 
            id="startTime" 
            v-model="startTime" 
            type="time" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="form-group" v-if="!hasLunchBreak">
          <label for="endTime">Hora de Saída</label>
          <input 
            id="endTime" 
            v-model="endTime" 
            type="time" 
            class="form-control" 
            required
          >
        </div>
      </div>
      
      <div class="form-row" v-if="hasLunchBreak">
        <div class="form-group">
          <label for="lunchStartTime">Saída para Almoço</label>
          <input 
            id="lunchStartTime" 
            v-model="lunchStartTime" 
            type="time" 
            class="form-control" 
            :required="hasLunchBreak"
          >
        </div>
        
        <div class="form-group">
          <label for="lunchEndTime">Retorno do Almoço</label>
          <input 
            id="lunchEndTime" 
            v-model="lunchEndTime" 
            type="time" 
            class="form-control" 
            :required="hasLunchBreak"
          >
        </div>
      </div>
      
      <div class="form-row" v-if="hasLunchBreak">
        <div class="form-group">
          <label for="endTime">Hora de Saída</label>
          <input 
            id="endTime" 
            v-model="endTime" 
            type="time" 
            class="form-control" 
            required
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea 
          id="description" 
          v-model="description" 
          class="form-control" 
          placeholder="Descreva as atividades realizadas"
          rows="3"
        ></textarea>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <button type="submit" class="btn">Registrar</button>
    </form>
  </div>
</template>

<style scoped>
.time-entry-form {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--color-shadow);
  margin-bottom: 20px;
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

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.toggle-container {
  margin-bottom: 15px;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-text {
  margin-left: 8px;
  color: var(--color-text);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  background-color: var(--color-surface-variant);
}

.success-message {
  color: var(--color-success);
  background-color: rgba(3, 218, 198, 0.1);
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.success-message::before {
  content: '✓';
  margin-right: 8px;
  font-weight: bold;
}

button[type="submit"] {
  width: 100%;
  margin-top: 20px;
  background-color: var(--color-accent);
  color: var(--color-background);
  font-weight: 500;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button[type="submit"]:hover {
  background-color: #a56ef2;
}
</style>