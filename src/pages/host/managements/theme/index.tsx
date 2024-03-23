import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  Upload,
  UploadFile,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { useAppDispatch } from 'src/app/store'
import { createTheme, deleteTheme, getAllTheme, updateTheme } from 'src/features/action/theme.action'
import { useAppSelector } from 'src/app/hooks'
import { ThemeCreateRequest } from 'src/dtos/request/theme.request'
import ThemeDetail from 'src/views/host/managements/theme/ThemeDetail';

interface Item {
  key: string
  id: number
  themeNumber: string
  themeName: string
  themeImgUrl: any
  themeDescription: string
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
    dataIndex === 'themeImgUrl' ? (
      <Upload maxCount={1}>
        <Button icon={<PlusOutlined />}>Click to Upload</Button>
      </Upload>
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

const Theme: React.FC = () => {
  const [form] = Form.useForm()
  const [formModal] = Form.useForm()
  const [data, setData] = useState<Item[]>([])
  const [editingKey, setEditingKey] = useState('')
  const [removingKey, setRemovingKey] = useState('')

  const isEditing = (record: Item) => record.key === editingKey
  const isRemoving = (record: Item) => record.key === removingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ themeName: '', themeDescription: '', themeImgUrl: null, ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id: number) => {
    try {
      const row = (await form.validateFields()) as Item
      console.log(row)
      if (row) {
        await updateOneTheme({
          id,
          payload: {
            themeName: row?.themeName,
            themeDescription: row?.themeDescription,
            fileImage: row?.themeImgUrl?.file?.originFileObj
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
        return <Image style={{ borderRadius: 5 }} width={200} height={100} src={record?.themeImgUrl} />
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        const theme: any = record
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
            <ModalForm
              title='Theme Detail'
              trigger={
                <Button disabled={editingKey !== ''} type='link'>
                  View
                </Button>
              }
            >
              <ThemeDetail themeInVenue={theme} />
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
        inputType: col.dataIndex === 'themeNumber' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // ** Dispatch API
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.themeReducer.loading)
  const themeList = useAppSelector(state => state.themeReducer.themeList)
  const themeListView: Item[] = []

  const fetchAllTheme = async () => {
    const res = await dispatch(getAllTheme())
    console.log(JSON.stringify(res, null, 2))
    return res
  }
  console.log('Mảng của tôi', themeListView)
  useEffect(() => {
    fetchAllTheme()
  }, [])

  useEffect(() => {
    themeList?.map((item: any, index: number) => {
      themeListView.push({
        key: index.toString(),
        id: item?.id,
        themeNumber: (index + 1).toString(),
        themeName: item?.themeName,
        themeImgUrl: item?.themeImgUrl,
        themeDescription: item?.themeDescription
      })
    })
    setData(themeListView)
  }, [themeList])

  const createOneTheme = async (payload: ThemeCreateRequest) => {
    await dispatch(
      createTheme({
        themeName: payload.themeName,
        themeDescription: payload.themeDescription,
        fileImage: payload.fileImage
      })
    ).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllTheme().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Create theme success!')
          }
        })
      }
    })
  }

  const deleteOneTheme = async (id: number) => {
    await dispatch(deleteTheme(id)).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllTheme().then(res => {
          if (res?.meta?.requestStatus === 'fulfilled') {
            message.success('Delete theme success!')
          }
        })
      }
    })
  }

  const updateOneTheme = async (request: { id: number; payload: ThemeCreateRequest }) => {
    await dispatch(updateTheme({ id: request?.id, payload: request?.payload })).then(async res => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        await fetchAllTheme()
      }
    })
  }

  return (
    <Form form={form} component={false}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalForm
          title='Create A New Theme'
          trigger={
            <Button type='primary'>
              <PlusOutlined />
              Add new theme
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
            fileImg
          }: {
            name: string
            description: string
            fileImg: UploadFile[]
          }) => {
            console.log({ name, description, fileImg })
            createOneTheme({ themeName: name, themeDescription: description, fileImage: fileImg?.[0]?.originFileObj })
            return true
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
            placeholder='Enter theme name'
          />
          <ProFormText
            rules={[{ required: true, message: 'Please input this' }]}
            width='md'
            name='description'
            label='Description'
            placeholder='Enter theme description'
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

export default Theme
