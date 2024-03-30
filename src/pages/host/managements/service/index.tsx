import React, { useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Space,
  Table,
  Typography,
  Upload,
  UploadFile,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { useAppDispatch } from 'src/app/store'
import { createService, deleteService, getAllService, updateService } from 'src/features/action/service.action'
import { useAppSelector } from 'src/app/hooks'
import { ServiceCreateRequest } from 'src/dtos/request/service.request'
import { SERVICE_ENUM } from 'src/enums/service'
import { ServiceDataResponse } from 'src/dtos/response/service.response'

interface Item extends ServiceDataResponse {
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
    dataIndex === 'serviceImgUrl' ? (
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

const Service: React.FC = () => {
  const [form] = Form.useForm()
  const [formModal] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')

  const isEditing = (record: Item) => record.key === editingKey
  const isRemoving = (record: Item) => record.key === removingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ serviceName: '', serviceDescription: '', serviceImgUrl: null, pricing: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (record: Item) => {
    try {
      const row = (await form.validateFields()) as Item
      console.log(row)
      if (row) {
        await updateOneService({
          id: record?.id,
          payload: {
            serviceName: row?.serviceName,
            serviceDescription: row?.serviceDescription || record?.serviceDescription,
            fileImage: row?.serviceImgUrl?.[0]?.originFileObj,
            pricing: String(row?.pricing),
            serviceType: ''
          }
        }).then(() => {
          setEditingKey('')
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const createOne = async (payload: ServiceCreateRequest) => {
    try {
      const isCloseModal = await createOneService(payload)
      return isCloseModal
    } catch (errInfo) {
      console.log('Error', errInfo)
      message.error(errInfo)
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
      dataIndex: 'key',
      width: '10%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'serviceName',
      width: '20%',
      editable: true
    },
    {
      title: 'Pricing',
      dataIndex: 'pricing',
      width: '20%',
      editable: true
    },
    {
      title: 'Image',
      dataIndex: 'serviceImgUrl',
      width: '30%',
      editable: true,
      render: (_: any, record: Item) => {
        return (
          <Image
            style={{ borderRadius: 5, objectFit: 'cover' }}
            width={'100%'}
            height={200}
            src={record?.serviceImgUrl}
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
            <Typography.Link onClick={() => save(record)}>Save</Typography.Link>
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
        inputType: col.dataIndex === 'serviceNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.serviceReducer.loading)
  const serviceList = useAppSelector(state => state.serviceReducer.serviceList)
  const serviceListView: Item[] = []

  const fetchAllService = async () => {
    const res = await dispatch(getAllService())
    console.log(JSON.stringify(res, null, 2))
    return res
  }
  console.log('Mảng của tôi', serviceListView)
  useEffect(() => {
    fetchAllService()
  }, [])

  useEffect(() => {
    serviceList?.map((item: ServiceDataResponse, index: number) => {
      serviceListView.push({
        key: (index + 1).toString(),
        ...item
      })
    })
    setData(serviceListView)
  }, [serviceList])

  const createOneService = async (payload: ServiceCreateRequest) => {
    let isCloseModal = false
    await dispatch(createService(payload)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllService().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Create service success!')
            form.resetFields()
            isCloseModal = true
          }
        })
      } else {
        message.error(`Error when create service! ${res.payload?.message ?? ''}`)
      }
    })
    return isCloseModal
  }

  const deleteOneService = async (id: number) => {
    await dispatch(deleteService(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllService().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Delete service success!')
          }
        })
      }
    })
  }

  const updateOneService = async (request: { id: number; payload: ServiceCreateRequest }) => {
    await dispatch(updateService({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllService()
      }
    })
  }

  const [type, setType] = useState<SERVICE_ENUM>(SERVICE_ENUM.ALL)

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <Flex justify='space-between'>
          <Radio.Group
            value={type}
            onChange={e => {
              setType(e.target.value)
            }}
            size='middle'
          >
            <Radio.Button value={SERVICE_ENUM.ALL}>All</Radio.Button>
            <Radio.Button value={SERVICE_ENUM.DECORATION}>Decor</Radio.Button>
            <Radio.Button value={SERVICE_ENUM.FOOD}>Food</Radio.Button>
          </Radio.Group>
          <Flex gap={10}>
            <Button loading={loading} onClick={() => fetchAllService()}>
              Refresh
            </Button>
            <ModalForm
              loading={loading}
              title='Create A New Service'
              trigger={
                <Button type='primary'>
                  <PlusOutlined />
                  Add new service
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
                pricing,
                serviceType
              }: {
                name: string
                description: string
                fileImg: UploadFile[]
                pricing: string
                serviceType: string
              }) => {
                console.log({ name, description, fileImg, pricing })
                const isCloseModal = createOne({
                  serviceName: name,
                  serviceDescription: description,
                  fileImage: fileImg?.[0]?.originFileObj,
                  pricing: pricing,
                  serviceType: serviceType
                })
                return isCloseModal
              }}
              submitter={{
                searchConfig: {
                  submitText: 'Submit',
                  resetText: 'Cancel'
                }
              }}
            >
              <ProFormRadio.Group
                rules={[{ required: true, message: 'Please input this' }]}
                name='serviceType'
                label='Service type'
                options={[
                  {
                    label: 'Decoration',
                    value: SERVICE_ENUM.DECORATION
                  },
                  {
                    label: 'Food',
                    value: SERVICE_ENUM.FOOD
                  }
                ]}
              />
              <ProFormText
                rules={[{ required: true, message: 'Please input this' }]}
                width='md'
                name='name'
                label='Name'
                tooltip='Name is ok'
                placeholder='Enter service name'
              />
              <ProFormTextArea
                rules={[{ required: true, message: 'Please input this' }]}
                width='md'
                name='description'
                label='Description'
                placeholder='Enter service description'
              />
              <ProFormDigit
                width={328}
                rules={[{ required: true, message: 'Please input this' }]}
                name='pricing'
                label='Pricing'
                placeholder='Enter service pricing'
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
          </Flex>
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
            onChange: cancel,
            pageSize: 5
          }}
        />
      </Form>
    </React.Fragment>
  )
}

export default Service
