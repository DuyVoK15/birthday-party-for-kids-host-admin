import { Card, Image, Typography } from 'antd'
import React from 'react'
import { ThemeDataResponse, ThemeInVenueDataResponse } from 'src/dtos/response/theme.response'
const { Meta } = Card

const ThemeDetail = ({ themeInVenue }: { themeInVenue?: ThemeDataResponse }) => {
  return (
    <>
      <Image alt='example' src={themeInVenue?.themeImgUrl} width={'100%'} height={350} style={{ objectFit: 'cover' }} />
      <Typography.Title level={3}>{themeInVenue?.themeName}</Typography.Title>
      <Typography.Title level={5}>{themeInVenue?.themeDescription}</Typography.Title>

    </>
  )
}

export default ThemeDetail
