import { useRouter } from 'next/router'
import React from 'react'

const BookingInVenue = () => {
  const router = useRouter()
  const { id } = router.query
  console.log(id)
  return <div></div>
}

export default BookingInVenue
