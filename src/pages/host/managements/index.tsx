import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Management = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/404')
  }, [])
  return <div></div>
}

export default Management
