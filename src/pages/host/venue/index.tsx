import { ProForm, ProFormGroup, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import { Checkbox, Form, Input } from 'antd'
import React from 'react'
import { useAppSelector } from 'src/app/hooks'
import { useAppDispatch } from 'src/app/store'
import { getAllVenue, getAllVenueCheckSlotByDate } from 'src/features/action/venue.action'

const Venue = () => {
  const dispatch = useAppDispatch()

  const venue = useAppSelector(state => state.venueReducer.venueCheckSlotByDate)

  const [componentDisabled, setComponentDisabled] = React.useState<boolean>(true)

  const fetchMyVenue = async () => {
    const res = await dispatch(getAllVenueCheckSlotByDate())
  }

  React.useEffect(() => {
    fetchMyVenue()
  }, [])
  console.log(venue?.city)
  return (
    <>
      <Checkbox checked={componentDisabled} onChange={e => setComponentDisabled(e.target.checked)}>
        Edit venue
      </Checkbox>
      <ProForm
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout='horizontal'
        disabled={componentDisabled}
        style={{ width: '100%' }}
        initialValues={{ venueName: venue?.city }} 
      >
        <ProFormGroup style={{ width: '100%' }}>
          <ProFormText name={'venueName'} label={'Name'} />
          <ProFormTextArea name={'venueDescription'} label={'Description'} />
          <ProFormUploadButton
            name={'venueImgUrl'}
            label={'Image venue'}
            max={1}
            title='Upload'
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              progress: { showInfo: false }
            }}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText name={'street'} />
          <ProFormText name={'ward'} />
          <ProFormText name={'district'} />
          <ProFormText name={'city'} />
        </ProFormGroup>
      </ProForm>
    </>
  )
}

export default Venue
