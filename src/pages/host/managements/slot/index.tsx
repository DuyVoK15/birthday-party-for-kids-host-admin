import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Popconfirm, Space, Table, TimePicker, Typography, message } from 'antd'
import { useAppDispatch } from 'src/app/store'
import { createSlot, getAllSlot, updateSlot } from 'src/features/action/slot.action'
import { useAppSelector } from 'src/app/hooks'
import dayjs from 'dayjs'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { ModalForm, ProFormTimePicker } from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'

interface Item {
  key: string
  id: number
  slotNumber: string
  startTime: string
  endTime: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: Item
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
          getValueProps={i => {
            return { value: dayjs(i, 'HH:mm:ss') }
          }}
          getValueFromEvent={onChange => dayjs(onChange?.$d)?.format('HH:mm:ss')}
          initialValue={dayjs('00:00:00', 'HH:mm:ss')}
        >
          <TimePicker />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const App: React.FC = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')

  const isEditing = (record: Item) => record.key === editingKey
  const isRemoving = (record: Item) => record.key === removingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ startTime: '', endTime: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id: number) => {
    try {
      const row = (await form.validateFields()) as Item
      if (row) {
        await updateOneSlot({
          id,
          payload: {
            timeStart: row?.startTime,
            timeEnd: row?.endTime
          }
        }).then(res => {
          if (res) {
            setEditingKey('')
          }
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const removeOne = async (id: number) => {
    try {
      // await deleteOneSlot(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Slot No.',
      dataIndex: 'slotNumber',
      width: '25%',
      editable: false
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      width: '20%',
      editable: true
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      width: '20%',
      editable: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Typography.Link onClick={() => save(record?.id)}>Save</Typography.Link>
            <Typography.Link onClick={() => cancel()}>Cancel</Typography.Link>
            <Popconfirm title='Sure to delete?' onConfirm={() => removeOne(record?.id)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          </Space>
        )
      }
    }
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    console.log(col.dataIndex)
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'slotNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.slotReducer.loading)
  const slotList = useAppSelector(state => state.slotReducer.slotList)
  const slotListView: Item[] = []

  // *** Hook
  const [timeStart, setTimeStart] = useState<any>(null)
  const [timeEnd, setTimeEnd] = useState<any>(null)

  const fetchAllSlot = async () => {
    await dispatch(getAllSlot()).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }
  console.log('Mảng của tôi', slotListView)
  useEffect(() => {
    fetchAllSlot()
  }, [])

  useEffect(() => {
    slotList?.map((slot: any, index: number) => {
      slotListView.push({
        key: index.toString(),
        id: slot?.id,
        slotNumber: (index + 1).toString(),
        startTime: slot?.timeStart || '',
        endTime: slot?.timeEnd || ''
      })
    })
    setData(slotListView)
  }, [slotList])

  const createOneSlot = async (value: any) => {
    await dispatch(createSlot({ timeStart: value?.[0], timeEnd: value?.[1] })).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        message.success('Add slot success!')
        fetchAllSlot()
      } else {
        message.error(res?.payload?.message)
      }
    })
  }

  const updateOneSlot = async (request: { id: number; payload: SlotCreateRequest }) => {
    const res = await dispatch(updateSlot({ id: request?.id, payload: request?.payload }))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllSlot()
      message.success('Update slot success!')
      return true
    } else {
      message.error(res?.payload?.message)
      return false
    }
  }

  return (
    <Form form={form} component={false}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalForm
          title='Add a new slot'
          trigger={
            <Button type='primary'>
              <PlusOutlined />
              Add new slot
            </Button>
          }
          onFinish={async (value: any) => createOneSlot(value.timeRange)}
        >
          <ProFormTimePicker.RangePicker
            name='timeRange'
            label='Select time range'
            rules={[{ required: true, message: 'Please choose a range time!' }]}
          />
        </ModalForm>
      </div>
      <Table
        style={{ marginTop: 10 }}
        loading={loading}
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  )
}

export default App
