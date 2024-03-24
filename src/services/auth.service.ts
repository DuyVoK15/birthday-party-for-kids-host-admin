import { AxiosResponse } from 'axios'
import { LoginDto } from 'src/utils/fakeDto'
import axiosClient from './axiosClient/axiosClient'
import { LoginResponse, UserInfoResponse } from 'src/dtos/response/auth.response'
import { LoginRequest, Register } from 'src/dtos/request/auth.request'

export const authService = {
  loginHost: (payload: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    const url = '/api/account/host/authenticate'
    return axiosClient.post(url, { ...payload })
  },
  loginAdmin: (payload: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    const url = '/api/account/admin/authenticate'
    return axiosClient.post(url, { ...payload })
  },
  getUserInfo: (): Promise<AxiosResponse<UserInfoResponse>> => {
    const url = '/api/account/information'
    return axiosClient.get(url)
  },
  getAllUser: (): Promise<AxiosResponse<any>> => {
    const url = '/api/account/get-all'
    return axiosClient.get(url)
  },
  registerAccountForHost: (payload: Register): Promise<AxiosResponse<LoginResponse>> => {
    const url = '/account/admin/register'
    return axiosClient.post(url, { ...payload })
  },
}
