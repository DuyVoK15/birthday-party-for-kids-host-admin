import { EditOutlined } from '@ant-design/icons'
import { MenuProps, message } from 'antd'
import React from 'react'

const useVenueDropdown = () => {
  const items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: '1',
      icon: <EditOutlined />
    },
    {
      label: 'View detail',
      key: '2',
      icon: <EditOutlined />
    },
    {
      label: 'Add slot',
      key: '3',
      icon: <EditOutlined />
    },
    {
      label: 'Delete',
      key: '4',
      icon: <EditOutlined />,
      danger: true
    }
  ]
  const menuProps = {
    items,
    onClick: null
  }

  const props = { menuProps }

  const handler = {}

  return { props }
}

export default useVenueDropdown
