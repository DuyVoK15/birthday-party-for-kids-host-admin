export interface ThemeInVenueDataResponse {
  id: number
  active: boolean
  theme: ThemeDataResponse
}

export interface ThemeDataResponse {
  id: number
  themeName: string
  themeDescription: string
  themeImgUrl: string
  active: boolean
}
