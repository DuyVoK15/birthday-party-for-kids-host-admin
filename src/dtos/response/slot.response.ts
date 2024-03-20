import { PartyDateObjectResponse } from './partyDated.response'

export interface SlotOnjectResponse {
  id: number
  timeStart: string
  timeEnd: string
  validTimeRange: boolean
  active: boolean
}
export interface SlotInVenueResponse {
  id: number
  active: boolean
  status: boolean
  slot: SlotOnjectResponse
  partyDated: PartyDateObjectResponse
}
export interface SlotNotAddResponse {
  status: string
  message: string
  data: SlotOnjectResponse[] | []
}
