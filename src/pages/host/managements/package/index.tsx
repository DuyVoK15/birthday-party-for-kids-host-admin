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
import { PackageCreateRequest } from 'src/dtos/request/package.request'
import { useRouter } from 'next/router'
import { getAllService } from 'src/features/action/service.action'

interface Item {
  key: string
  id: number
  packageNumber: string
  packageName: string
  packageImgUrl: any
  packageDescription: string
  pricing: number
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
    form.setFieldsValue({ packageName: '', packageDescription: '', packageImgUrl: null, pricing: '', ...record })
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
        await updateOnePackage({
          id: record?.id,
          payload: {
            packageName: row?.packageName,
            packageDescription: row?.packageDescription || record?.packageDescription,
            fileImage: row?.packageImgUrl?.file?.originFileObj,
            percent: 1,
            packageServiceRequests: []
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
      dataIndex: 'packageNumber',
      width: '10%',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'packageName',
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
      dataIndex: 'packageImgUrl',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => {
        return <Image style={{ borderRadius: 5 }} width={200} height={100} src={record?.packageImgUrl} />
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
            <Typography.Link onClick={() => fetchPackageById(record?.id)}>View</Typography.Link>
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

  const packageListView: Item[] = []

  const fetchAllPackage = async () => {
    const res = await dispatch(getAllPackage())
    console.log(JSON.stringify(res, null, 2))
    return res
  }
  console.log('Mảng của tôi', packageListView)
  useEffect(() => {
    fetchAllPackage()
  }, [])
  useEffect(() => {
    setServiceDataList(serviceList)
  }, [serviceList])
  useEffect(() => {
    fetchAllService()
  }, [])
  useEffect(() => {
    packageList?.map((item: any, index: number) => {
      packageListView.push({
        key: index.toString(),
        id: item?.id,
        packageNumber: (index + 1).toString(),
        packageName: item?.packageName,
        packageImgUrl: item?.packageImgUrl,
        packageDescription: item?.packageDescription,
        pricing: item?.pricing
      })
    })
    setData(packageListView)
  }, [packageList])
  const fetchAllService = async () => {
    const res = await dispatch(getAllService())
    console.log(JSON.stringify(res, null, 2))
    return res
  }

  const createOnePackage = async (payload: PackageCreateRequest) => {
    let isCloseModal = false
    await dispatch(
      createPackage({
        fileImage: payload.fileImage,
        packageName: payload.packageName,
        packageDescription: payload.packageDescription,
        percent: payload.percent,
        packageServiceRequests: payload.packageServiceRequests
      })
    ).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllPackage().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Create package success!')
            isCloseModal = true
          }
        })
      }
    })
    return isCloseModal
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

  const updateOnePackage = async (request: { id: number; payload: PackageCreateRequest }) => {
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          onFinish={async ({
            name,
            description,
            fileImg,
            percent,
            packageServiceList
          }: {
            name: string
            description: string
            percent: number
            fileImg: UploadFile[]
            packageServiceList: []
          }) => {
            console.log({ name, description, fileImg, packageServiceList, percent })
            const serviceIds = packageServiceList.map((item: any) => item.serviceId)

            // Kiểm tra nếu có 3 giá trị trùng lặp
            if (hasDuplicates(serviceIds)) {
              message.error('Duplicated service selected, try again!')
            } else {
              // Xử lý logic khi không có lỗi
              // Ví dụ: Gửi dữ liệu đi
              const isCloseModal = createOne({
                packageName: name,
                packageDescription: description,
                fileImage: fileImg?.[0]?.originFileObj,
                percent: percent,
                packageServiceRequests: packageServiceList
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
          <ProFormText
            rules={[{ required: true, message: 'Please input this' }]}
            width='md'
            name='name'
            label='Name'
            tooltip='Name is ok'
            placeholder='Enter package name'
          />
          <ProFormTextArea
            rules={[{ required: true, message: 'Please input this' }]}
            width='md'
            name='description'
            label='Description'
            placeholder='Enter package description'
          />
          <ProFormList
            name='packageServiceList'
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

export default Package
