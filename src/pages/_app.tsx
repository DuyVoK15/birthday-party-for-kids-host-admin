// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from 'src/app/store'
import { SnackbarProvider } from 'notistack'
import { AuthContextProvider } from 'src/@core/context/AuthContext'
import { ConfigProvider } from 'antd'
import en_US from 'antd/locale/en_US'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <ConfigProvider locale={en_US}>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>{`${themeConfig.templateName} - Birthday Party Booking for Kids`}</title>
              <meta name='description' content={`${themeConfig.templateName} – Birthday Party Booking for Kids`} />
              <meta name='keywords' content='Birthday Party Booking for Kids' />
              <meta name='viewport' content='initial-scale=1, width=device-width' />
            </Head>
            <AuthContextProvider>
              <SettingsProvider>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </AuthContextProvider>
          </CacheProvider>
        </ConfigProvider>
      </SnackbarProvider>
    </Provider>
  )
}

export default App
