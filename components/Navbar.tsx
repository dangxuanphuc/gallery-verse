import Link from 'next/link'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { MoonSVG, SearchSVG, SunSVG } from '../assets/svg'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [searchValue, setSearchValue] = useState('')

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchValue.length > 0) {
      router.push(`/search/${searchValue.split(' ').join('-')}`)
    }
  }

  useEffect(() => {
    if (router.isReady && router.asPath.includes('/search')) {
      const searchParams = (router.query.q as string).split('-').join(' ')
      setSearchValue(searchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <nav className="navbar">
      <Link href="/" passHref legacyBehavior>
        <a>
          <h1>Gallery Verse</h1>
        </a>
      </Link>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search anything..."
          autoComplete="off"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit">
          <SearchSVG />
        </button>
      </form>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="btn"
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? <MoonSVG key={0} /> : <SunSVG key={1} />}
        </AnimatePresence>
      </motion.button>
    </nav>
  )
}

export default Navbar
