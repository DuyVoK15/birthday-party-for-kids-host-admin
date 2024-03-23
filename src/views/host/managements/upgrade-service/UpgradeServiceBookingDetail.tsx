import { Card, Flex, Image, Space, Typography } from 'antd'
import React from 'react'
import { UpgradeServiceDataResponse } from 'src/dtos/response/upgradeService.response'

const UpgradeServiceBookingDetail = ({ upgradeServices }: { upgradeServices?: UpgradeServiceDataResponse[] | [] }) => {
  let totalPriceSerivce = 0
  return (
    <Flex className='mt-5' justify='space-between' align='flex-start' gap={30}>
      <Space className='w-1/2' direction='vertical'>
        {upgradeServices?.map((item, index) => {
          totalPriceSerivce += item?.pricing
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
                  <div>
                    Giá:{' '}
                    <strong>
                      {(item?.services?.pricing * item?.count).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </strong>
                  </div>
                </div>
              </Flex>
            </Card>
          )
        })}
      </Space>
      <div className='w-1/2'>
        <React.Fragment>
          <Flex align='center' justify='space-between' gap={10}>
            <Typography className=''>Tổng cộng: </Typography>
            <Typography.Title style={{ margin: 0 }} level={4}>
              {totalPriceSerivce?.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </Typography.Title>
          </Flex>
        </React.Fragment>
      </div>
    </Flex>
  )
}

export default UpgradeServiceBookingDetail
