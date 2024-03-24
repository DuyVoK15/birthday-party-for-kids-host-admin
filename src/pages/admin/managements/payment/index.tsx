import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  UploadFile,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import { useAppDispatch } from 'src/app/store'
import { useAppSelector } from 'src/app/hooks'
import { getAllPayment } from 'src/features/action/payment.action'
import { PaymentDataResponse, PaymentMethodDataResponse } from 'src/dtos/response/payment.response'

interface Item {
  key: string
  id: number
  amount: string
  status: string
  paymentMethod: PaymentMethodDataResponse
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
    dataIndex === 'paymentImgUrl' ? (
      <Upload maxCount={1}>
        <Button icon={<PlusOutlined />}>Click to Upload</Button>
      </Upload>
    ) : dataIndex === 'pricing' ? (
      <InputNumber />
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

const Payment: React.FC = () => {
  const [form] = Form.useForm()
  const [formModal] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')

  const isEditing = (record: Item) => record.key === editingKey
  const isRemoving = (record: Item) => record.key === removingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ paymentName: '', paymentDescription: '', paymentImgUrl: null, pricing: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (record: Item) => {
    try {
      const row = (await form.validateFields()) as Item
      console.log(row)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Payment No.',
      dataIndex: 'key',
      width: '10%',
      editable: false
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '20%',
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => {
        return record?.status === 'SUCCESS' ? <Tag color='success'>Success</Tag> : <Tag color='error'>Failed</Tag>
      }
    },
    {
      title: 'Method',
      dataIndex: ['paymentMethod', 'methodName'],
      width: '30%',
      editable: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Typography.Link onClick={() => save(record)}>Save</Typography.Link>
            <Typography.Link onClick={() => cancel()}>Cancel</Typography.Link>
          </Space>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => null}>
              View
            </Typography.Link>
            {/* <Typography.Link onClick={() => edit(record)}>View</Typography.Link> */}
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
        inputType: col.dataIndex === 'paymentNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.paymentReducer.loading)
  const paymentList = useAppSelector(state => state.paymentReducer.paymentList)
  const paymentListView: Item[] = []

  const fetchAllPayment = async () => {
    const res = await dispatch(getAllPayment())
    console.log(JSON.stringify(res, null, 2))
    return res
  }
  console.log('Mảng của tôi', paymentListView)
  useEffect(() => {
    fetchAllPayment()
  }, [])

  useEffect(() => {
    paymentList?.map((item: PaymentDataResponse, index: number) => {
      paymentListView.push({
        key: index.toString() + 1,
        id: item?.id,
        amount: item?.amount,
        status: item?.status,
        paymentMethod: item?.paymentMethod
      })
    })
    setData(paymentListView)
  }, [paymentList])

  return (
    <Form form={form} component={false}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <ModalForm
          loading={loading}
          title='Create A New Payment'
          trigger={
            <Button type='primary'>
              <PlusOutlined />
              Add new payment
            </Button>
          }
          form={formModal}
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
            pricing
          }: {
            name: string
            description: string
            fileImg: UploadFile[]
            pricing: string
          }) => {
            console.log({ name, description, fileImg, pricing })
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
            tooltip='Name is ok'
            placeholder='Enter payment name'
          />
          <ProFormTextArea
            rules={[{ required: true, message: 'Please input this' }]}
            width='md'
            name='description'
            label='Description'
            placeholder='Enter payment description'
          />
          <ProFormDigit
            width={328}
            rules={[{ required: true, message: 'Please input this' }]}
            name='pricing'
            label='Pricing'
            placeholder='Enter payment pricing'
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
        <Button loading={loading} onClick={() => fetchAllPayment()}>Refresh</Button>
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
          onChange: cancel,
          pageSize: 5
        }}
      />
    </Form>
  )
}

export default Payment
