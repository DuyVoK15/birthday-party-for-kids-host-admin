import { UploadOutlined } from '@ant-design/icons'
import { ProForm, ProFormGroup, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import { Button, Checkbox, Form, Image, Input, Space, Upload, UploadProps, message } from 'antd'
import React from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import { getAllVenue, getAllVenueCheckSlotByDate, updateVenue } from 'src/features/action/venue.action'

const Venue = () => {
  const dispatch = useAppDispatch()
  const [venueName, setVenueName] = React.useState('')
  const [venueDescription, setVenueDescription] = React.useState('')
  const [street, setStreet] = React.useState('')
  const [ward, setWard] = React.useState('')
  const [district, setDistrict] = React.useState('')
  const [city, setCity] = React.useState('')
  const [venueImgUrl, setImgUrl] = React.useState('')
  const venue = useAppSelector(state => state.venueReducer.venueCheckSlotByDate)

  const [componentDisabled, setComponentDisabled] = React.useState<boolean>(true)

  const fetchMyVenue = async () => {
    const res = await dispatch(getAllVenueCheckSlotByDate())
  }

  React.useEffect(() => {
    fetchMyVenue()
  }, [])
  console.log(venue?.city)

  const updateVenueInfo = async () => {
    const res = await dispatch(updateVenue({ venueName, venueDescription, street, ward, district, city }))
    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success('Update venue success!')
      await fetchMyVenue()
    } else {
      const error = res?.payload?.message
      message.error(error)
    }
  }

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  React.useEffect(() => {
    setVenueName(venue?.venueName ?? '')
    setVenueDescription(venue?.venueDescription ?? '')
    setStreet(venue?.street ?? '')
    setWard(venue?.ward ?? '')
    setDistrict(venue?.district ?? '')
    setCity(venue?.city ?? '')
    setImgUrl(venue?.venueImgUrl ?? '')
  }, [venue])

  return (
    <>
      {/* <Checkbox checked={componentDisabled} onChange={e => setComponentDisabled(e.target.checked)}>
        Edit venue
      </Checkbox> */}

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space direction='vertical'>
          <Input
            name={'venueName'}
            placeholder='Enter venue name'
            defaultValue={venue?.venueName ?? ''}
            value={venueName}
            onChange={e => setVenueName(e.target.value)}
            width={'xl'}
          />
          <Input.TextArea
            name={'venueDescription'}
            placeholder='Enter venue description'
            defaultValue={venue?.venueDescription ?? ''}
            value={venueDescription}
            onChange={e => setVenueDescription(e.target.value)}
          />
          <Image width={250} height={200} src={venueImgUrl} />
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          <Space direction='vertical'>
            <Input
              placeholder='Enter street'
              defaultValue={venue?.street ?? ''}
              value={street}
              onChange={e => setStreet(e.target.value)}
            />
            <Input
              placeholder='Enter ward'
              defaultValue={venue?.ward ?? ''}
              value={ward}
              onChange={e => setWard(e.target.value)}
            />
            <Input
              placeholder='Enter district'
              defaultValue={venue?.district ?? ''}
              value={district}
              onChange={e => setDistrict(e.target.value)}
            />
            <Input
              placeholder='Enter city'
              defaultValue={venue?.city ?? ''}
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </Space>

          <Button onClick={() => updateVenueInfo()} type='primary'>
            Cập nhật
          </Button>
        </Space>
      </div>
    </>
  )
}

export default Venue
