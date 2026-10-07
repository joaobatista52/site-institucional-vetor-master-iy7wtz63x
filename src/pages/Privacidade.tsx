import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Mail,
  FileText,
  Lock,
  UserCheck,
  Clock,
  Scale,
  ArrowRight,
  Database,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectorModal } from '@/components/SectorModal'

export default function Privacidade() {
  const [sectorModalOpen, setSectorModalOpen] = useState(false)

  return (
    <div className="metodo-page">
      {/* (a) Título + Data da última atualização no topo */}
      <section className="metodo-hero">
        <div className="site-container">
          <div className="metodo-hero-copy">
            <span className="eyebrow">CONFORMIDADE E TRANSPARÊNCIA</span>
            <h1>Política de Privacidade e LGPD</h1>
            <p className="metodo-hero-tagline">
              Como protegemos suas informações e garantimos a confidencialidade do seu diagnóstico
              estratégico.
            </p>
            <p className="metodo-hero-intro">
              Na VETOR MASTER, tratamos a privacidade e a segurança dos dados da sua empresa com o
              mesmo rigor determinístico aplicado às nossas decisões executivas. Esta política
              descreve com total transparência como coletamos, tratamos, protegemos e armazenamos as
              suas informações, em integral conformidade com a Lei Geral de Proteção de Dados (Lei
              nº 13.709/2018 — LGPD).
            </p>
            <div className="metodo-hero-badges">
              <span>Última atualização: Abril de 2025</span>
              <span>Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
              <span>Canal do Encarregado Ativo</span>
              <span>Criptografia Ponta a Ponta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Institucional em Seções Estruturadas */}
      <section className="section metodo-section bg-white">
        <div className="site-container max-w-4xl mx-auto space-y-12">
          {/* (b) Quem somos e canal do encarregado */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/60 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 text-[#0066CC] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0066CC] tracking-wider uppercase font-heading">
                  1. Controlador dos Dados
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Quem somos e canal do encarregado (DPO)
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                O controlador dos dados pessoais e corporativos tratados nesta plataforma é a{' '}
                <strong>VETOR MASTER</strong>, plataforma pioneira de Inteligência Executiva
                Determinística e diagnósticos de gestão para empresas brasileiras.
              </p>
              <p>
                Para qualquer solicitação, dúvida, esclarecimento ou exercício dos seus direitos
                como titular de dados previstos na legislação, disponibilizamos canal direto com
                nosso Encarregado pelo Tratamento de Dados Pessoais (DPO):
              </p>
              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">
                    Canal Oficial do Encarregado (DPO)
                  </span>
                  <strong className="text-sm sm:text-base text-[#0066CC] font-heading">
                    contato.comercial@vetormaster.com.br
                  </strong>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:contato.comercial@vetormaster.com.br">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar mensagem
                  </a>
                </Button>
              </div>
            </div>
          </article>

          {/* (c) Quais dados coletamos */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#22B14C]/10 text-[#22B14C] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#22B14C] tracking-wider uppercase font-heading">
                  2. Coleta de Informações
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Quais dados coletamos
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
              <p>
                Para viabilizar a elaboração de um diagnóstico com rigor executivo determinístico,
                coletamos exclusivamente as seguintes categorias de dados fornecidas pelo próprio
                usuário:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <li className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-sm mb-1 font-heading">
                    Dados Cadastrais
                  </strong>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Nome completo do respondente, nome/razão social da empresa, e-mail corporativo e
                    número de telefone/WhatsApp de contato.
                  </span>
                </li>
                <li className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-sm mb-1 font-heading">
                    Dados de Perfil da Operação
                  </strong>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Setor econômico de atuação, faixa de faturamento anual estimado, número de
                    colaboradores e estrutura societária.
                  </span>
                </li>
                <li className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-sm mb-1 font-heading">
                    Respostas do Questionário Estratégico
                  </strong>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Informações sobre gargalos operacionais, práticas financeiras, canais de vendas,
                    rotinas de governança e alavancas de crescimento.
                  </span>
                </li>
                <li className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-sm mb-1 font-heading">
                    Documentos Enviados (Anexos Opcionais)
                  </strong>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Demonstrativos financeiros, relatórios gerenciais, certificações e documentos
                    societários (como contrato social) anexados voluntariamente para refino do
                    diagnóstico.
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* (d) Finalidades e base legal */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/60 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 text-[#0066CC] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0066CC] tracking-wider uppercase font-heading">
                  3. Finalidade e Base Legal
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Para que utilizamos seus dados e bases legais
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                Os dados coletados são utilizados <strong>exclusivamente</strong> para os seguintes
                fins:
              </p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Elaboração do Diagnóstico Estratégico:</strong> parametrização das
                    respostas pelo motor determinístico VETOR MASTER e geração do dossiê executivo
                    em até 72 horas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Condução da Devolutiva Executiva:</strong> agendamento e realização da
                    sessão de 45 minutos com um executivo sênior para entrega prática das
                    recomendações.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Comunicação sobre a solicitação:</strong> envio de confirmação de
                    recebimento, status do diagnóstico e links de acesso restrito ao dossiê.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Contato comercial posterior:</strong> exclusivamente quando
                    expressamente autorizado pelo titular ao preencher o formulário ou selecionar
                    planos de serviço.
                  </span>
                </li>
              </ul>
              <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <strong className="text-sm text-[#0066CC] font-heading block mb-1">
                  Bases Legais da LGPD (Art. 7º, incisos I e V)
                </strong>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  O tratamento fundamenta-se na <strong>execução de contrato</strong> e
                  procedimentos preliminares relacionados ao serviço solicitado pelo usuário, bem
                  como no <strong>consentimento</strong> fornecido no momento do envio das
                  informações.
                </p>
              </div>
            </div>
          </article>

          {/* (e) Quem acessa */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#22B14C]/10 text-[#22B14C] flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#22B14C] tracking-wider uppercase font-heading">
                  4. Compartilhamento Restrito
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Quem tem acesso às suas informações
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                O acesso aos seus dados cadastrais, respostas estratégicas e anexos é estritamente
                restrito:
              </p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0066CC] shrink-0 mt-0.5" />
                  <span>
                    <strong>Equipe VETOR MASTER autorizada:</strong> apenas os especialistas e
                    executivos C-level diretamente envolvidos no atendimento, na análise do
                    questionário e na condução da sua devolutiva.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Não comercialização:</strong>{' '}
                    <span className="font-semibold text-[#1F2937]">
                      não vendemos, não alugamos, não cedemos e não compartilhamos
                    </span>{' '}
                    quaisquer dados com terceiros para fins de marketing, publicidade ou prospecção.
                  </span>{' '}
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0066CC] shrink-0 mt-0.5" />
                  <span>
                    <strong>Infraestrutura segura:</strong> os dados trafegam exclusivamente por
                    provedores de computação em nuvem homologados que atendem a padrões
                    internacionais de segurança e contratos rigorosos de confidencialidade.
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* (f) Retenção */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/60 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 text-[#0066CC] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0066CC] tracking-wider uppercase font-heading">
                  5. Retenção e Descarte
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Período de retenção e exclusão
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                Os dados são armazenados pelo período estritamente necessário para o cumprimento do
                atendimento contratado e para o atendimento aos prazos estabelecidos pela legislação
                brasileira aplicável.
              </p>
              <p>
                A qualquer momento, o titular tem o direito de solicitar a{' '}
                <strong>exclusão definitiva</strong> ou a anonimização dos seus dados pessoais e dos
                arquivos enviados, bastando encaminhar uma solicitação ao canal oficial do
                encarregado (
                <a
                  href="mailto:contato.comercial@vetormaster.com.br"
                  className="text-[#0066CC] underline hover:text-[#0052a3]"
                >
                  contato.comercial@vetormaster.com.br
                </a>
                ), ressalvadas as hipóteses legais de guarda obrigatória.
              </p>
            </div>
          </article>

          {/* (g) Segurança */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#22B14C]/10 text-[#22B14C] flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#22B14C] tracking-wider uppercase font-heading">
                  6. Padrões Técnicos
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Segurança da informação e salvaguardas
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                Adotamos medidas técnicas e organizacionais proporcionais e atualizadas para
                proteger suas informações contra acessos não autorizados, vazamento, alteração ou
                perda:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <li className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-xs uppercase tracking-wider mb-1 font-heading">
                    Criptografia
                  </strong>
                  <span className="text-xs text-gray-600">
                    Armazenamento criptografado e transmissão via protocolo seguro HTTPS/TLS.
                  </span>
                </li>
                <li className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-xs uppercase tracking-wider mb-1 font-heading">
                    Controle de Acesso
                  </strong>
                  <span className="text-xs text-gray-600">
                    Acesso restrito por autenticação individualizada e política de menor privilégio.
                  </span>
                </li>
                <li className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <strong className="text-[#0066CC] block text-xs uppercase tracking-wider mb-1 font-heading">
                    Conformidade
                  </strong>
                  <span className="text-xs text-gray-600">
                    Alinhamento com as melhores práticas de governança e padrões de segurança da
                    informação.
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* (h) Seus direitos (LGPD, art. 18) */}
          <article className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/60 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 text-[#0066CC] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0066CC] tracking-wider uppercase font-heading">
                  7. Direitos do Titular
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Seus direitos como titular (LGPD, Art. 18)
                </h2>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
              <p>
                Nos termos do artigo 18 da Lei Geral de Proteção de Dados, você pode solicitar a
                qualquer momento:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-[#0066CC]">I.</span>
                  <span>
                    <strong>Confirmação e Acesso:</strong> saber se tratamos seus dados e solicitar
                    uma cópia integral.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-[#0066CC]">II.</span>
                  <span>
                    <strong>Correção:</strong> atualização de dados incompletos, inexatos ou
                    desatualizados.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-[#0066CC]">III.</span>
                  <span>
                    <strong>Portabilidade:</strong> recebimento dos seus dados em formato
                    estruturado e interoperável.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-[#0066CC]">IV.</span>
                  <span>
                    <strong>Exclusão e Anonimização:</strong> eliminação dos dados tratados com base
                    no seu consentimento.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5 sm:col-span-2">
                  <span className="font-bold text-[#0066CC]">V.</span>
                  <span>
                    <strong>Revogação do Consentimento:</strong> revogação a qualquer tempo, sem
                    afetar a legalidade do tratamento prévio.
                  </span>
                </div>
              </div>
              <p className="pt-2">
                Todos esses direitos são exercíveis de forma gratuita e facilitada mediante contato
                direto pelo canal do encarregado:{' '}
                <a
                  href="mailto:contato.comercial@vetormaster.com.br"
                  className="font-bold text-[#0066CC] hover:underline"
                >
                  contato.comercial@vetormaster.com.br
                </a>
                .
              </p>
            </div>
          </article>

          {/* Chamada para Ação Final da Página */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0066CC]/5 to-[#22B14C]/5 border border-blue-200/60 text-center space-y-4">
            <h3 className="text-xl font-bold text-[#1F2937]">
              Pronto para iniciar seu Diagnóstico Estratégico com total segurança?
            </h3>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Selecione o setor da sua empresa e responda ao Questionário Estratégico. Seus dados
              serão tratados com confidencialidade absoluta.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                className="conversion-button"
                onClick={() => setSectorModalOpen(true)}
              >
                Comece seu diagnóstico agora
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Voltar à Página Inicial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SectorModal
        open={sectorModalOpen}
        onOpenChange={setSectorModalOpen}
        title="Comece seu diagnóstico agora"
        description="Selecione o setor da sua empresa para preencher o Questionário Estratégico direcionado às alavancas da sua operação."
      />
    </div>
  )
}
