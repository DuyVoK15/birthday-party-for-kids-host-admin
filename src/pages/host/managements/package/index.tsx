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
import { createPackage, deletePackage, getAllPackage, updatePackage } from 'src/features/action/package.action'
import { useAppSelector } from 'src/app/hooks'
import dayjs, { Dayjs } from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'

interface Item {
  key: string
  id: number
  packageNumber: string
  packageName: string
  packageImgUrl: string
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
        await updateOnePackage({
          id,
          payload: {
            timeStart: row?.packageName,
            timeEnd: row?.packageImgUrl
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
      await deleteOnePackage(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Package No.',
      dataIndex: 'packageNumber',
      width: '25%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'packageName',
      width: '20%',
      editable: true
    },
    {
      title: 'Image',
      dataIndex: 'packageImgUrl',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => {
        return <Image style={{borderRadius: 5}} width={100} src={record?.packageImgUrl} />
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
        inputType: col.dataIndex === 'packageNumber' ? 'number' : 'text',
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
    createOnePackage()
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
  const loading = useAppSelector(state => state.packageReducer.loading)
  const packageList = useAppSelector(state => state.packageReducer.packageList)
  const packageListView: Item[] = []

  // *** Hook
  const [timeStart, setTimeStart] = useState<any>(null)
  const [timeEnd, setTimeEnd] = useState<any>(null)

  const fetchAllPackage = async () => {
    await dispatch(getAllPackage()).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }
  console.log('Mảng của tôi', packageListView)
  useEffect(() => {
    fetchAllPackage()
  }, [])

  useEffect(() => {
    packageList?.map((pkg: any, index: number) => {
      packageListView.push({
        key: index.toString(),
        id: 1,
        packageNumber: (index + 1).toString(),
        packageName: pkg?.packageName,
        packageImgUrl: pkg?.packageImgUrl
      })
    })
    setData(packageListView)
  }, [packageList])

  const createOnePackage = async () => {
    await dispatch(createPackage({ timeStart, timeEnd })).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchAllPackage()
      }
    })
  }

  const deleteOnePackage = async (id: number) => {
    await dispatch(deletePackage(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllPackage()
      }
    })
  }

  const updateOnePackage = async (request: { id: number; payload: any }) => {
    await dispatch(updatePackage({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllPackage()
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
          Add new package
        </Button>
        <Modal
          open={open}
          title='Add new package'
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
            <Form.Item label='packageName' name={'packageName'}>
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
