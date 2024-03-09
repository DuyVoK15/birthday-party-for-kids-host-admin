import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import AppConstants from 'src/enums/app'

export default function withAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter()
    const auth = typeof window !== 'undefined' ? window.Boolean(localStorage.getItem(AppConstants.ACCESS_TOKEN)) : false

    useEffect(() => {
      if (!auth) {
        router.push('/pages')
      }
    }, [])

    if (!auth) {
      return null
    }

    return <Component {...props} />
  }
}
