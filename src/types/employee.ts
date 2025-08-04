// Interface para Employee
export interface Employee {
  id: number,
  fullName: string,
  phone: string,
  email: string,
  department: string,
  position: string,
  type: "master" | "default",
  status: 0 | 1,
  createdAt: string,
  updatedAt: string
}

// Interface para de listagem de funcionários
export type listEmployee = Employee[]

// Interface para criação de funcionário (sem ID)
export interface CreateEmployeeData {
  fullName: string,
  phone: string,
  email: string,
  department: string,
  position: string,
}

// Interface para atualização de funcionário
export interface UpdateEmployeeData {
  id: number
  fullName: string,
  department: string,
  position: string,
  email: string,
  phone: string,
  status: boolean,
}