import { SlotOnjectResponse } from "./slot.response";

export interface PartyDateObjectResponse {
    id: number
    date: string
    active: boolean
    slotObject: SlotOnjectResponse;
  }