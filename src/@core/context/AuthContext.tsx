// contexts/YourContext.tsx
import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  loading: boolean | null
  setLoading: (data: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean | null>(null)

  return <AuthContext.Provider value={{ loading, setLoading }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useYourContext must be used within a YourProvider')
  }
  return context
}
