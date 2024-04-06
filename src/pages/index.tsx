// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import { DashBoardDataResponse } from 'src/dtos/response/dashboard.response'
import { useAppDispatch } from 'src/app/store'
import { getDashboard } from 'src/features/action/dashboard.action'
import { useEffect } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { Star } from 'mdi-material-ui'
import Theme from 'src/views/dashboard/Theme'
import Package from 'src/views/dashboard/Package'

const Dashboard = () => {
  const dispatch = useAppDispatch()

  const dashboard = useAppSelector(state => state.dashboardReducer.dashboard)

  let newServiceList = dashboard?.serviceList?.slice(0, 100)

  let newThemeList = dashboard?.themeList?.slice(0, 5)

  let newPackageList = dashboard?.apackageList?.slice(0, 5)

  const fetchDashBoard = async () => {
    await dispatch(getDashboard())
  }

  useEffect(() => {
    fetchDashBoard()
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TotalEarning />
        </Grid> */}
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$25.6k'
                icon={<Poll />}
                color='success'
                trendNumber='+42%'
                title='Total Profit'
                subtitle='Weekly Profit'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={dashboard?.partyCancellationRate.toString() ?? '0'}
                title='Cancelled Booking Rate'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={dashboard?.averageValueOfOrders.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                title='Average Of Booking'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={dashboard?.averageRate.toString() + ' stars' ?? '0' + ' stars'}
                color='warning'
                title='Average Rating Rate'
                icon={<Star />}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <Theme newArr={newThemeList} />
        </Grid> */}
        <Grid item xs={6} md={6} lg={4}>
          <Package newArr={newPackageList} />
        </Grid>
        <Grid item xs={6} md={6} lg={4}>
          <SalesByCountries newArr={newServiceList} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
