import { site } from './config/business.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Trust from './components/Trust.jsx'
import Concept from './components/Concept.jsx'
import Gallery from './components/Gallery.jsx'
import Menu from './components/Menu.jsx'
import Experience from './components/Experience.jsx'
import Reviews from './components/Reviews.jsx'
import Access from './components/Access.jsx'
import Faq from './components/Faq.jsx'
import ReservationCTA from './components/ReservationCTA.jsx'
import Footer from './components/Footer.jsx'
import MobileCTA from './components/MobileCTA.jsx'

// __SITE_MODE__ は vite.config.js で 'demo' または 'production' に置き換わります
const isDemo = __SITE_MODE__ !== 'production'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      {isDemo && (
        <div className="demo-bar" role="note" id="top" data-inert-when-menu>
          {site.demoNotice}
        </div>
      )}
      <Navbar />
      <main id="main" data-inert-when-menu>
        {!isDemo && <span id="top" />}
        <Hero />
        <Trust />
        <Concept />
        <Gallery />
        <Menu />
        <Experience />
        <Reviews />
        <Access />
        <Faq />
        <ReservationCTA />
      </main>
      <div data-inert-when-menu>
        <Footer isDemo={isDemo} />
      </div>
      <MobileCTA />
    </>
  )
}
