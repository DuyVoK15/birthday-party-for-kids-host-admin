import React, { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Radio,
  Space,
  Table,
  Typography,
} from 'antd';
import { useAppDispatch } from 'src/app/store'
import { getAllInquiry, replyInquiryById } from 'src/features/action/inquiry.action'
import { useAppSelector } from 'src/app/hooks'

interface Item {
  key: string
  id: number
  inquiryNumber: string
  inquiryQuestion: string
  inquiryReply: string
  status: string
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
  const inputNode =
    dataIndex === 'status' ? (
      <Radio.Group>
        <Radio value='APPROVED'> Approve </Radio>
        <Radio value='REJECTED'> Reject </Radio>
      </Radio.Group>
    ) : (
      <Input />
    )
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
    form.setFieldsValue({ inquiryReply: '', status: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id: number) => {
    try {
      const row = (await form.validateFields()) as Item
      if (row) {
        await updateOneInquiry({
          id,
          payload: {
            inquiryReply: row?.inquiryReply,
            inquiryStatus: row?.status
          }
        }).then(res => {
          setEditingKey('')
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const removeOne = async (id: number) => {
    try {
      // await deleteOneInquiry(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Inquiry No.',
      dataIndex: 'inquiryNumber',
      width: '10%',
      editable: false
    },
    {
      title: 'Question',
      dataIndex: 'inquiryQuestion',
      width: '25%',
      editable: false
    },
    {
      title: 'Reply',
      dataIndex: 'inquiryReply',
      width: '40%',
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      editable: true,
      render: (_: any, record: Item) => {
        return (
          <Badge
            status={record?.status === 'PENDING' ? 'processing' : record?.status === 'APPROVED' ? 'success' : 'error'}
            text={record?.status.charAt(0).toUpperCase() + record?.status.toLowerCase().slice(1)}
          />
        )
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
            {record?.status === 'PENDING' && (
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                Edit
              </Typography.Link>
            )}

            <Typography.Link onClick={() => null}>View</Typography.Link>
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
        inputType: col.dataIndex === 'inquiryNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.inquiryReducer.loading)
  const inquiryList = useAppSelector(state => state.inquiryReducer.inquiryList)
  const inquiryListView: Item[] = []

  // *** Hook
  const [timeStart, setTimeStart] = useState<any>(null)
  const [timeEnd, setTimeEnd] = useState<any>(null)

  const fetchAllInquiry = async () => {
    await dispatch(getAllInquiry()).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }
  console.log('Mảng của tôi', inquiryListView)
  useEffect(() => {
    fetchAllInquiry()
  }, [])

  useEffect(() => {
    inquiryList?.map((inquiry: any, index: number) => {
      inquiryListView.push({
        key: index.toString(),
        id: inquiry?.id,
        inquiryNumber: (index + 1).toString(),
        inquiryQuestion: inquiry?.inquiryQuestion,
        inquiryReply: inquiry?.inquiryReply,
        status: inquiry?.status
      })
    })
    setData(inquiryListView)
  }, [inquiryList])

  // const createOneInquiry = async () => {
  //   await dispatch(createInquiry({ timeStart, timeEnd })).then(res => {
  //     if (res?.meta?.requestStatus === 'fulfilled') {
  //       fetchAllInquiry()
  //     }
  //   })
  // }

  // const deleteOneInquiry = async (id: number) => {
  //   await dispatch(deleteInquiry(id)).then(async res => {
  //     if (res?.meta?.requestStatus === 'fulfilled') {
  //       await fetchAllInquiry()
  //     }
  //   })
  // }

  const updateOneInquiry = async (request: {
    id: number
    payload: { inquiryReply: string; inquiryStatus: string }
  }) => {
    await dispatch(replyInquiryById({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllInquiry()
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
      <Flex justify='flex-end'>
        <Button loading={loading} type='primary' onClick={fetchAllInquiry}>
          Refresh
        </Button>
      </Flex>

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
