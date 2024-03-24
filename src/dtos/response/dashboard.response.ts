import { UserInfoResponse } from './auth.response'

export interface ListDataResponse {
  name: string
  quantity: number
}

export interface DashBoardDataResponse {
  totalRevenue: number
  totalBooking: number
  themeList: ListDataResponse[] | []
  serviceList: ListDataResponse[] | []
  venueList: ListDataResponse[] | []
  apackageList: ListDataResponse[] | []
  customerList: UserInfoResponse[] | []
  averageValueOfOrders: number
  averageRate: number
  partyCancellationRate: number
}

export interface DashBoardObjectResponse {
  status: string
  message: string
  data: DashBoardDataResponse
}
