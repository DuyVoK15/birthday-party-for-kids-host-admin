import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import AppConstants from 'src/enums/app'

export default function isHost(Component: any) {
  return function IsHost(props: any) {
    const router = useRouter()
    const role = typeof window !== 'undefined' ? window.localStorage.getItem(AppConstants.ROLE) : false

    useEffect(() => {
      if (role !== 'HOST') {
        router.push('/pages/host/login')
      }
    }, [])

    if (role !== 'HOST') {
      return null
    }

    return <Component {...props} />
  }
}
