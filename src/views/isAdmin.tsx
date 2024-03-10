import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import AppConstants from 'src/enums/app'

export default function isAdmin(Component: any) {
  return function IsAdmin(props: any) {
    const router = useRouter()
    const role = typeof window !== 'undefined' ? window.localStorage.getItem(AppConstants.ROLE) : false

    useEffect(() => {
      if (role !== 'ADMIN') {
        router.push('/pages/admin/login')
      }
    }, [])

    if (role !== 'ADMIN') {
      return null
    }

    return <Component {...props} />
  }
}
