export interface ThemeInVenueDataResponse {
  id: number
  active: boolean
  themeObject: ThemeDataResponse
}

export interface ThemeDataResponse {
  id: number
  themeName: string
  themeDescription: string
  themeImgUrl: string
  active: boolean
}
