import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import { TruckRemoveOutline } from 'mdi-material-ui'
import React from 'react'
import { useAppDispatch } from 'src/app/store'
import { Register } from 'src/dtos/request/auth.request'
import { registerAccountForHost } from 'src/features/action/auth.action'

const Host = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const register = async (payload: Register) => {
    const res = await dispatch(registerAccountForHost(payload))
    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success('Register success!')
      return true
    } else {
      message.success('Register failed! Try again!')
      return false
    }
  }
  return (
    <div>
      <ModalForm
        loading={false}
        title='Create A New Account'
        trigger={
          <Button type='primary'>
            <PlusOutlined />
            Add new account
          </Button>
        }
        form={form}
        autoFocusFirstInput
        onFinish={async values => {
          let result = false
          result = await register({
            username: values?.username,
            password: values?.password,
            fullName: values?.fullname,
            email: values?.email,
            phone: values?.phone
          })
          if (result) {
            form.resetFields()
          }
          return result
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
          name='username'
          label='Username'
          placeholder='Enter username'
        />
        <ProFormText
          rules={[{ required: true, message: 'Please input this' }]}
          width='md'
          name='password'
          label='Password'
          placeholder='Enter password'
        />
        <ProFormText
          rules={[{ required: true, message: 'Please input this' }]}
          width='md'
          name='fullname'
          label='Fullname'
          placeholder='Enter fullname'
        />
        <ProFormText
          rules={[{ required: true, message: 'Please input this' }]}
          width='md'
          name='email'
          label='Email'
          placeholder='Enter email'
        />
        <ProFormText
          rules={[{ required: true, message: 'Please input this' }]}
          width='md'
          name='phone'
          label='Phone'
          placeholder='Enter phone'
        />
      </ModalForm>
    </div>
  )
}

export default Host
