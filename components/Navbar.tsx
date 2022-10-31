import Link from 'next/link'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { MoonSVG, SunSVG } from '../assets/svg'

const Navbar = () => {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="navbar">
      <Link href="/" passHref legacyBehavior>
        <a>
          <h1>Gallery Verse</h1>
        </a>
      </Link>
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
