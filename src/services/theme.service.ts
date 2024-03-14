import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { ThemeCreateRequest } from 'src/dtos/request/theme.request'

export const themeService = {
  getAllTheme: (): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/get-all`
    return axiosClient.get(url)
  },
  getThemeById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/get-id/${id}`
    return axiosClient.get(url)
  },
  createTheme: (payload: ThemeCreateRequest): Promise<AxiosResponse<any>> => {
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('themeName', payload.themeName)
    formData.append('themDescription', payload.themeDescription)

    const url = `/api/theme/create-theme`
    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updateTheme: (request: { id: number; payload: ThemeCreateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/update-theme/${request.id}`
    const formData = new FormData()
    formData.append('fileImg', request.payload.fileImage)
    formData.append('themeName', request.payload.themeName)
    formData.append('themDescription', request.payload.themeDescription)

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deleteTheme: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/theme/delete/${id}`
    return axiosClient.delete(url)
  }
}
