export interface LoginCredentials {
  email: string
  password: string
}

// Interface para dados do usuário
export interface User {
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

// Interface para resposta de login
export interface LoginResponse {
  user: User,
  token: string,
}