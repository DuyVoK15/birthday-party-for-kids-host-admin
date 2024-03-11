import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/AuthContext'
import AppConstants from 'src/enums/app'
import { getRoleFromStorage } from 'src/utils/storage'

export default function isAdmin(Component: any) {
  return function IsAdmin(props: any) {
    const router = useRouter()
    const role = getRoleFromStorage()
    const { loading, setLoading } = useAuthContext()

    useEffect(() => {
      if (role !== 'ADMIN') {
        setLoading(true)
        router.push('/401')
      }
    }, [])

    if (role !== 'ADMIN') {
      setLoading(false)
      return null
    }

    return <Component {...props} />
  }
}
