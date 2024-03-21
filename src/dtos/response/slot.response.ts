import { PartyDatedDataResponse } from './partyDated.response'

export interface SlotDataResponse {
  id: number
  timeStart: string
  timeEnd: string
  validTimeRange: boolean
  active: boolean
}
export interface SlotInVenueDataResponse {
  id: number
  active: boolean
  status: boolean
  slot: SlotDataResponse
  partyDated: PartyDatedDataResponse
}

export interface SlotInVenueArrayResponse {
  data: SlotInVenueDataResponse[] | []
}

export interface SlotNotAddArrayResponse {
  status: string
  message: string
  data: SlotDataResponse[] | []
}
