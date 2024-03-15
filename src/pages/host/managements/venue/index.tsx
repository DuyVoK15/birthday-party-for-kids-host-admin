import { DownOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { ProForm, ProFormDatePicker, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import dayjs from 'dayjs'
import { Fragment, useEffect, useState } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import { SlotInVenueResponse, VenueResponse } from 'src/dtos/response/venue.response'
import { getAllVenueCheckSlotByDate } from 'src/features/action/venue.action'

export const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD')

export interface TableListItem extends VenueResponse {
  key: string
  emptySlot: number
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: 'Name',
    width: '20%',
    dataIndex: 'venueName'
  },
  {
    title: 'Location',
    width: '20%',
    dataIndex: 'location'
  },
  {
    title: 'Capacity',
    width: '20%',
    dataIndex: 'capacity'
  },
  {
    title: 'Status',
    width: '20%',
    dataIndex: 'active',
    render: (_, record) => (record?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>)
  },
  {
    title: 'Empty Slot',
    width: '20%',
    dataIndex: 'emptySlot'
  }
]

export interface ExpandedRowTable extends SlotInVenueResponse {
  key: string
}
const expandedRowRender = (record: TableListItem) => {
  const data: ExpandedRowTable[] = []

  record?.slotInVenueList?.map((item, index) => {
    data.push({
      key: (index + 1).toString(),
      id: item?.id,
      active: item?.active,
      status: item?.status,
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
          render: (_, record) => (record?.status ? <Tag color='error'>In Use</Tag> : <Tag color='success'>Empty</Tag>)
        },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          valueType: 'option',
          render: () => [<a key='Pause'>Pause</a>, <a key='Stop'>Stop</a>]
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

  // ** ** Hook
  const [data, setData] = useState<TableListItem[]>([])
  const [dateQuery, setDateQuery] = useState(currentDateFormat)

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
        expandable={{ expandedRowRender }}
        search={false}
        dateFormatter='string'
        headerTitle='Venue Management'
        options={false}
        toolBarRender={() => [
          <Button key='show'>Show</Button>,
          <Button key='out'>
            Download
            <DownOutlined rev={undefined} />
          </Button>,
          <Button key='primary' type='primary'>
            Refresh
          </Button>
        ]}
      />
    </Fragment>
  )
}
