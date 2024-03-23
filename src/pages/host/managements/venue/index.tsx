import {
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  DropboxOutlined,
  PrinterOutlined,
  EyeOutlined,
  SolutionOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import {
  DrawerForm,
  ModalForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
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
  UploadFile,
  message
} from 'antd'
import { MenuProps } from 'antd/lib'
import Meta from 'antd/lib/card/Meta'
import dayjs from 'dayjs'
import { Fragment, useEffect, useState } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import { ItemInVenueListCreateRequest } from 'src/dtos/request/theme.request'
import { VenueCreateRequest } from 'src/dtos/request/venue.request'
import { SlotInVenueDataResponse } from 'src/dtos/response/slot.response'
import { VenueResponse } from 'src/dtos/response/venue.response'
import { disableSlotInVenueById, enableSlotInVenueById } from 'src/features/action/slot.action'
import {
  createPackageInVenueListByVenueId,
  createSlotInVenueListByVenueId,
  createThemeInVenueListByVenueId,
  createVenue,
  disableVenueById,
  enableVenueById,
  getAllPackageInVenueByVenueId,
  getAllPackageNotAdd,
  getAllSlotInVenueByVenueId,
  getAllSlotNotAdd,
  getAllThemeInVenueByVenueId,
  getAllThemeNotAdd,
  getAllVenueCheckSlotByDate,
  getPartyBookingByPartyDateId
} from 'src/features/action/venue.action'
import PackageInVenueDetail from 'src/views/host/managements/package/PackageInVenueDetail'
import ThemeInVenueDetail from 'src/views/host/managements/theme/ThemeInVenueDetail'
import UpgradeServiceBookingDetail from 'src/views/host/managements/upgrade-service/UpgradeServiceBookingDetail'

export const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD')

export interface TableListItem extends VenueResponse {
  key: string
  inUseOfTotalSlot: string
}

export interface ExpandedRowTable extends SlotInVenueDataResponse {
  key: string
}

export default function Venue() {
  // ** Dispatch API
  const dispatch = useAppDispatch()
  const tableListDataSource: TableListItem[] = []

  const fetchGetAllVenue = async () => {
    try {
      const res = await dispatch(getAllVenueCheckSlotByDate(dateQuery))
      const resData = res.payload as VenueResponse[] | []
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllThemeNotAdd = async (id: number) => {
    try {
      const res = await dispatch(getAllThemeNotAdd(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllPackageNotAdd = async (id: number) => {
    try {
      const res = await dispatch(getAllPackageNotAdd(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllSlotNotAdd = async (id: number) => {
    try {
      const res = await dispatch(getAllSlotNotAdd(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllThemeInVenueByVenueId = async (id: number) => {
    try {
      const res = await dispatch(getAllThemeInVenueByVenueId(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllPackageInVenueByVenueId = async (id: number) => {
    try {
      const res = await dispatch(getAllPackageInVenueByVenueId(id))
      const resData = res.payload
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }
  const fetchGetAllSlotInVenueByVenueId = async (id: number) => {
    try {
      const res = await dispatch(getAllSlotInVenueByVenueId(id))
      const resData = res.payload as VenueResponse[] | []
      console.log('AllVenue: ', JSON.stringify(res, null, 2))

      return resData
    } catch (error) {}
  }

  // ** ** Hook
  const [data, setData] = useState<TableListItem[]>([])
  const [dateQuery, setDateQuery] = useState(currentDateFormat)
  const [form] = Form.useForm()

  // Handle Form
  const [venue, setVenue] = useState<VenueResponse | null>(null)
  const [venueId, setVenueId] = useState<number | null>(null)
  const [drawerBookingVisit, setDrawerBookingVisit] = useState(false)
  const [drawerThemeInVenuegVisit, setDrawerThemeInVenueVisit] = useState(false)
  const [drawerPackageInVenueVisit, setDrawerPackageInVenueVisit] = useState(false)
  const [drawerSlotInVenueVisit, setDrawerslotInVenueVisit] = useState(false)
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const userInfo = useAppSelector(state => state.authReducer.userInfo)
  const venueList = useAppSelector(state => state.venueReducer.venueCheckSlotByDateList)
  const themeNotAddList = useAppSelector(state => state.venueReducer.themeNotAddList)
  const packageNotAddList = useAppSelector(state => state.venueReducer.packageNotAddList)
  const slotNotAddList = useAppSelector(state => state.venueReducer.slotNotAddList)
  const loading = useAppSelector(state => state.venueReducer.loading)
  const loadingCreateVenue = useAppSelector(state => state.venueReducer.loadingCreateVenue)
  const loadingGetSlotNotAdd = useAppSelector(state => state.venueReducer.loadingGetSlotNotAdd)
  const loadingPartyBooking = useAppSelector(state => state.venueReducer.loadingPartyBooking)
  const loadingCreateItemInVenueList = useAppSelector(state => state.venueReducer.loadingCreateItemInVenueList)
  const partyBooking = useAppSelector(state => state.venueReducer.partyBooking)
  const themeInVenueList = useAppSelector(state => state.venueReducer.themeInVenueList)
  const packageInVenueList = useAppSelector(state => state.venueReducer.packageInVenueList)
  const slotInVenueList = useAppSelector(state => state.venueReducer.slotInVenueList)

  const showPopconfirm = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)

    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  useEffect(() => {
    fetchGetAllVenue()
  }, [dateQuery])

  useEffect(() => {
    venueList.map((obj, index) => {
      tableListDataSource.push({
        ...obj,
        key: index.toString(),
        inUseOfTotalSlot:
          obj?.slotInVenueList.filter(item => item?.status === true).length + ' / ' + obj?.slotInVenueList.length
      })
    })
    setData(tableListDataSource)
  }, [venueList])

  const handleOpenThemeDrawer = async (record: TableListItem) => {
    await fetchGetAllThemeInVenueByVenueId(record?.id)
    setDrawerThemeInVenueVisit(true)
    setVenueId(record?.id)
    setVenue(record)
    await fetchGetAllThemeNotAdd(record?.id)
  }

  const handleOpenPackageDrawer = async (record: TableListItem) => {
    await fetchGetAllPackageInVenueByVenueId(record?.id)
    setDrawerPackageInVenueVisit(true)
    setVenueId(record?.id)
    setVenue(record)
    await fetchGetAllPackageNotAdd(record?.id)
  }

  const handleOpenSlotDrawer = async (record: TableListItem) => {
    await fetchGetAllSlotInVenueByVenueId(record?.id)
    setDrawerslotInVenueVisit(true)
    setVenueId(record?.id)
    setVenue(record)
    await fetchGetAllSlotNotAdd(record?.id)
  }

  const createOneVenue = async (payload: VenueCreateRequest) => {
    const res = await dispatch(createVenue(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      fetchGetAllVenue()
      message.success('Create venue success!')
      return true
    } else {
      message.error('Error when create!')
      return false
    }
  }

  const createThemeInVenueList = async (request: ItemInVenueListCreateRequest) => {
    const res = await dispatch(createThemeInVenueListByVenueId(request))
    if (res?.meta?.requestStatus === 'fulfilled') {
      if (venueId !== null) {
        await fetchGetAllThemeInVenueByVenueId(venueId)
        await fetchGetAllThemeNotAdd(venueId)
        message.success('Create theme in venue list success!')
      }
      return true
    } else {
      message.error('Error when create!')
      return false
    }
  }
  const createPackageInVenueList = async (request: ItemInVenueListCreateRequest) => {
    const res = await dispatch(createPackageInVenueListByVenueId(request))
    if (res?.meta?.requestStatus === 'fulfilled') {
      if (venueId !== null) {
        await fetchGetAllPackageInVenueByVenueId(venueId)
        await fetchGetAllPackageNotAdd(venueId)
        message.success('Create package in venue list success!')
      }
      return true
    } else {
      message.error('Error when create!')
      return false
    }
  }
  const createSlotInVenueList = async (request: ItemInVenueListCreateRequest) => {
    const res = await dispatch(createSlotInVenueListByVenueId(request))
    if (res?.meta?.requestStatus === 'fulfilled') {
      if (venueId !== null) {
        await fetchGetAllSlotInVenueByVenueId(venueId)
        await fetchGetAllSlotNotAdd(venueId)
        message.success('Create slot in venue list success!')
      }
      return true
    } else {
      message.error('Error when create!')
      return false
    }
  }

  const fetchPartyBookingByPartyDateId = async (id: number) => {
    const res = await dispatch(getPartyBookingByPartyDateId(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
    } else {
      const resData = res?.payload as any
      message.error(resData?.message)
    }
    console.log('res', JSON.stringify(res, null, 2))
  }

  const enableOneVenue = async (id: number) => {
    const res = await dispatch(enableVenueById(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchGetAllVenue()
      message.success('Enable success!')
    } else {
      message.error('Error when enable venue!')
    }
  }

  const disableOneVenue = async (id: number) => {
    const res = await dispatch(disableVenueById(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchGetAllVenue()
      message.success('Disable success!')
    } else {
      message.error('Error when disable venue!')
    }
  }

  const enableOneSlotInVenue = async (id: number) => {
    const res = await dispatch(enableSlotInVenueById(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchGetAllVenue()
      message.success('Enable success!')
    } else {
      message.error('Error when enable slot!')
    }
  }

  const disableOneSlotInVenue = async (id: number) => {
    const res = await dispatch(disableSlotInVenueById(id))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchGetAllVenue()
      message.success('Disable success!')
    } else {
      message.error('Error when disable slot!')
    }
  }

  const expandedRowRender = (record: TableListItem) => {
    const data: ExpandedRowTable[] = []

    record?.slotInVenueList?.map((item, index) => {
      data.push({
        key: (index + 1).toString(),
        id: item?.id,
        active: item?.active,
        status: item?.status,
        slot: {
          id: item?.slot?.id,
          timeStart: item?.slot?.timeStart,
          timeEnd: item?.slot?.timeEnd,
          validTimeRange: false,
          active: false
        },
        partyDated: {
          id: item?.partyDated?.id,
          date: item?.partyDated?.date,
          active: item?.partyDated?.active
        }
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
            render: (_, recordChild) => {
              const items: MenuProps['items'] = [
                {
                  label: 'View booking',
                  key: '1',
                  icon: <EditOutlined />,
                  onClick: () => {
                    fetchPartyBookingByPartyDateId(recordChild?.partyDated?.id)
                    setVenue(record)
                    setDrawerBookingVisit(true)
                  },
                  disabled: recordChild?.status ? false : true
                },
                {
                  label: recordChild?.active ? (
                    <Typography style={{ color: 'red' }}>Disable slot</Typography>
                  ) : (
                    <Typography style={{ color: 'green' }}>Enable slot</Typography>
                  ),
                  key: '2',
                  icon: recordChild?.active ? (
                    <CloseOutlined style={{ color: 'red' }} />
                  ) : (
                    <CheckOutlined style={{ color: 'green' }} />
                  ),
                  disabled: record?.active ? false : true,
                  onClick: () => {
                    if (recordChild?.active) {
                      disableOneSlotInVenue(recordChild?.id)
                    } else {
                      enableOneSlotInVenue(recordChild?.id)
                    }
                  }
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
    {
      title: 'Name',
      width: '20%',
      dataIndex: 'venueName'
    },
    {
      title: 'Location',
      width: '15%',
      dataIndex: 'location'
    },
    {
      title: 'Capacity',
      width: '10%',
      dataIndex: 'capacity'
    },
    {
      title: 'Is Active?',
      width: '10%',
      dataIndex: 'active',
      render: (_, record) => (record?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>)
    },
    {
      title: 'In use / Total slot',
      width: '20%',
      dataIndex: 'inUseOfTotalSlot'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: TableListItem) => {
        const items: MenuProps['items'] = [
          {
            label: 'View theme list',
            key: '1',
            icon: <PrinterOutlined />,
            onClick: () => handleOpenThemeDrawer(record)
          },
          {
            label: 'View package list',
            key: '2',
            icon: <DropboxOutlined />,
            onClick: () => handleOpenPackageDrawer(record)
          },
          {
            label: 'View slot list',
            key: '3',
            icon: <SolutionOutlined />,
            onClick: () => handleOpenSlotDrawer(record)
          },
          {
            label: record?.active ? (
              <Typography style={{ color: 'red' }}>Disable venue</Typography>
            ) : (
              <Typography style={{ color: 'green' }}>Enable venue</Typography>
            ),
            key: '4',
            icon: record?.active ? (
              <CloseOutlined style={{ color: 'red' }} />
            ) : (
              <CheckOutlined style={{ color: 'green' }} />
            ),
            onClick: () => {
              if (record?.active) {
                disableOneVenue(record?.id)
              } else {
                enableOneVenue(record?.id)
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

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Venue',
      children: (
        <Space>
          <Typography>{venue?.venueName || 'venue name'}</Typography>
          <Tooltip title={location}>
            <a>{venue?.location || 'location'}</a>
          </Tooltip>
        </Space>
      )
    },
    {
      key: '2',
      label: 'Theme',
      children: (
        <ModalForm
          title='Theme'
          trigger={
            <Button type='primary'>
              <EyeOutlined />
              View theme
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
        ><ThemeInVenueDetail themeInVenue={partyBooking?.themeInVenue} /></ModalForm>
      )
    },
    {
      key: '3',
      label: 'Package',
      children: (
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
          submitTimeout={2000}
          onFinish={async values => {
            return true
          }}
        >
          <PackageInVenueDetail packageInVenue={partyBooking?.packageInVenue} />
        </ModalForm>
      )
    },
    {
      key: '4',
      label: 'Order time',
      children: partyBooking?.createAt ? dayjs(partyBooking?.createAt).format('YYYY-MM-DD vào lúc HH:mm:ss') : 'null'
    },
    {
      key: '5',
      label: 'Usage Time',
      children: partyBooking?.partyDated?.date + ' at ' + partyBooking?.slotInVenueObject?.slot?.timeStart
    },
    {
      key: '100',
      label: 'Finish Time',
      children: partyBooking?.partyDated?.date + ' at ' + partyBooking?.slotInVenueObject?.slot?.timeEnd
    },
    {
      key: '6',
      label: 'Status',
      span: 1,
      children: (
        <Badge status={partyBooking?.status === 'PENDING' ? 'processing' : 'success'} text={partyBooking?.status} />
      )
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
         <UpgradeServiceBookingDetail upgradeServices={partyBooking?.upgradeServices} />
        </ModalForm>
      )
    },
    {
      key: '7',
      label: 'Negotiated Amount',
      children: partyBooking?.pricingTotal?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      key: '8',
      label: 'Discount',
      children: 0
    },
    {
      key: '9',
      label: 'Official Receipts',
      children: partyBooking?.pricingTotal?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      key: '10',
      label: 'Booking Info',
      children: (
        <>
          Name booking: {userInfo?.data?.fullName}
          <br />
          Email: {partyBooking?.email}
          <br />
          Phone: {partyBooking?.phone}
          <br />
          Kid Name: {partyBooking?.kidName}
          <br />
          Kid DOB: {partyBooking?.kidDOB}
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
        headerTitle='Venue Management'
        options={false}
        toolBarRender={() => [
          <Button key='refresh'>Refresh</Button>,
          // <Button key='out'>
          //   Download
          //   <DownOutlined />
          // </Button>,
          <ModalForm
            loading={loadingCreateVenue}
            title='Create A New Venue'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new venue
              </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run')
            }}
            submitTimeout={2000}
            onFinish={async ({
              name,
              description,
              fileImg,
              location,
              capacity
            }: {
              name: string
              description: string
              fileImg: UploadFile[]
              location: string
              capacity: number
            }) => {
              console.log(name, description, location, capacity)
              const result = createOneVenue({
                venueName: name,
                venueDescription: description,
                fileImage: fileImg?.[0]?.originFileObj,
                location: location,
                capacity: capacity
              })
              return result
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
              name='name'
              label='Name'
              // tooltip='Name is ok'
              placeholder='Enter venue name'
            />
            <ProFormTextArea
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='description'
              label='Description'
              placeholder='Enter venue description'
            />
            <ProFormTextArea
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='location'
              label='Location'
              placeholder='Enter venue description'
            />
            <ProFormDigit
              width={328}
              rules={[{ required: true, message: 'Please input this' }]}
              name='capacity'
              label='Capacity'
              placeholder='Enter venue capacity'
            />
            <ProFormUploadButton
              rules={[{ required: true, message: 'Please input this' }]}
              name='fileImg'
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
        submitTimeout={2000}
        onFinish={async values => {
          return true
        }}
        open={drawerBookingVisit}
        onOpenChange={setDrawerBookingVisit}
        disabled={loadingGetSlotNotAdd}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        {partyBooking !== null && (
          <Fragment>
            <Typography.Title level={3}>{`Booking ID: ${partyBooking?.id}`}</Typography.Title>
            <Descriptions title='User Info' layout='vertical' bordered items={items} />
          </Fragment>
        )}
        {loadingPartyBooking && <Skeleton style={{ height: 600 }} active={true} />}
      </DrawerForm>
      <DrawerForm
        title='Theme In Venue List'
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
          // if (venueId !== null) {
          //   const res = await createOneSlotInVenue({ venue_id: venueId, slot_id: values?.slotId })
          //   return res
          // }
          return true
        }}
        open={drawerThemeInVenuegVisit}
        onOpenChange={setDrawerThemeInVenueVisit}
        disabled={loadingCreateItemInVenueList}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        <Flex align='center' justify='space-between'>
          <Typography.Title level={3}>{`Venue: ${venue?.venueName}`}</Typography.Title>
          <ModalForm
            title='Add new theme in venue'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new theme in venue
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
                result = await createThemeInVenueList({ venueId: venueId, payload: values?.themeIdList })
              }
              return result
            }}
          >
            {themeNotAddList?.length > 0 ? (
              <ProFormCheckbox.Group
                name='themeIdList'
                layout='horizontal'
                // label='Industry Distribution'
                style={{ marginBottom: 10 }}
                options={themeNotAddList?.map((item, index) => ({
                  label: (
                    <Card
                      key={index}
                      hoverable
                      style={{ width: 200, marginBottom: 10 }}
                      cover={
                        <Image
                          style={{ width: '100%', height: 100, objectFit: 'cover' }}
                          alt='example'
                          src={item?.themeImgUrl}
                        />
                      }
                    >
                      <Meta title={item?.themeName} />
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
          {themeInVenueList.length > 0 ? (
            themeInVenueList.map((item, index) => {
              return (
                <Col span={8}>
                  <Card
                    hoverable
                    style={{ width: '100%' }}
                    cover={
                      <Image
                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        alt='example'
                        src={item?.theme?.themeImgUrl}
                      />
                    }
                  >
                    <Space direction='vertical'>
                      <Tag color={item?.active ? 'success' : 'error'}>{item?.active ? 'Active' : 'Inactive'}</Tag>
                      <Meta title={item?.theme?.themeName} description={item?.theme?.themeDescription} />
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
          // if (venueId !== null) {
          //   const res = await createOneSlotInVenue({ venue_id: venueId, slot_id: values?.slotId })
          //   return res
          // }
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
                result = await createPackageInVenueList({ venueId: venueId, payload: values?.idList })
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
      <DrawerForm
        title='Slot In Venue List'
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
          // if (venueId !== null) {
          //   const res = await createOneSlotInVenue({ venue_id: venueId, slot_id: values?.slotId })
          //   return res
          // }
          return true
        }}
        open={drawerSlotInVenueVisit}
        onOpenChange={setDrawerslotInVenueVisit}
        disabled={loadingCreateItemInVenueList}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        <Flex align='center' justify='space-between'>
          <Typography.Title level={3}>{`Venue: ${venue?.venueName}`}</Typography.Title>
          <ModalForm
            title='Add new slot in venue'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new slot in venue
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
                result = await createSlotInVenueList({ venueId: venueId, payload: values?.themeIdList })
              }
              return result
            }}
          >
            {slotNotAddList?.length > 0 ? (
              <ProFormCheckbox.Group
                name='themeIdList'
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
        </Flex>
        <Row gutter={[16, 16]}>
          {slotInVenueList.length > 0 ? (
            slotInVenueList.map((item, index) => {
              return (
                <Col key={index} span={8}>
                  <Card hoverable style={{ width: '100%' }}>
                    <Meta
                      description={
                        <Flex vertical gap={10}>
                          <Flex vertical gap={10}>
                            <strong>Start time: </strong> <Typography>{item?.slot?.timeStart}</Typography>
                            <strong>End time: </strong> <Typography>{item?.slot?.timeEnd}</Typography>
                          </Flex>
                        </Flex>
                      }
                    />
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
