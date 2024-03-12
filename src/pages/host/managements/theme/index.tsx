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
import { createTheme, deleteTheme, getAllTheme, updateTheme } from 'src/features/action/theme.action'
import { useAppSelector } from 'src/app/hooks'
import dayjs, { Dayjs } from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'

interface Item {
  key: string
  id: number
  themeNumber: string
  themeName: string
  themeImgUrl: string
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
        await updateOneTheme({
          id,
          payload: {
            timeStart: row?.themeName,
            timeEnd: row?.themeImgUrl
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
      await deleteOneTheme(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Theme No.',
      dataIndex: 'themeNumber',
      width: '25%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'themeName',
      width: '20%',
      editable: true
    },
    {
      title: 'Image',
      dataIndex: 'themeImgUrl',
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
        inputType: col.dataIndex === 'themeNumber' ? 'number' : 'text',
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
    createOneTheme()
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
  const loading = useAppSelector(state => state.themeReducer.loading)
  const themeList = useAppSelector(state => state.themeReducer.themeList)
  const themeListView: Item[] = []

  // *** Hook
  const [timeStart, setTimeStart] = useState<any>(null)
  const [timeEnd, setTimeEnd] = useState<any>(null)

  const fetchAllTheme = async () => {
    await dispatch(getAllTheme()).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }
  console.log('Mảng của tôi', themeListView)
  useEffect(() => {
    fetchAllTheme()
  }, [])

  useEffect(() => {
    themeList?.map((pkg: any, index: number) => {
      themeListView.push({
        key: index.toString(),
        id: 1,
        themeNumber: (index + 1).toString(),
        themeName: pkg?.themeName,
        themeImgUrl: pkg?.themeImgUrl
      })
    })
    setData(themeListView)
  }, [themeList])

  const createOneTheme = async () => {
    await dispatch(createTheme({ timeStart, timeEnd })).then(res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        fetchAllTheme()
      }
    })
  }

  const deleteOneTheme = async (id: number) => {
    await dispatch(deleteTheme(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllTheme()
      }
    })
  }

  const updateOneTheme = async (request: { id: number; payload: any }) => {
    await dispatch(updateTheme({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllTheme()
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
          Add new theme
        </Button>
        <Modal
          open={open}
          title='Add new theme'
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
            <Form.Item label='themeName' name={'themeName'}>
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
