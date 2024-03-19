// pages/[slug].js

import { message } from 'antd'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/app/store'
import { getPackageById } from 'src/features/action/package.action'

function Post() {
  const router = useRouter()
  const { id } = router.query

  // ** Dispatch API
  const dispatch = useAppDispatch()

  const fetchPackageById = async () => {
    try {
      if (id !== undefined) {
        await dispatch(getPackageById(Number(id)))
      }
    } catch (error) {
      message.error(error)
    }
  }

  useEffect(() => {
    fetchPackageById()
  }, [id])

  return <h1>Post: {id}</h1>
}

export default Post
