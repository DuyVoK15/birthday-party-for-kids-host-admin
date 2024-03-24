import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { DashBoardObjectResponse } from 'src/dtos/response/dashboard.response'

export const dashboardService = {
  getDashboard: (): Promise<AxiosResponse<DashBoardObjectResponse>> => {
    const url = `/api/dashboard/get`
    return axiosClient.get(url)
  }
}
