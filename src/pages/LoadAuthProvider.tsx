import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/app/store'
import AppConstants from 'src/enums/app'
import { ROLE_ENUM } from 'src/enums/roles'
import { getUserInfo } from 'src/features/auth.slice'

const LoadAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  // Dispatch
  const dispatch = useAppDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  useEffect(() => {
    const isAuthenticated = Boolean(localStorage.getItem(AppConstants.ACCESS_TOKEN))
    const roleId = localStorage.getItem(AppConstants.ROLE)
    const fetchUserInfo = async () => {
      await dispatch(getUserInfo()).then(res => {
        console.log(JSON.stringify(res, null, 2))
      })
    }

    if (!isAuthenticated) {
      router.push('/pages')
      setIsAuthenticated(true)
    } else {
      fetchUserInfo()
      setIsAuthenticated(false)
    }
  }, [])
  return isAuthenticated !== null  && <React.Fragment>{children}</React.Fragment>
}

export default LoadAuthProvider
