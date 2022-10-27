import { useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { useRouter } from "next/router"
import nProgress from "nprogress"

import Navbar from "./Navbar"

type LayoutProps = {
  children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', nProgress.start)
    router.events.on('routeChangeComplete', nProgress.done)
    router.events.on('routeChangeError', nProgress.done)

    return () => {
      router.events.off('routeChangeStart', nProgress.start)
      router.events.off('routeChangeComplete', nProgress.done)
      router.events.off('routeChangeError', nProgress.done)
    }
  }, [router])

  return (
    <>
      <main>
        <ThemeProvider attribute="class">
          <Navbar />
          {props.children}
        </ThemeProvider>
      </main>
    </>
  )
}

export default Layout
