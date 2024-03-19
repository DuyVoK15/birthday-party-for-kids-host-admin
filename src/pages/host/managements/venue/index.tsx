import {
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  DropboxOutlined,
  PrinterOutlined,
  EyeOutlined
} from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import {
  DrawerForm,
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProTable,
  QueryFilter
} from '@ant-design/pro-components'
import {
  Badge,
  Button,
  Descriptions,
  DescriptionsProps,
  Dropdown,
  Form,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd'
import { MenuProps } from 'antd/lib'
import dayjs from 'dayjs'
import { Fragment, useEffect, useState } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import { SlotInVenueResponse } from 'src/dtos/response/slot.response'
import { VenueResponse } from 'src/dtos/response/venue.response'
import {
  createSlotInVenue,
  getAllSlotNotAdd,
  getAllVenueCheckSlotByDate,
  getPartyBookingByPartyDateId
} from 'src/features/action/venue.action'

export const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD')

export interface TableListItem extends VenueResponse {
  key: string
  emptySlot: number
}

export interface ExpandedRowTable extends SlotInVenueResponse {
  key: string
}

export default function Venue() {
  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.venueReducer.loading)
  const venueList = useAppSelector(state => state.venueReducer.venueCheckSlotByDateList)
  const tableListDataSource: TableListItem[] = []

  const fetchGetAllVenue = async () => {
    try {
      const res = await dispatch(getAllVenueCheckSlotByDate(dateQuery))
      const resData = res.payload as VenueResponse[] | []
      console.log('AllVenue: ', JSON.stringify(res, null, 2))
      return resData
    } catch (error) {}
  }
  const fetchGetAllSlotNotAdd = async (id: number) => {
    try {
      const res = await dispatch(getAllSlotNotAdd(id))
      const resData = res.payload as VenueResponse[] | []
      console.log('AllVenue: ', JSON.stringify(res, null, 2))
      return resData
    } catch (error) {}
  }
  // ** ** Hook
  const [data, setData] = useState<TableListItem[]>([])
  const [dateQuery, setDateQuery] = useState(currentDateFormat)
  const [form] = Form.useForm<{ name: string; company: string }>()

  useEffect(() => {
    fetchGetAllVenue()
  }, [dateQuery])

  useEffect(() => {
    venueList.map((obj, index) => {
      tableListDataSource.push({
        ...obj,
        key: index.toString(),
        emptySlot: obj?.slotInVenueList.filter(item => item?.status === false).length
      })
    })
    setData(tableListDataSource)
  }, [venueList])

  // Handle Form
  const [venue, setVenue] = useState<VenueResponse | null>(null)
  const [venueId, setVenueId] = useState<number | null>(null)
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [drawerBookingVisit, setDrawerBookingVisit] = useState(false)

  const slotNotAddList = useAppSelector(state => state.venueReducer.slotNotAddList)
  const loadingGetSlotNotAdd = useAppSelector(state => state.venueReducer.loadingGetSlotNotAdd)
  const loadingPartyBooking = useAppSelector(state => state.venueReducer.loadingPartyBooking)
  const partyBooking = useAppSelector(state => state.venueReducer.partyBooking)

  const handleOpenDrawer = (record: TableListItem) => {
    fetchGetAllSlotNotAdd(record?.id)
    setDrawerVisit(true)
    setVenueId(record?.id)
  }

  const createOneSlotInVenue = async (payload: { venue_id: number; slot_id: number }) => {
    try {
      const res = await dispatch(createSlotInVenue(payload))
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchGetAllVenue()
        return true
      }
    } catch (error) {
      message.error(error)
    }
  }

  const fetchPartyBookingByPartyDateId = async (id: number) => {
    try {
      const res = await dispatch(getPartyBookingByPartyDateId(id))
      if (res?.meta?.requestStatus === 'fulfilled') {
      }
      console.log('res', JSON.stringify(res, null, 2))
    } catch (error) {
      message.error(error)
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
        partyDatedByDate: {
          id: item?.partyDatedByDate?.id,
          date: item?.partyDatedByDate?.date,
          active: item?.partyDatedByDate?.active,
          slotObject: item?.partyDatedByDate?.slotObject
        },
        slotObject: {
          id: item?.slotObject?.id,
          timeStart: item?.slotObject?.timeStart,
          timeEnd: item?.slotObject?.timeEnd,
          validTimeRange: false,
          active: false
        }
      })
    })

    return (
      <ProTable
        columns={[
          { title: 'Slot No.', dataIndex: 'key', key: 'key' },
          { title: 'Start Time', dataIndex: ['slotObject', 'timeStart'], key: 'slotObject.timeStart' },

          { title: 'End Time', dataIndex: ['slotObject', 'timeEnd'], key: 'slotObject.timeEnd' },
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
                    fetchPartyBookingByPartyDateId(recordChild?.partyDatedByDate?.id)
                    setVenue(record)
                    setDrawerBookingVisit(true)
                  },
                  disabled: recordChild?.status ? false : true
                }
              ]
              const menuProps = {
                items
              }
              return (
                <Dropdown menu={menuProps}>
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
      title: 'Status',
      width: '10%',
      dataIndex: 'active',
      render: (_, record) => (record?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>)
    },
    {
      title: 'Empty Slot',
      width: '20%',
      dataIndex: 'emptySlot'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: TableListItem) => {
        const items: MenuProps['items'] = [
          {
            label: 'Edit',
            key: '1',
            icon: <EditOutlined />
          },
          {
            label: 'View detail',
            key: '2',
            icon: <EyeOutlined />
          },
          {
            label: 'View package list',
            key: '3',
            icon: <DropboxOutlined />
          },
          {
            label: 'View theme list',
            key: '4',
            icon: <PrinterOutlined />
          },
          {
            label: 'Add slot',
            key: '5',
            icon: <PlusOutlined />,
            onClick: () => handleOpenDrawer(record)
          }
        ]
        const menuProps = {
          items
        }
        return (
          <Dropdown menu={menuProps}>
            <Button icon={<MoreOutlined />}></Button>
          </Dropdown>
          // <Space>
          //   <Typography.Link onClick={() => null}>Save</Typography.Link>
          //   <Typography.Link onClick={() => null}>Cancel</Typography.Link>
          //   <Popconfirm title='Sure to delete?' onConfirm={() => null}>
          //     <a>Delete</a>
          //   </Popconfirm>
          // </Space>
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
        ></ModalForm>
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
        ></ModalForm>
      )
    },
    {
      key: '4',
      label: 'Order time',
      children: partyBooking?.partyDated?.date + ' ' + partyBooking?.partyDated?.slotObject?.timeStart
    },
    {
      key: '5',
      label: 'Usage Time',
      span: 2,
      children: partyBooking?.partyDated?.date + ' ' + partyBooking?.partyDated?.slotObject?.timeStart
    },
    {
      key: '6',
      label: 'Status',
      span: 3,
      children: (
        <Badge status={partyBooking?.status === 'PENDING' ? 'processing' : 'success'} text={partyBooking?.status} />
      )
    },
    {
      key: '7',
      label: 'Negotiated Amount',
      children: (80000000).toLocaleString()
    },
    {
      key: '8',
      label: 'Discount',
      children: (0).toLocaleString()
    },
    {
      key: '9',
      label: 'Official Receipts',
      children: (80000000).toLocaleString()
    },
    {
      key: '10',
      label: 'Booking Info',
      children: (
        <>
          Name booking: Võ Thanh Duy
          <br />
          Email: duybpz@gmail.com
          <br />
          Phone: 0334416510
          <br />
          Kid Name: Võ Ngọc Nhi
          <br />
          Kid DOB: 2024-03-19
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
        loading={loading}
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
          <Button key='show'>Show</Button>,
          <Button key='out'>
            Download
            <DownOutlined />
          </Button>,
          <Button key='primary' type='primary'>
            Refresh
          </Button>
        ]}
      />
      <DrawerForm
        title='Add slot in venue'
        resize={{
          onResize() {
            console.log('resize!')
          },
          maxWidth: window.innerWidth * 0.8,
          minWidth: 450
        }}
        form={form}
        drawerProps={{
          destroyOnClose: true
        }}
        submitTimeout={2000}
        onFinish={async values => {
          if (venueId !== null) {
            const res = await createOneSlotInVenue({ venue_id: venueId, slot_id: values?.slotId })
            return res
          }
          return true
        }}
        open={drawerVisit}
        onOpenChange={setDrawerVisit}
        disabled={loadingGetSlotNotAdd}
        submitter={{ searchConfig: { submitText: 'Submit', resetText: 'Cancel' } }}
      >
        <Fragment>
          <Typography.Title level={3}>{`Venue ID: ${venueId}`}</Typography.Title>
          {slotNotAddList && slotNotAddList.length > 0 && (
            <ProFormSelect
              width='md'
              options={slotNotAddList.map((item, index) => {
                return {
                  label: `Slot ID: ${item?.id}, start from ${item?.timeStart} to ${item?.timeEnd}`,
                  value: item?.id
                }
              })}
              formItemProps={{
                style: {
                  margin: 0
                }
              }}
              name='slotId'
              label='Slot'
              placeholder={'Please enter'}
            />
          )}
          {loadingGetSlotNotAdd && <Skeleton.Button active={true} size={'default'} shape={'default'} block={false} />}
        </Fragment>
      </DrawerForm>
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
          if (venueId !== null) {
            const res = await createOneSlotInVenue({ venue_id: venueId, slot_id: values?.slotId })
            return res
          }
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
    </Fragment>
  )
}
