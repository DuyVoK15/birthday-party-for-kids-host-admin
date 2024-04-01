import { Avatar, Card, Flex, Image, Space, Typography } from 'antd'
import React from 'react'
import { PackageDataResponse } from 'src/dtos/response/package.response'

const PackageDetail = ({ packageInVenue }: { packageInVenue?: PackageDataResponse }) => {
  return (
    <div className='mt-5'>
      <Flex align='start' gap={20}>
        <Image
          alt={packageInVenue?.packageName}
          src={packageInVenue?.packageImgUrl}
          width={180}
          height={130}
          style={{ borderRadius: 10, objectFit: 'cover' }}
        />
        <Space direction='vertical' size={'middle'}>
          <Typography.Title style={{ margin: 0 }} level={4}>
            {packageInVenue?.packageName}
          </Typography.Title>
          <Typography>{packageInVenue?.packageDescription}</Typography>
          <Flex align='center' gap={5}>
            <Typography>{`Giá gói:`}</Typography>
            <Typography className='font-semibold'>
              {` ${packageInVenue?.pricing.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
            </Typography>
          </Flex>

          <Typography.Title style={{ margin: 0 }} level={4}>
            Chi tiết gói dịch vụ
          </Typography.Title>

          <Flex justify='space-between' align='flex-start'>
            <Space direction='vertical'>
              {packageInVenue?.packageServiceList?.map((item, index) => {
                return (
                  <Card key={index} bodyStyle={{ padding: 15 }}>
                    <Flex gap={20}>
                      <Image width={75} height={75} style={{ borderRadius: 5 }} src={item?.services?.serviceImgUrl} />
                      <div>
                        <div>
                          Tên dịch vụ: <strong>{item?.services?.serviceName}</strong>
                        </div>
                        <div>
                          Số lượng: <strong>{item?.count}</strong>
                        </div>
                      </div>
                    </Flex>
                  </Card>
                )
              })}
            </Space>
            <div></div>
          </Flex>
        </Space>
      </Flex>
    </div>
  )
}

export default PackageDetail
