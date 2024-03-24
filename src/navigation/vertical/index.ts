import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import ChatOutline from 'mdi-material-ui/ChatOutline'
import CommentOutline from 'mdi-material-ui/CommentOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import ThemeLightDark from 'mdi-material-ui/ThemeLightDark'
import TimelineClock from 'mdi-material-ui/TimelineClock'
import PackageVariant from 'mdi-material-ui/PackageVariant'
import AccountSupervisorCircle from 'mdi-material-ui/AccountSupervisorCircle'
import LocationEnter from 'mdi-material-ui/LocationEnter'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import AppConstants from 'src/enums/app'
import { PayCircleOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'

const navigation = (): VerticalNavItemsType => {
  const role = typeof window !== 'undefined' ? window.localStorage.getItem(AppConstants.ROLE) : false

  return role === 'HOST'
    ? [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/'
        },
        // {
        //   title: 'Account Settings',
        //   icon: AccountCogOutline,
        //   path: '/host/account-settings'
        // },
        // {
        //   title: 'Chat',
        //   icon: ChatOutline,
        //   path: '/host/chats'
        // },
        {
          title: 'Inquiry',
          icon: CommentOutline,
          path: '/host/inquiries'
        },
        // {
        //   sectionTitle: 'Pages'
        // },
        // {
        //   title: 'Login',
        //   icon: Login,
        //   path: '/pages',
        //   openInNewTab: true
        // },
        // {
        //   title: 'Register',
        //   icon: AccountPlusOutline,
        //   path: '/pages/register',
        //   openInNewTab: true
        // },
        // {
        //   title: 'Error',
        //   icon: AlertCircleOutline,
        //   path: '/pages/error',
        //   openInNewTab: true
        // },
        {
          sectionTitle: 'Management'
        },
        // {
        //   title: 'Customer',
        //   icon: FormatLetterCase,
        //   path: '/host/managements/customer'
        // },
        {
          title: 'Venue',
          icon: LocationEnter,
          path: '/host/managements/venue'
        },
        {
          title: 'Slot',
          icon: TimelineClock,
          path: '/host/managements/slot'
        },
        {
          title: 'Service',
          icon: AccountSupervisorCircle,
          path: '/host/managements/service'
        },
        {
          title: 'Package',
          icon: PackageVariant,
          path: '/host/managements/package'
        },
        {
          title: 'Theme',
          icon: ThemeLightDark,
          path: '/host/managements/theme'
        },
        // {
        //   sectionTitle: 'User Interface'
        // },
        // {
        //   title: 'Typography',
        //   icon: FormatLetterCase,
        //   path: '/host/typography'
        // },
        // {
        //   title: 'Icons',
        //   path: '/host/icons',
        //   icon: GoogleCirclesExtended
        // },
        // {
        //   title: 'Cards',
        //   icon: CreditCardOutline,
        //   path: '/host/cards'
        // },
        // {
        //   title: 'Tables',
        //   icon: Table,
        //   path: '/host/tables'
        // },
        // {
        //   icon: CubeOutline,
        //   title: 'Form Layouts',
        //   path: '/host/form-layouts'
        // }
      ]
    : [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/admin/dashboard'
        },
        // {
        //   title: 'Account Settings',
        //   icon: AccountCogOutline,
        //   path: '/admin/account-settings'
        // },
        // {
        //   sectionTitle: 'Pages'
        // },
        // {
        //   title: 'Login',
        //   icon: Login,
        //   path: '/pages',
        //   openInNewTab: true
        // },
        // {
        //   title: 'Register',
        //   icon: AccountPlusOutline,
        //   path: '/pages/register',
        //   openInNewTab: true
        // },
        // {
        //   title: 'Error',
        //   icon: AlertCircleOutline,
        //   path: '/pages/error',
        //   openInNewTab: true
        // },
        {
          sectionTitle: 'Management'
        },
        {
          title: 'Customer',
          icon: UserOutlined,
          path: '/admin/managements/customer'
        },
        {
          title: 'Host',
          icon: UserAddOutlined,
          path: '/admin/managements/host'
        },
        // {
        //   title: 'Slot',
        //   icon: FormatLetterCase,
        //   path: '/admin/managements/slot'
        // },
        {
          title: 'Payment',
          icon: PayCircleOutlined,
          path: '/admin/managements/payment'
        }
      ]
}

export default navigation
