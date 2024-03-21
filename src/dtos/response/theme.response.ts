export interface ThemeDataResponse {
  id: number
  themeName: string
  themeDescription: string
  themeImgUrl: string
  active: boolean
}

export interface ThemeInVenueDataResponse {
  id: number
  active: boolean
  theme: ThemeDataResponse
}

export interface ThemeInVenueArrayResponse {
  data: ThemeInVenueDataResponse[] | []
}

export interface ThemeInVenueObjectResponse {
  data: ThemeInVenueDataResponse
}

export interface ThemeNotAddArrayResponse {
  data: ThemeDataResponse[] | []
}
