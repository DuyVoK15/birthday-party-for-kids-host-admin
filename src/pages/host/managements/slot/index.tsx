import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, TimePicker, Typography } from 'antd'
import { useAppDispatch } from 'src/app/store'
import { createSlot, deleteSlot, getAllSlot } from 'src/features/action/slot.action'
import { useAppSelector } from 'src/app/hooks'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

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
        >
          {inputNode}
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
  const remove = (record: Partial<Item> & { key: React.Key }) => {
    setRemovingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item

      const newData = [...data]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const removeOne = async (id: number) => {
    try {
      await deleteOneSlot(id)
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
            <Typography.Link onClick={() => save(record.key)}>Save</Typography.Link>
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

  // ** Modal Display
  const [loadingModal, setLoadingModal] = useState(false)
  const [open, setOpen] = useState(false)

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setLoadingModal(true)
    createOneSlot()
    setTimeStart(null)
    setTimeEnd(null)
    setTimeout(() => {
      setLoadingModal(false)
      setOpen(false)
    }, 1)
  }

  const handleCancel = () => {
    setTimeStart(null)
    setTimeEnd(null)
    setOpen(false)
  }

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

  const createOneSlot = async () => {
    await dispatch(createSlot({ timeStart, timeEnd })).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchAllSlot()
      }
    })
  }

  const deleteOneSlot = async (id: number) => {
    await dispatch(deleteSlot(id)).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchAllSlot()
      }
    })
  }

  return (
    <Form form={form} component={false}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='primary' onClick={showModal}>
          Add new slot
        </Button>
        <Modal
          open={open}
          title='Add new slot'
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key='back' onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key='submit' type='primary' loading={loadingModal} onClick={handleOk}>
              Submit
            </Button>
          ]}
        >
          <TimePicker.RangePicker
            width={'100%'}
            onChange={(dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string]) => {
              setTimeStart(dateStrings?.[0])
              setTimeEnd(dateStrings?.[1])
            }}
            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
          />
        </Modal>
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
        // columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  )
}

export default App
