// ** React Imports
import { ReactNode, } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const Page = () => {
  const router = useRouter()
  const handleNavigateToHost = () => {
    router.push('/pages/host/login')
  }
  const handleNavigateToAdmin = () => {
    router.push('/pages/admin/login')
  }
  
  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              AUTHENTICATION
            </Typography>
          </Box>

          <Button fullWidth size='large' variant='outlined' sx={{ marginTop: 5 }} onClick={handleNavigateToHost}>
            Host
          </Button>
          <Button
            fullWidth
            size='large'
            variant='contained'
            sx={{ marginTop: 5, marginBottom: 7 }}
            onClick={handleNavigateToAdmin}
          >
            Admin
          </Button>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

Page.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Page
