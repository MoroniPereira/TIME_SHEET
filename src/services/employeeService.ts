import { apiService } from './api'
import type { listEmployee, Employee, CreateEmployeeData, UpdateEmployeeData } from '@/types/employee'

export const employeeService = {
  // Listar todos os funcionários
  getAll: async (): Promise<listEmployee> => {
    try {
      const response = await apiService.get<listEmployee>('/employee')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Criar novo funcionário
  create: async (employeeData: CreateEmployeeData): Promise<Employee> => {
    try {
      const response = await apiService.post<Employee>('/employee', employeeData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Atualizar funcionário
  update: async (employee: UpdateEmployeeData): Promise<Employee> => {
    const { id, ...newObjectEmployee } = employee

    try {
      const response = await apiService.put<Employee>(`/employee/${id}`, newObjectEmployee)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Desabilita funcionário - Só é possível deletar pelo banco.
  delete: async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/employee/${id}`)
    } catch (error) {
      throw error
    }
  },

  // Ativar/Desativar funcionário
  toggleStatus: async (id: number, active: boolean): Promise<Employee> => {
    try {
      const response = await apiService.patch<Employee>(`/employees/${id}/status`, { active })
      return response.data
    } catch (error) {
      console.error(`Erro ao alterar status do funcionário ${id}:`, error)
      throw error
    }
  },

  // Buscar funcionários por departamento
  getByDepartment: async (department: string): Promise<Employee[]> => {
    try {
      const response = await apiService.get<listEmployee>(`/employees?department=${encodeURIComponent(department)}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar funcionários do departamento ${department}:`, error)
      throw error
    }
  },

  // Buscar funcionários ativos
  getActive: async (): Promise<Employee[]> => {
    try {
      const response = await apiService.get<listEmployee>('/employees?active=true')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar funcionários ativos:', error)
      throw error
    }
  },

  // Buscar funcionários inativos
  getInactive: async (): Promise<Employee[]> => {
    try {
      const response = await apiService.get<listEmployee>('/employees?active=false')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar funcionários inativos:', error)
      throw error
    }
  }
}