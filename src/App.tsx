import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Index from './pages/Index'
import Sectors from './pages/Sectors'
import Questionnaire from './pages/Questionnaire'
import Leads from './pages/Leads'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '')
      // Pequeno timeout para garantir que o DOM da rota destino já renderizou
      const timer = window.setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 80)
      return () => window.clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash])

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
          <Route path="/leads" element={<Leads />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
