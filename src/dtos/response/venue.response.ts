export interface SlotOnjectResponse {
  id: number;
  timeStart: string;
  timeEnd: string;
  validTimeRange: boolean;
  active: boolean;
}
export interface SlotInVenueResponse {
  [x: string]: any;
  id: number;
  active: boolean;
  status: boolean;
  slotObject: SlotOnjectResponse;
}
export interface VenueResponse {
  id: number;
  venueName: string;
  venueDescription: string;
  venueImgUrl: string;
  location: string;
  capacity: number;
  slotInVenueList: SlotInVenueResponse[] | [];
  active: boolean;
}
export interface VenueCheckSlotByDateResponse {
  status: string;
  message: string;
  data: VenueResponse[] | [];
}
