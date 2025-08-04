<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import { employeeService } from '@/services/employeeService'
import type { Employee } from '@/types/employee'
import { ref, onMounted, reactive, type PropType } from 'vue'
import type { errorAxios } from '@/types/error'

const props = defineProps({
  employee: {
    type: Object as PropType<Employee>,
    required: true
  },
  showEditModal: {
    type: Boolean,
    required: true
  },
  handleModalEditEmployee: {
    type: Function,
    required: true
  },
  handleAttEmployee: {
    type: Function,
    required: true
  }
})

const toast = useToast()
const messageError = ref('')
const loadingUpdate = ref<boolean>(false)

const state = reactive({
  id: 0,
  fullName: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  status: true,
})


const saveEmployee = async () => {
  loadingUpdate.value = true
  messageError.value = ''

  try {
    await employeeService.update(state)
    props.handleAttEmployee()
    props.handleModalEditEmployee()
  } catch (error) {
    const err = error as errorAxios
    if (err.status === 409) {
      return messageError.value = err.response.data.message
    }
    toast.error('Ops, algo deu errado. Atualize a página e tente novamente!')
  } finally {
    loadingUpdate.value = false
  }
}

onMounted(() => {
  state.id = props.employee.id,
  state.fullName = props.employee.fullName,
  state.department = props.employee.department,
  state.position = props.employee.position,
  state.email = props.employee.email,
  state.phone = props.employee.phone,
  state.status = props.employee.status == 1 ? true : false
})
</script>

<template>
  <div v-if="props.showEditModal" class="modal-overlay">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Editar Funcionário</h2>
        <button @click="props.handleModalEditEmployee()" class="close-btn">✕</button>
      </div>
      
      <form @submit.prevent="saveEmployee" class="employee-form">
        <div class="form-group">
          <label for="edit-name">Nome *</label>
          <input 
            id="edit-name"
            v-model="state.fullName" 
            type="text" 
            placeholder="Digite o nome completo"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="edit-department">Departamento *</label>
          <input 
            id="edit-department"
            v-model="state.department" 
            type="text" 
            placeholder="Ex: Tecnologia da Informação"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="edit-position">Cargo *</label>
          <input 
            id="edit-position"
            v-model="state.position" 
            type="text" 
            placeholder="Ex: Desenvolvedor Senior"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="edit-email">Email * <p class="errorMessage" v-show="messageError">E-mail já registrado.</p></label>
          <input 
            id="edit-email"
            v-model="state.email" 
            type="email" 
            placeholder="exemplo@empresa.com"
            required
            :class="{ 'error-input': messageError }"
          >
        </div>
        
        <div class="form-group">
          <label for="edit-phone">Telefone *</label>
          <input 
            id="edit-phone"
            v-model="state.phone" 
            type="tel" 
            placeholder="(11) 99999-9999"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="edit-status">Status</label>
          <select 
            id="edit-status"
            v-model="state.status"
            class="status-select"
          >
            <option :value="true">Ativo</option>
            <option :value="false">Inativo</option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="props.handleModalEditEmployee()" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ loadingUpdate ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

/* Formulário */
.employee-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4facfe;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.form-group input::placeholder {
  color: #b0b0b0;
}

.status-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #4facfe;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.status-select option {
  background: #1e1e1e;
  color: #ffffff;
  padding: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.9rem;
  min-width: 120px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .employee-form {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .form-actions .btn {
    width: 100%;
    min-width: unset;
  }
}
</style>