import React, { useEffect, useState } from 'react'
import { Badge, Button, Flex, Form, Input, Popconfirm, Radio, Space, Table, Typography } from 'antd'
import { useAppDispatch } from 'src/app/store'
import { getAllReview, updateReview } from 'src/features/action/review.action'
import { useAppSelector } from 'src/app/hooks'
import { ReviewDataResponse } from 'src/dtos/response/review.response'

interface Item extends ReviewDataResponse {
  key: string
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
    form.setFieldsValue({ replyMessage: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id: number) => {
    try {
      const row = (await form.validateFields()) as Item
      if (row) {
        await updateOneReview({
          id,
          payload: {
            replyMessage: row?.replyMessage
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
      // await deleteOneReview(id)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Error', errInfo)
    }
  }

  const columns = [
    {
      title: 'Review No.',
      dataIndex: 'key',
      width: '10%',
      editable: false
    },
    {
      title: 'Question',
      dataIndex: 'reviewMessage',
      width: '25%',
      editable: false
    },
    {
      title: 'Rate',
      dataIndex: 'rating',
      width: '10%',
      editable: false
    },
    {
      title: 'Reply',
      dataIndex: 'replyMessage',
      width: '40%',
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
            {/* <Popconfirm title='Sure to delete?' onConfirm={() => removeOne(record?.id)}>
              <a>Delete</a>
            </Popconfirm> */}
          </Space>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>

            {/* <Typography.Link onClick={() => null}>View</Typography.Link> */}
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
        inputType: col.dataIndex === 'reviewNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.reviewReducer.loading)
  const reviewList = useAppSelector(state => state.reviewReducer.reviewList)
  const reviewListView: Item[] = []

  // *** Hook

  const fetchAllReview = async () => {
    await dispatch(getAllReview({})).then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
  }

  console.log('Mảng của tôi', reviewListView)
  useEffect(() => {
    fetchAllReview()
  }, [])

  useEffect(() => {
    reviewList?.map((review: ReviewDataResponse, index: number) => {
      reviewListView.push({
        key: (index + 1).toString(),
        ...review
      })
    })
    setData(reviewListView)
  }, [reviewList])

  // const createOneReview = async () => {
  //   await dispatch(createReview({ timeStart, timeEnd })).then(res => {
  //     if (res?.meta?.requestStatus === 'fulfilled') {
  //       fetchAllReview()
  //     }
  //   })
  // }

  // const deleteOneReview = async (id: number) => {
  //   await dispatch(deleteReview(id)).then(async res => {
  //     if (res?.meta?.requestStatus === 'fulfilled') {
  //       await fetchAllReview()
  //     }
  //   })
  // }

  const updateOneReview = async (request: { id: number; payload: { replyMessage: string } }) => {
    await dispatch(updateReview(request)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllReview()
      }
    })
  }

  return (
    <Form form={form} component={false}>
      <Flex justify='flex-end'>
        <Button loading={loading} type='primary' onClick={fetchAllReview}>
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
