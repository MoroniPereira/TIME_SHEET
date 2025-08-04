<script setup lang="ts">
import type { listEmployee, Employee } from '@/types/employee'
import { employeeService } from '@/services/employeeService'
import { useToast } from 'vue-toast-notification'
import { onBeforeMount, ref } from 'vue'
import NewEmployee from '@/components/modais/NewEmployee.vue'
import EditEmployee from '@/components/modais/EditEmployee.vue'
import DeleteEmployee from '@/components/modais/DeleteEmployee.vue'


const toast = useToast()
const dataEmployee = ref<listEmployee>([])

const employeeToDelete = ref<Employee | null>(null)
const employeeToUpdate = ref<Employee | null>(null)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const loadingEmployee = ref(true)


const handleModalNewEmployee = () => {
  showCreateModal.value = !showCreateModal.value
}

const handleModalEditEmployee = () => {
  showEditModal.value = !showEditModal.value
  if (!showEditModal.value) employeeToUpdate.value = null
}

const handleModalDeleteEmployee = () => {
  showDeleteModal.value = !showDeleteModal.value
  if(showDeleteModal.value) employeeToDelete.value = null
}

const editEmployee = (employeeId: number) => {
  const employee = dataEmployee.value.find(emp => emp.id === employeeId)
  if (employee) {
    employeeToUpdate.value = { ...employee }
    showEditModal.value = true
  }
}

const handleDeleteEmployee = (employeeId: number) => {
  const employee = dataEmployee.value.find(emp => emp.id === employeeId)
  if (employee) {
    employeeToDelete.value = employee
    showDeleteModal.value = true
  }
}

const getEmployees = async () => {
  try {
    dataEmployee.value = await employeeService.getAll()
  } catch (error) {
    toast.success('Ops, algo deu errado. Atualize a página e tente novamente!')
  } finally {
    loadingEmployee.value = false
  }
}

onBeforeMount(() => { getEmployees() })
</script>

<template>
  <NewEmployee 
    :showCreateModal="showCreateModal" 
    :handleModalNewEmployee="handleModalNewEmployee"
    :handleAttEmployee="getEmployees"
  />
  <EditEmployee
    v-if="employeeToUpdate"
    :employee="employeeToUpdate" 
    :showEditModal="showEditModal" 
    :handleModalEditEmployee="handleModalEditEmployee"
    :handleAttEmployee="getEmployees"
  />
  <DeleteEmployee
    :user="employeeToDelete"
    :handleAttEmployee="getEmployees"
    :showModal="showDeleteModal"
    :handleModalDeleteEmployee="handleModalDeleteEmployee"
  />

  <main class="employee-main">
    <div class="header-employee">
      <h1 class="page-title">Gerenciamento de Funcionários</h1>
      <button @click="handleModalNewEmployee" class="btn btn-primary">
        <span class="btn-icon">👤</span>
        <span>Novo Funcionário</span>
      </button>
    </div>
    
    <!-- Estatísticas -->    
    <div class="stats-section">
      <div class="stat-card">
        <h3 class="stat-title">Total de Funcionários</h3>
        <div class="stat-value">{{ dataEmployee.length }}</div>
      </div>
      <div class="stat-card">
        <h3 class="stat-title">Funcionários Ativos</h3>
        <div class="stat-value active">{{ dataEmployee.filter(emp => emp.status == 1).length }}</div>
      </div>
      <div class="stat-card">
        <h3 class="stat-title">Funcionários Inativos</h3>
        <div class="stat-value inactive">{{ dataEmployee.filter(emp => emp.status == 0).length }}</div>
      </div>
    </div>

    <!-- Cabeçalho da Lista -->    
    <div class="list-header">
      <h2 class="section-title">Lista de Funcionários</h2>
    </div>

    <!-- Tabela de Funcionários -->
    <div class="employee-table-container">
      <div class="table-wrapper">
        <table class="employee-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in dataEmployee" :key="employee.id" class="employee-row">
              <td class="employee-name">
                <div class="name-container">
                  <div class="avatar">{{ employee.fullName.charAt(0).toUpperCase() }}</div>
                  <span>{{ employee.fullName }}</span>
                </div>
              </td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department }}</td>
              <td class="email-cell">{{ employee.email }}</td>
              <td>{{ employee.phone }}</td>
              <td>
                <span class="status-badge" 
                  :class="employee.status == 1 ? 'status-active' : 'status-inactive'"
                >
                  {{ employee.status == 1 ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="editEmployee(employee.id)" 
                    class="action-btn edit-btn"
                    title="Editar funcionário"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="handleDeleteEmployee(employee.id)" 
                    class="action-btn delete-btn"
                    title="Excluir funcionário"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="dataEmployee.length === 0" class="no-employees">
        <p>Nenhum funcionário cadastrado</p>
        <button @click="handleModalNewEmployee" class="btn btn-secondary">
          Cadastrar Primeiro Funcionário
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.employee-main {
  padding: 2rem;
  color: #ffffff;
}

.header-employee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
}

/* Seção de Estatísticas */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.stat-title {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #4facfe;
}

.stat-value.active {
  color: #00ff88;
}

.stat-value.inactive {
  color: #ff6b6b;
}

/* Cabeçalho da Lista */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
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
}

.btn-primary {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Tabela de Funcionários */
.employee-table-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.employee-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  font-size: 0.9rem;
}

.employee-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Nome do Funcionário */
.employee-name .name-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

/* Email */
.email-cell {
  color: #4facfe;
  font-family: monospace;
}

/* Status Badge */
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.status-active {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-inactive {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.status-badge:hover {
  transform: scale(1.05);
}

/* Botões de Ação */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(79, 172, 254, 0.2);
  border: 1px solid rgba(79, 172, 254, 0.3);
}

.edit-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  transform: scale(1.1);
}

.delete-btn {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: scale(1.1);
}

/* Estado Vazio */
.no-employees {
  text-align: center;
  padding: 3rem;
  color: #b0b0b0;
}

.no-employees p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}


/* Responsividade */
@media (max-width: 768px) {
  .employee-main {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .employee-table th,
  .employee-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .avatar {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .action-btn {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .employee-table th:nth-child(3),
  .employee-table td:nth-child(3),
  .employee-table th:nth-child(5),
  .employee-table td:nth-child(5),
  .employee-table th:nth-child(6),
  .employee-table td:nth-child(6) {
    display: none;
  }
  
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
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>
