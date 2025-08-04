import { helpers } from '@vuelidate/validators'

// Validador personalizado para email
export const email = helpers.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

// Validador personalizado para senha forte
export const strongPassword = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

// Validador para CPF (formato brasileiro)
export const cpf = helpers.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)

// Validador para telefone brasileiro
export const phone = helpers.regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)

// Validador para nome completo (pelo menos 2 palavras)
export const fullName = (value: string) => {
  if (!value) return false
  const words = value.trim().split(' ').filter(word => word.length > 0)
  return words.length >= 2 && words.every(word => word.length >= 2)
}

// Validador para confirmar senha
export const sameAsPassword = (password: string) => (value: string) => {
  return value === password
}

// Validador para data não futura
export const notFutureDate = (value: string) => {
  if (!value) return true
  const inputDate = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return inputDate <= today
}

// Validador para horário de trabalho (formato HH:MM)
export const timeFormat = helpers.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)

// Validador para range de horas (início deve ser menor que fim)
export const validTimeRange = (startTime: string) => (endTime: string) => {
  if (!startTime || !endTime) return true
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)
  return start < end
}

// Mensagens de erro personalizadas
export const errorMessages = {
  required: 'Este campo é obrigatório',
  email: 'Digite um email válido',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  strongPassword: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo',
  cpf: 'Digite um CPF válido (000.000.000-00)',
  phone: 'Digite um telefone válido',
  fullName: 'Digite o nome completo (pelo menos 2 palavras)',
  sameAsPassword: 'As senhas não coincidem',
  notFutureDate: 'A data não pode ser futura',
  timeFormat: 'Digite um horário válido (HH:MM)',
  validTimeRange: 'O horário de início deve ser anterior ao de fim'
}