import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnalyticsConsentBanner from './components/AnalyticsConsentBanner'
import usePageTracking from './hooks/usePageTracking'
import useClarity from './hooks/useClarity'
import usePrivateAdminNavigation from './hooks/usePrivateAdminNavigation'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const PortfolioCaseStudy = lazy(() => import('./pages/PortfolioCaseStudy'))
const PortfolioWorkHistory = lazy(() => import('./pages/PortfolioWorkHistory'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Reviews = lazy(() => import('./pages/Reviews'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const StaffEditorial = lazy(() => import('./pages/StaffEditorial'))

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
      <span className="sr-only">Loading page</span>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppInner() {
  usePageTracking()
  useClarity()
  usePrivateAdminNavigation()
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/staff')

  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {!isDashboard && <Navbar />}
      <main id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioCaseStudy />} />
            <Route path="/work-history" element={<PortfolioWorkHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<StaffEditorial />} />
            <Route path="/staff/*" element={<StaffEditorial />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <AnalyticsConsentBanner />}
    </>
  )
}

export default function App() {
  return <AppInner />
}
