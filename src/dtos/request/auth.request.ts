export interface LoginRequest {
  username: string
  password: string
}

export interface Register {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  dob?: string
}
