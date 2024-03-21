export interface ThemeCreateRequest {
  fileImage: any
  themeName: string
  themeDescription: string
}

export interface ItemInVenueListCreateRequest {
  venueId: number
  payload: number[] | []
}
