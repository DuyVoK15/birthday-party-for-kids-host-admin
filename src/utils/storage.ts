import AppConstants from 'src/enums/app'

export const getRoleFromStorage = () => {
  return typeof window !== 'undefined' ? window.localStorage.getItem(AppConstants.ROLE) : false
}