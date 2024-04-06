import {
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import {
  DrawerForm,
  ModalForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormUploadButton,
  ProTable,
  QueryFilter
} from '@ant-design/pro-components'
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Dropdown,
  Empty,
  Flex,
  Form,
  Image,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd'
import { MenuProps } from 'antd/lib'
import Meta from 'antd/lib/card/Meta'
import dayjs from 'dayjs'
import React, { Fragment, useEffect, useState } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import {
  RoomDataCreateRequest,
  RoomGetSlotNotAddRequest,
  SlotInRoomListCreateRequest
} from 'src/dtos/request/room.request'
import { PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'
import { RoomDataResponse } from 'src/dtos/response/room.response'
import { SlotInRoomDataResponse } from 'src/dtos/response/slot.response'
import { VenueDataResponse } from 'src/dtos/response/venue.response'
import { PARTY_BOOKING_STATUS } from 'src/enums/partyBooking'
import { SERVICE_ENUM } from 'src/enums/service'
import { cancelBooking, completeBooking, getBookingById } from 'src/features/action/partyBooking.action'
import {
  createRoom,
  createSlotInRoomListByRoomId,
  disableRoom,
  enableRoom,
  getAllRoom,
  getSlotNotAddByRoomId
} from 'src/features/action/room.action'
import { disableSlotInRoom, enableSlotInRoom } from 'src/features/action/slot.action'
import { getAllPackageNotAdd, getAllVenueCheckSlotByDate } from 'src/features/action/venue.action'
import PackageDetail from 'src/views/host/managements/package/PackageDetail'
import PackageInVenueDetail from 'src/views/host/managements/package/PackageInVenueDetail'
import UpgradeServiceBookingDetail from 'src/views/host/managements/upgrade-service/UpgradeServiceBookingDetail'

export const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD')

export interface TableListItem extends RoomDataResponse {
  key: string
  inUseInTotal: string
}

export interface ExpandedRowTable extends SlotInRoomDataResponse {
  key: string
  inUseInTotal: string
}

export interface ExpandedRowTableChild extends SlotInRoomDataResponse {
  key: string
  inUseInTotal: string
}

const Venue: React.FC = () => {
  // ** Dispatch API
  const dispatch = useAppDispatch()
  const tableListDataSource: TableListItem[] = []

  const fetchGetAllPackageNotAdd = async (id: number) => {
    try {
      const res = await dispatch(getAllPackageNotAdd(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllSlotNotAdd = async (payload: RoomGetSlotNotAddRequest) => {
    try {
      const res = await dispatch(getSlotNotAddByRoomId(payload))
      const resData = res.payload
      console.log('SlotAddNot: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }

  // ** ** Hook
  const [data, setData] = useState<TableListItem[]>([])
  const [dateQuery, setDateQuery] = useState(currentDateFormat)
  const [form] = Form.useForm()
  const [modalRoomForm] = Form.useForm()
  const [modalSlotForm] = Form.useForm()

  // Handle Form
  const [venue, setVenue] = useState<VenueDataResponse | null>(null)
  const [venueId, setVenueId] = useState<number | null>(null)
  const [room, setRoom] = useState<RoomDataResponse | null>(null)

  const [drawerBookingVisit, setDrawerBookingVisit] = useState(false)
  const [drawerRoomListVisit, setDrawerRoomListVisit] = useState(false)
  const [drawerPackageInVenueVisit, setDrawerPackageInVenueVisit] = useState(false)
  const [drawerSlotInVenueVisit, setDrawerslotInVenueVisit] = useState(false)
  const [modalRoomVisit, setModalRoomVisit] = useState(false)
  const [modalSlotNotAddVisit, setModalSlotNotAddVisit] = useState(false)

  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const userInfo = useAppSelector(state => state.authReducer.userInfo)
  const venueList = useAppSelector(state => state.venueReducer.venueCheckSlotByDateList)
  const venueObject = useAppSelector(state => state.venueReducer.venueCheckSlotByDate)
  const roomList = useAppSelector(state => state.venueReducer.roomList)

  const packageNotAddList = useAppSelector(state => state.venueReducer.packageNotAddList)
  const slotNotAddList = useAppSelector(state => state.venueReducer.slotNotAddList)
  const loading = useAppSelector(state => state.venueReducer.loading)
  const loadingCreate = useAppSelector(state => state.venueReducer.loadingCreate)
  const loadingCreateVenue = useAppSelector(state => state.venueReducer.loadingCreateVenue)
  const loadingGetSlotNotAdd = useAppSelector(state => state.venueReducer.loadingGetSlotNotAdd)
  const loadingPartyBooking = useAppSelector(state => state.venueReducer.loadingPartyBooking)
  const loadingCreateItemInVenueList = useAppSelector(state => state.venueReducer.loadingCreateItemInVenueList)
  const booking = useAppSelector(state => state.partyBookingReducer.bookingById)
  const packageInVenueList = useAppSelector(state => state.venueReducer.packageInVenueList)

  const fetchVenue = async () => {
    const res = await dispatch(getAllVenueCheckSlotByDate())
    const resData = res.payload as VenueDataResponse

    return resData
  }

  const fetchAllRoom = async () => {
    const res = await dispatch(getAllRoom(dateQuery))
    const resData = res.payload as VenueDataResponse

    return resData
  }

  useEffect(() => {
    fetchVenue()
  }, [])

  useEffect(() => {
    setVenue(venueObject)
    setVenueId(venueObject.id)
  }, [venueObject])

  useEffect(() => {
    fetchAllRoom()
  }, [dateQuery])

  useEffect(() => {
    roomList?.map((obj, index) => {
      tableListDataSource.push({
        ...obj,
        key: (index + 1).toString(),
        inUseInTotal: ''
      })
    })
    setData(tableListDataSource)
  }, [roomList])

  // const handleOpenRoomModal = async (record: TableListItem) => {
  //   setModalRoomVisit(true)
  //   setVenueId(record?.id)
  //   setVenue(record)
  // }
  const fetchBookingById = async (id: number) => {
    const res = await dispatch(getBookingById(id))
    console.log(JSON.stringify(res, null, 2))
    return res
  }

  const handleOpenBookingDetail = async (record: ExpandedRowTable) => {
    const res = await fetchBookingById(record?.partyBookingId)
    if (res?.meta?.requestStatus === 'fulfilled') {
      setDrawerBookingVisit(true)
    } else {
      const message = (res?.payload as any)?.message
      message.error(message)
    }
  }
  const handleOpenSlotNotAddModal = async (record: TableListItem) => {
    if (venueId !== null) {
      await fetchGetAllSlotNotAdd({ roomId: record?.id })
      setModalSlotNotAddVisit(true)
      setRoom(record)
    }
  }

  const enableOneSlotInRoom = async (id: number) => {
    const res = await dispatch(enableSlotInRoom(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Enable room success!')
    } else {
      message.error('Error when enable room!')
    }
  }

  const disableOneSlotInRoom = async (id: number) => {
    const res = await dispatch(disableSlotInRoom(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Disable room success!')
    } else {
      message.error('Error when disable room!')
    }
  }

  const enableOneRoom = async (payload: RoomGetSlotNotAddRequest) => {
    const res = await dispatch(enableRoom(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Enable room success!')
    } else {
      message.error('Error when enable room!')
    }
  }

  const disableOneRoom = async (payload: RoomGetSlotNotAddRequest) => {
    const res = await dispatch(disableRoom(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Disable room success!')
    } else {
      message.error('Error when disable room!')
    }
  }

  const cancelOneBooking = async (record: PartyBookingDataResponse) => {
    const res = await dispatch(cancelBooking(record?.id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success(`Cancel booking ID ${record?.id} success!`)
      await fetchBookingById(record?.id)
    } else {
      const message = (res?.payload as any)?.message
      message.error(message)
    }
  }

  const completeOneBooking = async (record: PartyBookingDataResponse) => {
    const res = await dispatch(completeBooking(record?.id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success(`Cancel booking ID ${record?.id} success!`)
      await fetchBookingById(record?.id)
    } else {
      const message = (res?.payload as any)?.message
      message.error(message)
    }
  }

  const createSlotInRoomList = async (request: SlotInRoomListCreateRequest) => {
    const res = await dispatch(createSlotInRoomListByRoomId(request))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Create success!')
      return true
    } else {
      message.error(res?.payload?.message)
      return false
    }
  }

  const createOneRoom = async (payload: RoomDataCreateRequest) => {
    const res = await dispatch(createRoom(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllRoom()
      message.success('Create success!')
      modalRoomForm.resetFields()
      return true
    } else {
      message.error(res?.payload?.message)
      return false
    }
  }

  const expandedRowRender = (record: TableListItem) => {
    const data: ExpandedRowTable[] = []

    record?.slotInRoomList?.map((obj, index) => {
      data.push({
        ...obj,
        key: (index + 1).toString(),
        inUseInTotal: record?.slotInRoomList?.length.toString()
      })
    })

    return (
      <ProTable
        columns={[
          { title: 'Slot No.', dataIndex: 'key', key: 'key', width: '10%' },
          { title: 'Start Time', dataIndex: ['slot', 'timeStart'], key: 'slot.timeStart' },

          { title: 'End Time', dataIndex: ['slot', 'timeEnd'], key: 'slot.timeEnd' },
          {
            title: 'Is Active?',
            dataIndex: 'active',
            key: 'active',
            render: (_, recordChild) =>
              recordChild?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, recordChild) =>
              recordChild?.status ? <Tag color='error'>In Use</Tag> : <Tag color='success'>Empty</Tag>
          },
          {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: (_: any, recordChild) => {
              const items: MenuProps['items'] = [
                {
                  label: 'View booking',
                  key: '1',
                  icon: <PrinterOutlined />,
                  onClick: () => {
                    handleOpenBookingDetail(recordChild)
                  },
                  disabled: recordChild?.status ? false : true
                },
                {
                  label: recordChild?.active ? (
                    <Typography style={{ color: 'red' }}>Disable slot</Typography>
                  ) : (
                    <Typography style={{ color: 'green' }}>Enable slot</Typography>
                  ),
                  key: '4',
                  icon: recordChild?.active ? (
                    <CloseOutlined style={{ color: 'red' }} />
                  ) : (
                    <CheckOutlined style={{ color: 'green' }} />
                  ),
                  onClick: () => {
                    if (recordChild?.active) {
                      disableOneSlotInRoom(recordChild?.id)
                    } else {
                      enableOneSlotInRoom(recordChild?.id)
                    }
                  }
                }
              ]
              const menuProps = {
                items
              }
              return (
                <Dropdown
                  menu={menuProps}
                  trigger={['click']}
                  // onOpenChange={() => setKey(key === record.key ? null : record.key)}
                >
                  <Button icon={<MoreOutlined spin={key === record.key ? true : false} />}></Button>
                </Dropdown>
              )
            }
          }
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    )
  }

  const [key, setKey] = useState<string | null>(null)
  const columns: ProColumns<TableListItem>[] = [
    { title: 'Room No.', dataIndex: 'key', key: 'key', width: '10%' },
    {
      title: 'Name',
      dataIndex: 'roomName',
      width: '15%',
      key: 'roomName'
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      width: '10%',
      key: 'capacity'
    },
    {
      title: 'Pricing',
      dataIndex: 'pricing',
      width: '15%',
      key: 'pricing'
    },
    {
      title: 'Is Active?',
      dataIndex: 'active',
      width: '10%',
      key: 'active',
      render: (_, record) => (record?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>)
    },
    {
      title: 'In use / Total',
      dataIndex: 'inUseInTotal',
      width: '15%',
      key: 'status',
      align: 'center',
      render: (_, record) =>
        record?.slotInRoomList?.filter(item => item?.status === true)?.length + ' / ' + record?.slotInRoomList?.length
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: TableListItem) => {
        const items: MenuProps['items'] = [
          {
            label: 'Add slot',
            key: '1',
            icon: <PrinterOutlined />,
            onClick: () => handleOpenSlotNotAddModal(record)
          },
          {
            label: record?.active ? (
              <Typography style={{ color: 'red' }}>Disable room</Typography>
            ) : (
              <Typography style={{ color: 'green' }}>Enable room</Typography>
            ),
            key: '4',
            icon: record?.active ? (
              <CloseOutlined style={{ color: 'red' }} />
            ) : (
              <CheckOutlined style={{ color: 'green' }} />
            ),
            onClick: () => {
              if (record?.active) {
                disableOneRoom({ roomId: record?.id })
              } else {
                enableOneRoom({ roomId: record?.id })
              }
            }
          }
        ]
        const menuProps = {
          items
        }
        return (
          <Dropdown
            menu={menuProps}
            trigger={['click']}
            // onOpenChange={() => setKey(key === record.key ? null : record.key)}
          >
            <Button icon={<MoreOutlined spin={key === record.key ? true : false} />}></Button>
          </Dropdown>
        )
      }
    }
  ]
  console.log('venueId', JSON.stringify(venueId, null, 2))
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
            title='Package Decoration'
            trigger={
              <Button type='primary'>
                <EyeOutlined />
                View
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
            <PackageDetail
              packageInVenue={
                booking?.packageInBookings?.find(item => item.apackage.packageType === SERVICE_ENUM.DECORATION)
                  ?.apackage
              }
            />
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
      label: 'Package Food',
      children: (
        <Space direction='vertical'>
          <ModalForm
            title='Package Food	'
            trigger={
              <Button type='primary'>
                <EyeOutlined />
                View
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
            <PackageDetail
              packageInVenue={
                booking?.packageInBookings?.find(item => item.apackage.packageType === SERVICE_ENUM.FOOD)?.apackage
              }
            />
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
      children: booking?.createAt ? dayjs(booking?.createAt).format('YYYY-MM-DD HH:mm:ss') : 'null'
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
      children: booking?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      key: '8',
      label: 'Discount',
      children: 0
    },
    {
      key: '9',
      label: 'Official Receipts',
      children: booking?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
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
          Participant Amount: {booking?.participantAmount}
          <br />
          Kid Name: {booking?.kidName}
          <br />
          Kid DOB: {booking?.kidDOB}
        </>
      )
    }
  ]
  return (
    <Fragment>
      <QueryFilter
        style={{ backgroundColor: 'white', marginBottom: 10 }}
        submitter={{ searchConfig: { submitText: 'Query', resetText: 'Reset' } }}
        onFinish={formData => {
          return new Promise<boolean | void>((resolve, reject) => {
            setDateQuery(formData?.date || currentDateFormat)
            if (true) {
              resolve(true) // Resolving with true
            } else {
              reject(false) // Rejecting with false
            }
          })
        }}
      >
        <ProFormDatePicker name='date' label='Date filter' initialValue={new Date()} />
      </QueryFilter>

      <ProTable<TableListItem>
        loading={loading || loadingCreateItemInVenueList}
        columns={columns}
        // request={(params, sorter, filter) => {
        //   console.log(params, sorter, filter)
        //   return Promise.resolve({
        //     data: data,
        //     success: true
        //   })
        // }}

        dataSource={data}
        rowKey='key'
        pagination={{
          showQuickJumper: true
        }}
        // locale={{ emptyText: 'No data', selectAll: 'Select All',  }}
        expandable={{ expandedRowRender }}
        search={false}
        dateFormatter='string'
        headerTitle='Room Management'
        options={false}
        toolBarRender={() => [
          <Button loading={loading} onClick={() => fetchAllRoom()} key='refresh'>
            Refresh
          </Button>,

          <ModalForm
            loading={loadingCreate || loading}
            title='Create A New Room'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new room
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
              if (venueId !== null) {
                const result = await createOneRoom({
                  venueId,
                  roomName: values.roomName,
                  capacity: values.capacity,
                  pricing: values.pricing,
                  roomImgUrl: values.roomImgUrl?.[0]?.originFileObj
                })
                return result
              }
            }}
            submitter={{
              searchConfig: {
                submitText: 'Submit',
                resetText: 'Cancel'
              }
            }}
          >
            <ProFormText
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='roomName'
              label='Name'
              // tooltip='Name is ok'
              placeholder='Enter room name'
            />
            <ProFormDigit
              width={328}
              rules={[{ required: true, message: 'Please input this' }]}
              name='capacity'
              label='Capacity'
              placeholder='Enter room capacity'
            />
            <ProFormDigit
              width={328}
              rules={[{ required: true, message: 'Please input this' }]}
              name='pricing'
              label='Pricing'
              placeholder='Enter room pricing'
            />
            <ProFormUploadButton
              rules={[{ required: true, message: 'Please input this' }]}
              name='roomImgUrl'
              label='Upload image'
              title='Upload'
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                progress: { showInfo: false }
              }}
            />
          </ModalForm>
        ]}
      />
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
                    onConfirm={() => completeOneBooking(booking)}
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
                      onConfirm={() => cancelOneBooking(booking)}
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

      <ModalForm
        title={`Venue: ${venue?.venueName} - Add new room`}
        form={modalRoomForm}
        width={500}
        onFinish={async values => {
          if (venueId !== null) {
            const result = await createOneRoom({
              venueId,
              roomName: values.roomName,
              capacity: values.capacity,
              pricing: values.pricing,
              roomImgUrl: values.roomImgUrl?.[0]?.originFileObj
            })
            return result
          }
        }}
        open={modalRoomVisit}
        onOpenChange={setModalRoomVisit}
        disabled={false}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        <ProFormText
          rules={[{ required: true, message: 'Please input this' }]}
          width='md'
          name='roomName'
          label='Name'
          // tooltip='Name is ok'
          placeholder='Enter room name'
        />
        <ProFormDigit
          width={328}
          rules={[{ required: true, message: 'Please input this' }]}
          name='capacity'
          label='Capacity'
          placeholder='Enter room capacity'
        />
        <ProFormDigit
          width={328}
          rules={[{ required: true, message: 'Please input this' }]}
          name='pricing'
          label='Pricing'
          placeholder='Enter room pricing'
        />
        <ProFormUploadButton
          rules={[{ required: true, message: 'Please input this' }]}
          name='roomImgUrl'
          label='Upload image'
          title='Upload'
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            progress: { showInfo: false }
          }}
        />
      </ModalForm>

      <ModalForm
        title={`${room?.roomName} = Add new slot`}
        form={modalRoomForm}
        autoFocusFirstInput
        open={modalSlotNotAddVisit}
        onOpenChange={setModalSlotNotAddVisit}
        onFinish={async values => {
          let result = false
          if (room !== null) {
            result = await createSlotInRoomList({ roomId: room?.id, payload: values?.slotList })
          }
          return result
        }}
      >
        {slotNotAddList?.length > 0 ? (
          <ProFormCheckbox.Group
            name='slotList'
            layout='horizontal'
            // label='Industry Distribution'
            style={{ marginBottom: 10 }}
            options={slotNotAddList?.map((item, index) => ({
              label: (
                <Card key={index} hoverable style={{ width: 200, marginBottom: 10 }}>
                  <Meta
                    description={
                      <Flex vertical gap={10}>
                        <strong>Start time: </strong> <Typography>{item?.timeStart}</Typography>
                        <strong>End time: </strong> <Typography>{item?.timeEnd}</Typography>
                      </Flex>
                    }
                  />
                </Card>
              ),
              value: item?.id
            }))}
          />
        ) : (
          <Empty style={{ margin: 'auto' }} />
        )}
      </ModalForm>

      <DrawerForm
        title='Package In Venue List'
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
        submitTimeout={2000}
        onFinish={async values => {
          return true
        }}
        open={drawerPackageInVenueVisit}
        onOpenChange={setDrawerPackageInVenueVisit}
        disabled={loadingCreateItemInVenueList}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        <Flex align='center' justify='space-between'>
          <Typography.Title level={3}>{`Venue: ${venue?.venueName}`}</Typography.Title>
          <ModalForm
            title='Add new package in venue'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new package in venue
              </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run')
            }}
            onFinish={async values => {
              let result = false
              if (venueId !== null) {
                // result = await createPackageInVenueList({ venueId: venueId, payload: values?.idList })
              }
              return result
            }}
          >
            {packageNotAddList?.length > 0 ? (
              <ProFormCheckbox.Group
                name='idList'
                layout='horizontal'
                // label='Industry Distribution'
                style={{ marginBottom: 10 }}
                options={packageNotAddList?.map((item, index) => ({
                  label: (
                    <Card
                      key={index}
                      hoverable
                      style={{ width: 200, marginBottom: 10 }}
                      cover={
                        <Image
                          style={{ width: '100%', height: 100, objectFit: 'cover' }}
                          alt='example'
                          src={item?.packageImgUrl}
                        />
                      }
                    >
                      <Space direction='vertical'>
                        <Tag color={item?.active ? 'success' : 'error'}>{item?.active ? 'Active' : 'Inactive'}</Tag>
                        <Meta title={item?.packageName} />
                      </Space>
                    </Card>
                  ),
                  value: item?.id
                }))}
              />
            ) : (
              <Empty style={{ margin: 'auto' }} />
            )}
          </ModalForm>
        </Flex>
        <Row gutter={[16, 16]}>
          {packageInVenueList.length > 0 ? (
            packageInVenueList.map((item, index) => {
              return (
                <Col span={8}>
                  <Card
                    hoverable
                    style={{ width: '100%' }}
                    cover={
                      <Image
                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        alt='example'
                        src={item?.apackage?.packageImgUrl}
                      />
                    }
                  >
                    <Space direction='vertical'>
                      <Tag color={item?.active ? 'success' : 'error'}>{item?.active ? 'Active' : 'Inactive'}</Tag>
                      <Meta title={item?.apackage?.packageName} />
                      <ModalForm
                        title='Chi tiết gói dịch vụ'
                        trigger={
                          <Button type='default'>
                            <EyeOutlined />
                            Chi tiết
                          </Button>
                        }
                        style={{ padding: 0 }}
                      >
                        <PackageInVenueDetail packageInVenue={item} />
                      </ModalForm>
                    </Space>
                  </Card>
                </Col>
              )
            })
          ) : (
            <Empty style={{ margin: 'auto', marginTop: 20 }} />
          )}
        </Row>
      </DrawerForm>
    </Fragment>
  )
}
export default Venue
