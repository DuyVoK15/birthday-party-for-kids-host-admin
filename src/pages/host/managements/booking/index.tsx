import React, { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  DatePicker,
  Descriptions,
  DescriptionsProps,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  MenuProps,
  Popconfirm,
  Radio,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  message
} from 'antd'
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  SwapOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  DrawerForm,
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { useAppDispatch } from 'src/app/store'
import { createService, deleteService, getAllService, updateService } from 'src/features/action/service.action'
import { useAppSelector } from 'src/app/hooks'
import { ServiceCreateRequest } from 'src/dtos/request/service.request'
import { SERVICE_ENUM } from 'src/enums/service'
import { ServiceDataResponse } from 'src/dtos/response/service.response'
import { PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'
import { getAllBooking, getBookingById } from 'src/features/action/partyBooking.action'
import dayjs from 'dayjs'
import { PARTY_BOOKING_STATUS } from 'src/enums/partyBooking'
import { HomeCircle } from 'mdi-material-ui'
import UpgradeServiceBookingDetail from 'src/views/host/managements/upgrade-service/UpgradeServiceBookingDetail'
import PackageDetail from 'src/views/host/managements/package/PackageDetail'

interface Item extends PartyBookingDataResponse {
  key: string
}

const Booking: React.FC = () => {
  const [form] = Form.useForm()
  const [formModal] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')
  const [date, setDate] = useState<string | null>(null)
  const [status, setStatus] = useState<PARTY_BOOKING_STATUS | null>(null)
  const [drawerBookingVisit, setDrawerBookingVisit] = useState(false)

  const createOne = async (payload: ServiceCreateRequest) => {
    try {
      const isCloseModal = await createOneService(payload)
      return isCloseModal
    } catch (errInfo) {
      console.log('Error', errInfo)
      message.error(errInfo)
    }
  }

  const removeOne = async (id: number) => {
    try {
      await deleteOneService(id)
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns: any = [
    {
      title: 'No.',
      dataIndex: 'key',
      width: '3%',
      editable: false,
      align: 'center'
    },
    {
      title: 'Reservationist',
      dataIndex: 'reservationAgent',
      width: '15%',
      editable: false
    },
    {
      title: 'Party date',
      dataIndex: 'date',
      width: '10%',
      editable: false
    },
    {
      title: 'Room & Slot',
      dataIndex: '',
      width: '15%',
      editable: false,
      render: (_: any, record: Item) => {
        return (
          <React.Fragment>
            <div>{`Room: PartyRoom 1`}</div>
            <div>{`Slot: ${record?.slotInRoom?.slot?.timeStart} - ${record?.slotInRoom?.slot?.timeEnd}`}</div>
          </React.Fragment>
        )
      }
    },
    {
      title: 'Reserve date',
      dataIndex: 'createAt',
      width: '10%',
      editable: false,
      render: (_: any, record: Item) => dayjs(record?.createAt).format('YYYY-MM-DD')
    },

    {
      title: 'Status',
      dataIndex: 'date',
      width: '10%',
      editable: false,
      render: (_: any, record: Item) => {
        switch (record?.status) {
          case PARTY_BOOKING_STATUS.CONFIRMED:
            return <Tag color='warning'>Confirmed</Tag>
          case PARTY_BOOKING_STATUS.CANCELLED:
            return <Tag color='error'>Cancelled</Tag>
          case PARTY_BOOKING_STATUS.COMPLETED:
            return <Tag color='success'>Completed</Tag>
          default:
            return <Tag color='processing'>Pending</Tag>
        }
      }
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      width: '10%',
      editable: true
    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      width: '10%',
      editable: true
    },
    {
      title: 'Remaining',
      dataIndex: 'remainingMoney',
      width: '10%',
      editable: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const items: MenuProps['items'] = [
          {
            label: 'View detail',
            key: '1',
            icon: <HomeCircle />,
            onClick: () => handleOpenBookingDetail(record)
          }
        ]
        const menuProps = {
          items
        }
        return (
          <Dropdown menu={menuProps} trigger={['click']}>
            <Button icon={<MoreOutlined />}></Button>
          </Dropdown>
        )
      }
    }
  ]

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.partyBookingReducer.loading)
  const bookingList = useAppSelector(state => state.partyBookingReducer.bookingList)
  const booking = useAppSelector(state => state.partyBookingReducer.bookingById)
  const bookingListView: Item[] = []

  const fetchAllBooking = async () => {
    const res = await dispatch(getAllBooking({ filter: { status, date } }))
    console.log(JSON.stringify(res, null, 2))
    return res
  }

  const refreshAllService = async () => {
    setDate(null)
    setStatus(null)
  }

  useEffect(() => {
    fetchAllBooking()
  }, [status, date])

  useEffect(() => {
    bookingList?.map((item: PartyBookingDataResponse, index: number) => {
      bookingListView.push({
        key: (index + 1).toString(),
        ...item
      })
    })
    setData(bookingListView)
  }, [bookingList])

  const fetchBookingById = async (id: number) => {
    const res = await dispatch(getBookingById(id))
    console.log(JSON.stringify(res, null, 2))
    return res
  }

  const handleOpenBookingDetail = async (record: Item) => {
    const res = await fetchBookingById(record?.id)
    if (res?.meta?.requestStatus === 'fulfilled') {
      setDrawerBookingVisit(true)
    } else {
      const message = (res?.payload as any)?.message
      message.error(message)
    }
  }

  const createOneService = async (payload: ServiceCreateRequest) => {
    let isCloseModal = false
    await dispatch(createService(payload)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllBooking().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Create service success!')
            form.resetFields()
            isCloseModal = true
          }
        })
      } else {
        message.error(`Error when create service! ${res.payload?.message ?? ''}`)
      }
    })
    return isCloseModal
  }

  const deleteOneService = async (id: number) => {
    await dispatch(deleteService(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllBooking().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Delete service success!')
          }
        })
      }
    })
  }

  const updateOneService = async (request: { id: number; payload: ServiceCreateRequest }) => {
    await dispatch(updateService({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllBooking()
      }
    })
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Venue',
      children: (
        <Space>
          <Typography>{booking?.venueObject?.venueName || 'venue name'}</Typography>
          <Tooltip title={'Location'}>
            <a>{booking?.venueObject?.district || 'location'}</a>
          </Tooltip>
        </Space>
      )
    },
    {
      key: '2',
      label: 'Package Decoration',
      children: (
        <Space direction='vertical'>
          <ModalForm
            title='Package'
            trigger={
              <Button type='primary'>
                <EyeOutlined />
                View package
              </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run')
            }}
            onFinish={async values => {
              return true
            }}
          >
            <PackageDetail packageInVenue={booking?.packageInBookings?.[0].apackage} />
          </ModalForm>

          {booking?.status === PARTY_BOOKING_STATUS.PENDING && booking?.isPayment === false && (
            <ModalForm
              title='Package'
              trigger={
                <Button type='default'>
                  <SwapOutlined />
                  Change package
                </Button>
              }
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run')
              }}
              onFinish={async values => {
                let result: boolean | undefined = false
                // if (typeof booking?.id !== 'undefined') {
                //   result = await updateOnePackageInVenueInBooking({
                //     bookingId: booking?.id,
                //     packageInVenueId: values?.packageInVenueId
                //   })
                // }

                return result
              }}
            >
              {/* {packageInVenueNotChooseList?.length > 0 ? (
                  <ProFormRadio.Group
                    name='packageInVenueId'
                    layout='horizontal'
                    style={{ marginBottom: 10 }}
                    options={packageInVenueNotChooseList?.map((item, index) => ({
                      label: (
                        <Card
                          key={index}
                          hoverable
                          style={{ width: 300, marginBottom: 10 }}
                          cover={
                            <Image
                              style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover'
                              }}
                              alt='example'
                              src={item?.apackage?.packageImgUrl}
                            />
                          }
                        >
                          <Space direction='vertical'>
                            <Card.Meta title={item?.apackage?.packageName} />
                            <ModalForm
                              title='Chi tiết gói dịch vụ'
                              trigger={
                                <Button style={{ padding: 0 }} type='link'>
                                  <EyeOutlined />
                                  Chi tiết gói dịch vụ
                                </Button>
                              }
                              style={{ padding: 0 }}
                            >
                              <PackageInVenueDetail packageInVenue={item} />
                            </ModalForm>
                          </Space>
                        </Card>
                      ),
                      value: item?.id
                    }))}
                  />
                ) : (
                  <Empty style={{ margin: 'auto' }} />
                )} */}
            </ModalForm>
          )}
        </Space>
      )
    },
    {
      key: '3',
      label: 'Package',
      children: (
        <Space direction='vertical'>
          <ModalForm
            title='Package'
            trigger={
              <Button type='primary'>
                <EyeOutlined />
                View package
              </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run')
            }}
            onFinish={async values => {
              return true
            }}
          >
            <PackageDetail packageInVenue={booking?.packageInBookings?.[1].apackage} />
          </ModalForm>

          {booking?.status === PARTY_BOOKING_STATUS.PENDING && booking?.isPayment === false && (
            <ModalForm
              title='Package'
              trigger={
                <Button type='default'>
                  <SwapOutlined />
                  Change package
                </Button>
              }
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run')
              }}
              onFinish={async values => {
                let result: boolean | undefined = false
                // if (typeof booking?.id !== 'undefined') {
                //   result = await updateOnePackageInVenueInBooking({
                //     bookingId: booking?.id,
                //     packageInVenueId: values?.packageInVenueId
                //   })
                // }

                return result
              }}
            >
              {/* {packageInVenueNotChooseList?.length > 0 ? (
                <ProFormRadio.Group
                  name='packageInVenueId'
                  layout='horizontal'
                  style={{ marginBottom: 10 }}
                  options={packageInVenueNotChooseList?.map((item, index) => ({
                    label: (
                      <Card
                        key={index}
                        hoverable
                        style={{ width: 300, marginBottom: 10 }}
                        cover={
                          <Image
                            style={{
                              width: '100%',
                              height: 100,
                              objectFit: 'cover'
                            }}
                            alt='example'
                            src={item?.apackage?.packageImgUrl}
                          />
                        }
                      >
                        <Space direction='vertical'>
                          <Card.Meta title={item?.apackage?.packageName} />
                          <ModalForm
                            title='Chi tiết gói dịch vụ'
                            trigger={
                              <Button style={{ padding: 0 }} type='link'>
                                <EyeOutlined />
                                Chi tiết gói dịch vụ
                              </Button>
                            }
                            style={{ padding: 0 }}
                          >
                            <PackageInVenueDetail packageInVenue={item} />
                          </ModalForm>
                        </Space>
                      </Card>
                    ),
                    value: item?.id
                  }))}
                />
              ) : (
                <Empty style={{ margin: 'auto' }} />
              )} */}
            </ModalForm>
          )}
        </Space>
      )
    },
    {
      key: '4',
      label: 'Order time',
      children: booking?.createAt ? dayjs(booking?.createAt).format('YYYY-MM-DD at HH:mm:ss') : 'null'
    },
    {
      key: '5',
      label: 'Usage Time',
      children: `${booking?.date} at ${booking?.slotInRoom?.slot?.timeStart}`
    },
    {
      key: '100',
      label: 'Finish Time',
      children: `${booking?.date} at ${booking?.slotInRoom?.slot?.timeEnd}`
    },
    {
      key: '6',
      label: 'Status',
      span: 1,
      children: (() => {
        switch (booking?.status) {
          case PARTY_BOOKING_STATUS.CONFIRMED:
            return (
              <Tag icon={<ExclamationCircleOutlined />} color='warning'>
                {PARTY_BOOKING_STATUS.CONFIRMED}
              </Tag>
            )
          case PARTY_BOOKING_STATUS.COMPLETED:
            return (
              <Tag icon={<CheckCircleOutlined />} color='success'>
                {PARTY_BOOKING_STATUS.COMPLETED}
              </Tag>
            )
          case PARTY_BOOKING_STATUS.CANCELLED:
            return (
              <Tag icon={<CloseCircleOutlined />} color='error'>
                {PARTY_BOOKING_STATUS.CANCELLED}
              </Tag>
            )
          default:
            return (
              <Tag icon={<SyncOutlined spin />} color='processing'>
                {PARTY_BOOKING_STATUS.PENDING}
              </Tag>
            )
        }
      })()
    },
    {
      key: '60',
      label: 'Upgrade service',
      span: 2,
      children: (
        <ModalForm
          title='Upgrade service'
          trigger={
            <Button type='primary'>
              <EyeOutlined />
              View upgrade service
            </Button>
          }
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('run')
          }}
          submitTimeout={2000}
          onFinish={async values => {
            return true
          }}
        >
          <UpgradeServiceBookingDetail upgradeServices={booking?.upgradeServices} />
        </ModalForm>
      )
    },
    {
      key: '7',
      label: 'Negotiated Amount',
      children: booking?.pricingTotal?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      key: '8',
      label: 'Discount',
      children: 0
    },
    {
      key: '9',
      label: 'Official Receipts',
      children: booking?.pricingTotal?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      key: '10',
      label: 'Booking Info',
      children: (
        <>
          Name booking: {booking?.reservationAgent}
          <br />
          Email: {booking?.email}
          <br />
          Phone: {booking?.phone}
          <br />
          Kid Name: {booking?.kidName}
          <br />
          Kid DOB: {booking?.kidDOB}
        </>
      )
    }
  ]

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <Flex justify='space-between'>
          <Flex gap={15}>
            <DatePicker
              onChange={(date: any, dateString: string) => {
                if (dateString !== '') {
                  setDate(dateString)
                } else {
                  setDate(null)
                }
              }}
            />

            <Radio.Group
              value={status}
              onChange={e => {
                setStatus(e.target.value)
              }}
              size='middle'
            >
              <Radio.Button value={null}>All</Radio.Button>
              <Radio.Button value={PARTY_BOOKING_STATUS.PENDING}>Pending</Radio.Button>
              <Radio.Button value={PARTY_BOOKING_STATUS.CONFIRMED}>Confirmed</Radio.Button>
              <Radio.Button value={PARTY_BOOKING_STATUS.COMPLETED}>Completed</Radio.Button>
              <Radio.Button value={PARTY_BOOKING_STATUS.CANCELLED}>Cancelled</Radio.Button>
            </Radio.Group>
          </Flex>
          <Flex gap={10}>
            <Button loading={loading} onClick={() => refreshAllService()}>
              Refresh
            </Button>
          </Flex>
        </Flex>
        <Table
          style={{ marginTop: 10 }}
          loading={loading}
          bordered
          dataSource={data}
          columns={columns}
          rowClassName='editable-row'
        />
      </Form>
      <DrawerForm
        title='Party Booking'
        resize={{
          onResize() {
            console.log('resize!')
          },
          maxWidth: window.innerWidth * 0.8,
          minWidth: 1000
        }}
        form={form}
        drawerProps={{
          destroyOnClose: true
        }}
        onFinish={async values => {
          return true
        }}
        open={drawerBookingVisit}
        onOpenChange={setDrawerBookingVisit}
        submitter={{ render: false }}
      >
        {booking !== null && (
          <React.Fragment>
            <Flex justify='space-between' align='center'>
              <Typography.Title level={3}>{`Booking ID: ${booking?.id}`}</Typography.Title>
              <Flex gap={10}>
                {booking?.status !== PARTY_BOOKING_STATUS.COMPLETED && (
                  <Popconfirm
                    title='Action'
                    description='Are you sure to COMPLETE this booking?'
                    onConfirm={() => null}
                    onCancel={() => null}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button type='primary'>Complete</Button>
                  </Popconfirm>
                )}

                {booking?.status === PARTY_BOOKING_STATUS.PENDING ||
                  (booking?.status === PARTY_BOOKING_STATUS.CONFIRMED && (
                    <Popconfirm
                      title='Action'
                      description='Are you sure to CANCEL this booking?'
                      onConfirm={() => null}
                      onCancel={() => null}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button danger>Cancel</Button>
                    </Popconfirm>
                  ))}
              </Flex>
            </Flex>

            <Descriptions title='User Info' layout='vertical' bordered items={items} />
          </React.Fragment>
        )}
        {false && <Skeleton style={{ height: 600 }} active={true} />}
      </DrawerForm>
    </React.Fragment>
  )
}

export default Booking
