import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Mail, Menu, MessageCircle } from 'lucide-react'

import BrandLogoComponent from '@/components/BrandLogo'
import HeaderBrandLogo from '@/components/HeaderBrandLogo'
import vetorMasterReverseSvg from '@/assets/vetor-master2-reverse.svg'
import { SectorModal } from '@/components/SectorModal'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigation = [
  { label: 'Início', href: '/#inicio' },
  { label: 'O Método', href: '/#metodo' },
  { label: 'Para seu setor', href: '/setores' },
  { label: 'Soluções', href: '/#solucoes' },
  { label: 'Sobre o Fundador', href: '/#fundador' },
]

const whatsappLink =
  'https://wa.me/?text=Ol%C3%A1%2C%20quero%20come%C3%A7ar%20meu%20Diagn%C3%B3stico%20Estrat%C3%A9gico%20com%20a%20VETOR%20MASTER.'

function HeaderLogo() {
  return (
    <Link className="brand-logo header-logo-wrap" to="/" aria-label="VETOR MASTER — Início">
      {/* Cabeçalho fixo: Logomarca vetorial oficial */}
      <HeaderBrandLogo />
    </Link>
  )
}

function FooterLogo() {
  return (
    <Link className="brand-logo footer-logo-wrap" to="/" aria-label="VETOR MASTER — Início">
      <img
        src={vetorMasterReverseSvg}
        alt="VETOR MASTER — Direção · Conexão · Crescimento"
        loading="eager"
        decoding="async"
        className="footer-logo-svg"
      />
    </Link>
  )
}

function Header({ onOpenSectorModal }: { onOpenSectorModal: () => void }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <HeaderLogo />

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) =>
            isHome && item.href.startsWith('/#') ? (
              <a key={item.href} href={item.href.replace(/^\/#/, '#')}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Button className="header-cta" type="button" onClick={onOpenSectorModal}>
          Comece seu diagnóstico agora
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="mobile-menu-trigger"
              variant="outline"
              size="icon"
              aria-label="Abrir menu"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="mobile-sheet">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <HeaderLogo />
            </SheetHeader>
            <nav className="mobile-nav" aria-label="Navegação em dispositivos móveis">
              {navigation.map((item) =>
                isHome && item.href.startsWith('/#') ? (
                  <SheetClose asChild key={item.href}>
                    <a href={item.href.replace(/^\/#/, '#')}>{item.label}</a>
                  </SheetClose>
                ) : (
                  <SheetClose asChild key={item.href}>
                    <Link to={item.href}>{item.label}</Link>
                  </SheetClose>
                ),
              )}
            </nav>
            <SheetClose asChild>
              <Button className="mobile-sheet-cta" type="button" onClick={onOpenSectorModal}>
                Comece seu diagnóstico agora
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="rodape">
      <div className="site-container footer-grid">
        <div className="footer-brand-column">
          <FooterLogo />
          <p className="footer-slogan">
            Expertise Executiva. Velocidade Tecnológica. Preço Acessível.
          </p>
          <p className="founder-note">
            <strong>João Batista de Paula</strong>
            <span>
              Founder &amp; CEO · 40 anos de liderança traduzidos em código determinístico.
            </span>
          </p>
        </div>

        <div>
          <h2>Navegação</h2>
          <ul className="footer-links">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/#faq">Perguntas Frequentes</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Contato comercial</h2>
          <a className="footer-email" href="mailto:contato.comercial@vetormaster.com.br">
            <Mail aria-hidden="true" />
            <span>contato.comercial@vetormaster.com.br</span>
          </a>
          <Button className="whatsapp-button" asChild>
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" />
              Fale pelo WhatsApp
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div>
          <h2>Cobertura regional</h2>
          <p>
            Atendimento prioritário em São Paulo e Distrito Federal. Demais regiões do Sudeste e
            Sul: sob consulta — retorno em até 5 dias.
          </p>
        </div>
      </div>

      <div className="site-container footer-bottom">
        <p>© {year} VETOR MASTER. Todos os direitos reservados.</p>
        <div className="flex items-center gap-2">
          <Link to="/#privacidade">Privacidade e LGPD</Link>
          <span aria-hidden="true">•</span>
          <span id="privacidade">Seus dados tratados com transparência.</span>
          <span aria-hidden="true">•</span>
          <Link
            to="/leads"
            className="text-xs text-gray-400 hover:text-white transition-colors"
            title="Acesso restrito da equipe executiva"
          >
            Área interna
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [sectorModalOpen, setSectorModalOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <div className={`preloader ${loading ? 'is-loading' : 'is-complete'}`} aria-hidden={!loading}>
        <div className="preloader-mark">
          {/* Logo 5 Oficial Principal no Preloader */}
          <BrandLogoComponent variant="logo5" className="preloader-logo-svg" />
        </div>
        <span>INTELIGÊNCIA EXECUTIVA DETERMINÍSTICA</span>
      </div>
      <Header onOpenSectorModal={() => setSectorModalOpen(true)} />
      <main>{children}</main>
      <Footer />
      <SectorModal
        open={sectorModalOpen}
        onOpenChange={setSectorModalOpen}
        title="Comece seu diagnóstico agora"
        description="Selecione o setor da sua empresa para preencher o Questionário Estratégico direcionado às alavancas da sua operação."
      />
    </>
  )
}
