import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/AuthContext'
import { useAppDispatch } from 'src/app/store'
import AppConstants from 'src/enums/app'
import { getUserInfo } from 'src/features/action/auth.action'
import { getRoleFromStorage } from 'src/utils/storage'

export default function withAuth(Component: any) {
  return function IsAuth(props: any) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const auth = typeof window !== 'undefined' ? window.Boolean(localStorage.getItem(AppConstants.ACCESS_TOKEN)) : false
    const role = getRoleFromStorage()
    const { loading, setLoading } = useAuthContext()
    console.log(loading)
    console.log('Vô withAuth')

    useEffect(() => {
      setLoading(true)
      const fetchUserInfo = async () => {
        await dispatch(getUserInfo())
      }
      fetchUserInfo()
      if (!auth && role !== 'HOST' && role !== 'ADMIN') {
        router.push('/pages')
      } else {
        if (role === 'HOST') {
          if (router.pathname.startsWith('/admin/')) {
            setLoading(true)
            router.push('/401')
          }
        }
        if (role === 'ADMIN') {
          if (router.pathname.startsWith('/host/') || router.pathname === '/') {
            setLoading(true)
            router.push('/401')
          }
        }
      }
    }, [])

    if (!auth && role !== 'HOST' && role !== 'ADMIN') {
      setLoading(false)
      return null
    }

    return <Component {...props} />
  }
}
