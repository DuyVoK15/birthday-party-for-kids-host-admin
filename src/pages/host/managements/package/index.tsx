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
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  UploadFile,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { useAppDispatch } from 'src/app/store'
import {
  createPackage,
  deletePackage,
  getAllPackage,
  getPackageById,
  updatePackage
} from 'src/features/action/package.action'
import { useAppSelector } from 'src/app/hooks'
import { PackageCreateRequest, PackageUpdateRequest } from 'src/dtos/request/package.request'
import { useRouter } from 'next/router'
import { getAllService } from 'src/features/action/service.action'
import { PackageDataResponse, PackageServiceDataResponse } from 'src/dtos/response/package.response'
import PackageDetail from 'src/views/host/managements/package/PackageDetail'
import { SERVICE_ENUM } from 'src/enums/service'

interface Item extends PackageDataResponse {
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
    dataIndex === 'packageImgUrl' ? (
      <Upload maxCount={1}>
        <Button icon={<PlusOutlined />}>Click to Upload</Button>
      </Upload>
    ) : dataIndex === 'pricing' ? (
      <InputNumber />
    ) : dataIndex === 'packageType' ? (
      <Select
        defaultValue={record?.packageType}
        options={[
          { label: 'Decoration', value: SERVICE_ENUM.DECORATION },
          { label: 'Food', value: SERVICE_ENUM.FOOD }
        ]}
      />
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

const Package: React.FC = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [formModal] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')
  const [serviceDataList, setServiceDataList] = useState<any[]>([])
  const isEditing = (record: Item) => record.key === editingKey
  const isRemoving = (record: Item) => record.key === removingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ packageName: '', packageImgUrl: '', packageType: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (record: Item) => {
    try {
      const row = (await form.validateFields()) as Item
      console.log(row)
      const imageBinary: any = row?.packageImgUrl

      if (row) {
        await updateOnePackage({
          id: record?.id,
          payload: {
            packageName: row?.packageName,
            fileImage: imageBinary?.file?.originFileObj,
            packageDescription: row?.packageDescription
          }
        }).then(() => {
          setEditingKey('')
        })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const createOne = async (payload: PackageCreateRequest) => {
    try {
      const isCloseModal = await createOnePackage(payload)
      return isCloseModal
    } catch (errInfo) {
      console.log('Error', errInfo)
      message.error(errInfo)
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
      dataIndex: 'key',
      width: '7%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'packageName',
      width: '15%',
      editable: true
    },
    {
      title: 'Pricing',
      dataIndex: 'pricing',
      width: '15%',
      editable: false
    },
    {
      title: 'Is Active',
      dataIndex: 'active',
      width: '13%',
      editable: false,
      render: (_: any, record: Item) =>
        record?.active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>
    },
    {
      title: 'Type',
      dataIndex: 'packageType',
      width: '13%',
      editable: false
    },
    {
      title: 'Image',
      dataIndex: 'packageImgUrl',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => {
        return (
          <Image style={{ borderRadius: 5, objectFit: 'cover' }} width={200} height={100} src={record?.packageImgUrl} />
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        const packageObject: any = record
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
            <ModalForm
              title='Package Detail'
              trigger={
                <Button disabled={editingKey !== ''} type='link'>
                  View
                </Button>
              }
            >
              <PackageDetail packageInVenue={packageObject} />
            </ModalForm>
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

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.packageReducer.loading)
  const packageList = useAppSelector(state => state.packageReducer.packageList)
  const serviceList = useAppSelector(state => state.serviceReducer.serviceList)
  const [packageType, setPackageType] = useState<SERVICE_ENUM | null>(null)
  const [active, setActive] = useState<boolean | null>(null)

  const packageListView: Item[] = []

  const fetchAllPackage = async () => {
    const res = await dispatch(getAllPackage({ filter: { active, packageType } }))
    console.log(JSON.stringify(res, null, 2))
    return res
  }
  const fetchRefreshAllPackage = async () => {
    if (active !== null || packageType !== null) {
      setPackageType(null)
      setActive(null)
    } else {
      fetchAllPackage()
    }
  }

  console.log('Mảng của tôi', packageListView)
  useEffect(() => {
    fetchAllPackage()
  }, [packageType, active])

  useEffect(() => {
    setServiceDataList(serviceList)
  }, [serviceList])

  useEffect(() => {
    fetchAllService()
  }, [])

  useEffect(() => {
    packageList?.map((item: PackageDataResponse, index: number) => {
      packageListView.push({
        key: (index + 1).toString(),
        ...item
      })
    })
    setData(packageListView)
  }, [packageList])
  const fetchAllService = async () => {
    const res = await dispatch(getAllService({}))
    console.log(JSON.stringify(res, null, 2))
    return res
  }

  const createOnePackage = async (payload: PackageCreateRequest) => {
    const res = await dispatch(createPackage(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      await fetchAllPackage()
      message.success('Create package success')
      return true
    }
    message.error(`Error when create package! (${res?.payload?.message})`)
    return false
  }

  const deleteOnePackage = async (id: number) => {
    await dispatch(deletePackage(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllPackage().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Delete package success!')
          }
        })
      }
    })
  }

  const updateOnePackage = async (request: { id: number; payload: PackageUpdateRequest }) => {
    await dispatch(updatePackage({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllPackage()
      }
    })
  }

  const fetchPackageById = async (id: number) => {
    try {
      if (id !== undefined) {
        await dispatch(getPackageById(Number(id))).then(res => {
          router.push(router.pathname + `/${id}`)
        })
      }
    } catch (error) {
      message.error(error)
    }
  }
  const hasDuplicates = (array: any) => {
    return new Set(array).size !== array.length
  }

  return (
    <Form form={form} component={false}>
      <Flex align='center' justify='space-between'>
        <Flex gap={15}>
          <Radio.Group
            onChange={e => setPackageType(e.target.value)}
            value={packageType}
            size='middle'
            optionType='button'
          >
            <Radio value={null}>All</Radio>
            <Radio value={SERVICE_ENUM.DECORATION}>Decor</Radio>
            <Radio value={SERVICE_ENUM.FOOD}>Food</Radio>
          </Radio.Group>
          <Radio.Group
            value={active}
            onChange={e => {
              setActive(e.target.value)
            }}
            size='middle'
          >
            <Radio.Button value={null}>All</Radio.Button>
            <Radio.Button value={true}>Active</Radio.Button>
            <Radio.Button value={false}>Inactive</Radio.Button>
          </Radio.Group>
        </Flex>
        <Flex gap={10}>
          <Button loading={loading} onClick={fetchRefreshAllPackage}>
            Refresh
          </Button>
          <ModalForm
            loading={loading}
            title='Create A New Package'
            trigger={
              <Button type='primary'>
                <PlusOutlined />
                Add new package
              </Button>
            }
            form={formModal}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run')
            }}
            submitTimeout={2000}
            onFinish={async (values: PackageCreateRequest) => {
              console.log(values)
              const serviceIds = values?.packageServiceRequests.map((item: any) => item.serviceId)

              // Kiểm tra nếu có 3 giá trị trùng lặp
              if (hasDuplicates(serviceIds)) {
                message.error('Duplicated service selected, try again!')
              } else {
                // Xử lý logic khi không có lỗi
                // Ví dụ: Gửi dữ liệu đi
                const isCloseModal = createOne({
                  ...values,
                  fileImage: values.fileImage?.[0]?.originFileObj
                })
                return isCloseModal
              }
            }}
            onChange={e => console.log(e)}
            submitter={{
              searchConfig: {
                submitText: 'Submit',
                resetText: 'Cancel'
              }
            }}
          >
            <ProFormRadio.Group
              name='packageType'
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              label='Type'
              options={[
                { label: 'Decoration', value: SERVICE_ENUM.DECORATION },
                { label: 'Food', value: SERVICE_ENUM.FOOD }
              ]}
            />
            <ProFormText
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='packageName'
              label='Name'
              tooltip='Name is ok'
              placeholder='Enter package name'
            />
            <ProFormTextArea
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='packageDescription'
              label='Description'
              placeholder='Enter package description'
            />
            <ProFormList
              name='packageServiceRequests'
              creatorButtonProps={{
                position: 'top',
                creatorButtonText: 'Add new service'
              }}
              creatorRecord={{}}
            >
              <ProForm.Group>
                <ProFormSelect
                  width={'lg'}
                  name='serviceId'
                  label='Service'
                  request={async () =>
                    serviceDataList.map((item: any) => {
                      return {
                        label: `${item?.serviceName} - ${item?.pricing} VND `,
                        value: item?.id
                      }
                    })
                  }
                  placeholder='Please select a service'
                  rules={[{ required: true, message: 'Please select a service!' }]}
                />
                <ProFormDigit
                  width={'sm'}
                  label='Amount'
                  name='count'
                  min={1}
                  max={1000}
                  fieldProps={{ precision: 0 }}
                  placeholder={'0'}
                  rules={[{ required: true, message: 'Please enter count!' }]}
                />
              </ProForm.Group>
            </ProFormList>
            {/* <ProFormCheckbox.Group
            name='packageServiceList'
            layout='vertical'
            label='123'
            options={serviceDataList.map((item: any) => {
              return {
                label: `${item?.serviceName} - ${item?.pricing} VND `,
                value: JSON.stringify({ serviceId: item?.id, count: 1 })
              }
            })}
          /> */}
            <ProFormDigit
              rules={[{ required: true, message: 'Please input this' }]}
              width='md'
              name='percent'
              label='Percent'
              tooltip='Please input this'
              placeholder='Enter percent discount'
              min={0.1}
              max={0.5}
            />
            <ProFormUploadButton
              rules={[{ required: true, message: 'Please input this' }]}
              name='fileImage'
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
          onChange: cancel
        }}
      />
    </Form>
  )
}

export default Package
