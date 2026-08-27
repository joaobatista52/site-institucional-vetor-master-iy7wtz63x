import { useEffect, useState, type ReactNode } from 'react'
import { ArrowUpRight, Mail, Menu, MessageCircle } from 'lucide-react'

import BrandLogoComponent from '@/components/BrandLogo'
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
  { label: 'Início', href: '#inicio' },
  { label: 'O Método', href: '#metodo' },
  { label: 'Para seu setor', href: '#setores' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Sobre o Fundador', href: '#fundador' },
]

const whatsappLink =
  'https://wa.me/?text=Ol%C3%A1%2C%20quero%20come%C3%A7ar%20meu%20Diagn%C3%B3stico%20Estrat%C3%A9gico%20com%20a%20VETOR%20MASTER.'

function HeaderLogo() {
  return (
    <a className="brand-logo header-logo-wrap" href="#inicio" aria-label="VETOR MASTER — Início">
      {/* Logo 5 (Oficial Principal: vetor ACIMA do nome) */}
      <BrandLogoComponent variant="stacked" className="header-logo-svg" />
    </a>
  )
}

function FooterLogo() {
  return (
    <a className="brand-logo footer-logo-wrap" href="#inicio" aria-label="VETOR MASTER — Início">
      {/* Logo 5 (Oficial Principal) em versão light no rodapé */}
      <BrandLogoComponent variant="stacked" light className="footer-logo-svg" />
    </a>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <HeaderLogo />

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <Button className="header-cta" asChild>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            Comece seu diagnóstico agora
          </a>
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
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </SheetClose>
              ))}
            </nav>
            <SheetClose asChild>
              <Button className="mobile-sheet-cta" asChild>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Comece seu diagnóstico agora
                </a>
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
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#faq">Perguntas Frequentes</a>
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
        <div>
          <a href="#privacidade">Privacidade e LGPD</a>
          <span aria-hidden="true">•</span>
          <span id="privacidade">Seus dados tratados com transparência.</span>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <div className={`preloader ${loading ? 'is-loading' : 'is-complete'}`} aria-hidden={!loading}>
        <div className="preloader-mark">
          {/* Logo 5 Oficial Principal no Preloader */}
          <BrandLogoComponent variant="stacked" className="preloader-logo-svg" />
        </div>
        <span>INTELIGÊNCIA EXECUTIVA DETERMINÍSTICA</span>
      </div>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
