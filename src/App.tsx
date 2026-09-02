import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Index from './pages/Index'
import Sectors from './pages/Sectors'
import Questionnaire from './pages/Questionnaire'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setores" element={<Sectors />} />
          <Route path="/questionario" element={<Navigate to="/setores" replace />} />
          <Route path="/questionario/:sectorId" element={<Questionnaire />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
