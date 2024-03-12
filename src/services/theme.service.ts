import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const themeService = {
  getAllTheme: (): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/get-all`
    return axiosClient.get(url)
  },
  getThemeById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/get-id/${id}`
    return axiosClient.get(url)
  },
  createTheme: (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/create`
    return axiosClient.post(url, { ...payload })
  },
  updateTheme: (request: { id: number; payload: any }): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/update/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  },
  deleteTheme: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/delete/${id}`
    return axiosClient.delete(url)
  }
}
