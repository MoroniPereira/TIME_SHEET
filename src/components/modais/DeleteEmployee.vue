<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { employeeService } from '@/services/employeeService'
import type { Employee } from '@/types/employee'
import { useToast } from 'vue-toast-notification'

type typeEmployee = Employee | null

const props = defineProps({
  user: {
    type: Object as PropType<typeEmployee>,
    required: false
  },
  showModal: {
    type: Boolean,
    required: true
  },
  handleAttEmployee: {
    type: Function,
    required: true
  },
  handleModalDeleteEmployee: {
    type: Function,
    required: true
  }
})

const toast = useToast()
const loadingDelete = ref(false)

const handleConfirm = async () => {
  if(!props.user?.id) return
  loadingDelete.value = true
  
  try {
    const retorno = await employeeService.delete(props.user.id)
    console.log('DELETE: ', retorno)
    
    props.handleAttEmployee()
    props.handleModalDeleteEmployee()
  } catch(error) {
    toast.error('Ops, algo deu errado. Atualize a página e tente novamente!')
  } finally {
    loadingDelete.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="warning-icon">⚠️</div>
        <h3 class="modal-title">Confirmar Exclusão</h3>
      </div>
      
      <div class="modal-body">
        <p class="confirmation-text">
          Tem certeza que deseja excluir o funcionário 
          <strong>{{ props.user?.fullName }}</strong>?
        </p>

        <p>O usuário ficará desabilitado por 6 meses antes de ser deletado.</p>
      </div>
      
      <div class="modal-actions">
        <button 
          @click="props.handleModalDeleteEmployee()" 
          class="btn btn-secondary"
          :disabled="loadingDelete"
        >
          Cancelar
        </button>
        <button 
          @click="handleConfirm" 
          class="btn btn-danger"
          :disabled="loadingDelete"
        >
          <span v-if="loadingDelete" class="loading-spinner"></span>
          {{ loadingDelete ? 'Excluindo...' : 'Excluir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.modal-body {
  padding: 1.5rem 2rem;
  text-align: center;
}

.confirmation-text {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.confirmation-text strong {
  color: #ffffff;
  font-weight: 600;
}

.modal-actions {
  padding: 1.5rem 2rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.btn-danger {
  background: linear-gradient(45deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(45deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
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

/* Responsividade */
@media (max-width: 480px) {
  .modal-content {
    margin: 1rem;
    max-width: none;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .warning-icon {
    font-size: 2.5rem;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
  
  .confirmation-text {
    font-size: 1rem;
  }
}
</style>