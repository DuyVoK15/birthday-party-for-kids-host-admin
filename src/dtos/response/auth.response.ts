export interface LoginResponse {
  status: string
  message: string
  data: {
    token: string
    role: {
      id: number
      name: string
      active: boolean
    }
  }
}

export interface UserInfoResponse {
  status: string
  message: string
  data: {
    id: number
    username: string
    password: string
    fullName: string
    email: string
    phone: string
    avatarUrl: string
    authorities: [
      {
        authority: string
      }
    ]
    enabled: boolean
    accountNonExpired: boolean
    accountNonLocked: boolean
    credentialsNonExpired: boolean
    active: boolean
  }
}

export interface AccountDataResponse {
  id: number
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  avatarUrl: string
  authorities: [
    {
      authority: string
    }
  ]
  enabled: boolean
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  active: boolean
}

export interface AccountObjectResponse {
  status: string
  message: string
  data: AccountDataResponse
}
