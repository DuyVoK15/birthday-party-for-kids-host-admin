import { PartyDateObjectResponse } from './partyDated.response'

export interface SlotOnjectResponse {
  id: number
  timeStart: string
  timeEnd: string
  validTimeRange: boolean
  active: boolean
}
export interface SlotInVenueResponse {
  // [x: string]: any
  id: number
  active: boolean
  status: boolean
  partyDatedByDate: PartyDateObjectResponse
  slotObject: SlotOnjectResponse
}
export interface SlotNotAddResponse {
  status: string
  message: string
  data: SlotOnjectResponse[] | []
}
