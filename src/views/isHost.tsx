import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/AuthContext'
import { getRoleFromStorage } from 'src/utils/storage'

export default function isHost(Component: any) {
  return function IsHost(props: any) {
    const router = useRouter()
    const role = getRoleFromStorage()
    const { loading, setLoading } = useAuthContext()

    useEffect(() => {
      if (role !== 'HOST') {
        setLoading(true)
        router.push('/401')
      }
    }, [])

    if (role !== 'HOST') {
      setLoading(false)
      return null
    }

    return <Component {...props} />
  }
}
