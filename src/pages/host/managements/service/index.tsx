import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  TimePicker,
  Typography,
  Upload,
  UploadFile
} from 'antd'
import { useAppDispatch } from 'src/app/store'
import { createService, deleteService, getAllService, updateService } from 'src/features/action/service.action'
import { useAppSelector } from 'src/app/hooks'
import dayjs, { Dayjs } from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'

interface Item {
  key: string
  id: number
  serviceNumber: string
  serviceName: string
  serviceImgUrl: string
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
        await updateOneService({
          id,
          payload: {
            timeStart: row?.serviceName,
            timeEnd: row?.serviceImgUrl
          }
        }).then(() => {
          setEditingKey('')
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const removeOne = async (id: number) => {
    try {
      await deleteOneService(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Service No.',
      dataIndex: 'serviceNumber',
      width: '25%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'serviceName',
      width: '20%',
      editable: true
    },
    {
      title: 'Image',
      dataIndex: 'serviceImgUrl',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => {
        return <Image style={{borderRadius: 5}} width={100} src='https://friendshipcakes.com/wp-content/uploads/2022/03/2-4-1.jpg' />
      }
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
            <Typography.Link onClick={() => edit(record)}>View</Typography.Link>
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
        inputType: col.dataIndex === 'serviceNumber' ? 'number' : 'text',
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
    createOneService()
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
  const loading = useAppSelector(state => state.serviceReducer.loading)
  const serviceList = useAppSelector(state => state.serviceReducer.serviceList)
  const serviceListView: Item[] = []

  // *** Hook
  const [timeStart, setTimeStart] = useState<any>(null)
  const [timeEnd, setTimeEnd] = useState<any>(null)

  const fetchAllService = async () => {
    await dispatch(getAllService()).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }
  console.log('Mảng của tôi', serviceListView)
  useEffect(() => {
    fetchAllService()
  }, [])

  useEffect(() => {
    serviceList?.map((pkg: any, index: number) => {
      serviceListView.push({
        key: index.toString(),
        id: 1,
        serviceNumber: (index + 1).toString(),
        serviceName: pkg?.serviceName,
        serviceImgUrl: pkg?.serviceImgUrl
      })
    })
    setData(serviceListView)
  }, [serviceList])

  const createOneService = async () => {
    await dispatch(createService({ timeStart, timeEnd })).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchAllService()
      }
    })
  }

  const deleteOneService = async (id: number) => {
    await dispatch(deleteService(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllService()
      }
    })
  }

  const updateOneService = async (request: { id: number; payload: any }) => {
    await dispatch(updateService({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllService()
      }
    })
  }

  // Format
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Form form={form} component={false}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='primary' onClick={showModal}>
          Add new service
        </Button>
        <Modal
          open={open}
          title='Add new service'
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
          <Form>
            <Form.Item label='serviceName' name={'serviceName'}>
              <Input />
            </Form.Item>
            <Form.Item label='Upload' valuePropName='fileList'>
              <Upload
                type='select'
                listType='picture-card'
                maxCount={1}
                onPreview={(file: UploadFile) => {
                  console.log(file)
                }}
              >
                <button style={{ border: 0, background: 'none' }} type='button'>
                  <PlusOutlined rev={undefined} />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </Form>
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
