<template>
  <div class="employee-form">
    <h3>{{ isEditing ? 'Editar Funcionário' : 'Novo Funcionário' }}</h3>
    
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Nome Completo -->
      <div class="form-group">
        <label for="fullName">Nome Completo *</label>
        <input
          id="fullName"
          v-model="formData.fullName"
          type="text"
          class="form-control"
          :class="{ 'error': v$.fullName.$error }"
          placeholder="Digite o nome completo"
        >
        <div v-if="v$.fullName.$error" class="field-error">
          {{ getFieldError('fullName') }}
        </div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-control"
          :class="{ 'error': v$.email.$error }"
          placeholder="Digite o email"
        >
        <div v-if="v$.email.$error" class="field-error">
          {{ getFieldError('email') }}
        </div>
      </div>

      <!-- CPF -->
      <div class="form-group">
        <label for="cpf">CPF *</label>
        <input
          id="cpf"
          v-model="formData.cpf"
          type="text"
          class="form-control"
          :class="{ 'error': v$.cpf.$error }"
          placeholder="000.000.000-00"
          @input="formatCPF"
        >
        <div v-if="v$.cpf.$error" class="field-error">
          {{ getFieldError('cpf') }}
        </div>
      </div>

      <!-- Telefone -->
      <div class="form-group">
        <label for="phone">Telefone *</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="form-control"
          :class="{ 'error': v$.phone.$error }"
          placeholder="(11) 99999-9999"
          @input="formatPhone"
        >
        <div v-if="v$.phone.$error" class="field-error">
          {{ getFieldError('phone') }}
        </div>
      </div>

      <!-- Departamento -->
      <div class="form-group">
        <label for="department">Departamento *</label>
        <select
          id="department"
          v-model="formData.department"
          class="form-control"
          :class="{ 'error': v$.department.$error }"
        >
          <option value="">Selecione um departamento</option>
          <option value="TI">Tecnologia da Informação</option>
          <option value="RH">Recursos Humanos</option>
          <option value="Financeiro">Financeiro</option>
          <option value="Vendas">Vendas</option>
          <option value="Marketing">Marketing</option>
        </select>
        <div v-if="v$.department.$error" class="field-error">
          {{ getFieldError('department') }}
        </div>
      </div>

      <!-- Cargo -->
      <div class="form-group">
        <label for="position">Cargo *</label>
        <input
          id="position"
          v-model="formData.position"
          type="text"
          class="form-control"
          :class="{ 'error': v$.position.$error }"
          placeholder="Digite o cargo"
        >
        <div v-if="v$.position.$error" class="field-error">
          {{ getFieldError('position') }}
        </div>
      </div>

      <!-- Data de Admissão -->
      <div class="form-group">
        <label for="hireDate">Data de Admissão *</label>
        <input
          id="hireDate"
          v-model="formData.hireDate"
          type="date"
          class="form-control"
          :class="{ 'error': v$.hireDate.$error }"
        >
        <div v-if="v$.hireDate.$error" class="field-error">
          {{ getFieldError('hireDate') }}
        </div>
      </div>

      <!-- Salário -->
      <div class="form-group">
        <label for="salary">Salário *</label>
        <input
          id="salary"
          v-model="formData.salary"
          type="number"
          step="0.01"
          min="0"
          class="form-control"
          :class="{ 'error': v$.salary.$error }"
          placeholder="0,00"
        >
        <div v-if="v$.salary.$error" class="field-error">
          {{ getFieldError('salary') }}
        </div>
      </div>

      <!-- Botões -->
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancelar
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useValidation, commonRules } from '@/composables/useValidation'
import { required, minValue } from '@vuelidate/validators'

interface Props {
  employee?: any
  isLoading?: boolean
}

interface Emits {
  submit: [data: any]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<Emits>()

const isEditing = computed(() => !!props.employee)

// Dados do formulário
const formData = ref({
  fullName: '',
  email: '',
  cpf: '',
  phone: '',
  department: '',
  position: '',
  hireDate: '',
  salary: 0
})

// Regras de validação
const rules = {
  fullName: commonRules.fullName,
  email: commonRules.email,
  cpf: commonRules.cpf,
  phone: commonRules.phone,
  department: commonRules.required,
  position: commonRules.text(2, 50),
  hireDate: commonRules.date,
  salary: {
    required,
    minValue: minValue(0.01)
  }
}

// Configuração de validação
const { v$, isFormValid, validateForm, getFieldError, resetValidation } = useValidation(rules, formData)

// Watchers para preencher dados quando editando
watch(() => props.employee, (newEmployee) => {
  if (newEmployee) {
    formData.value = { ...newEmployee }
  } else {
    // Reset form when creating new employee
    formData.value = {
      fullName: '',
      email: '',
      cpf: '',
      phone: '',
      department: '',
      position: '',
      hireDate: '',
      salary: 0
    }
    resetValidation()
  }
}, { immediate: true })

// Formatação de CPF
const formatCPF = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    formData.value.cpf = value
  }
}

// Formatação de telefone
const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    formData.value.phone = value
  }
}

// Submit do formulário
const handleSubmit = async () => {
  const isValid = await validateForm()
  if (isValid) {
    emit('submit', { ...formData.value })
  }
}
</script>

<style scoped>
.employee-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.employee-form h3 {
  margin: 0 0 24px 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-control {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-control.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.field-error {
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .employee-form {
    margin: 16px;
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>