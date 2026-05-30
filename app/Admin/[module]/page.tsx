import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../page.module.css";

type ModuleInfo = {
  title: string;
  description: string;
  nextStep: string;
};

const modules: Record<string, ModuleInfo> = {
  usuarios: {
    title: "Gestao de usuario",
    description: "Controle de acesso, permissões e cadastro de perfis administrativos.",
    nextStep: "Aqui voce pode ligar CRUDs de usuarios, perfis e autenticacao.",
  },
  parceiros: {
    title: "Gestao de Parceiro",
    description: "Lista e manutencao dos parceiros cadastrados na plataforma.",
    nextStep: "Use esta area para listar, editar e revisar parceiros vinculados a pessoas.",
  },
  eventos: {
    title: "Gestao de Evento",
    description: "Cadastro, edicao e consulta de eventos da ONG.",
    nextStep: "Pode conectar com o CRUD de eventos quando ele estiver pronto.",
  },
  adocoes: {
    title: "Receber formulario de Adocao e cadastrar/editar pessoa",
    description: "Central de analise dos formularios vindos do frontend.",
    nextStep: "Ideal para aprovar adocao, revisar pessoa e conferir animal escolhido.",
  },
  parcerias: {
    title: "Receber formulario de Parceiro e cadastrar/editar pessoa",
    description: "Entrada dos pedidos de parceria enviados pelo site.",
    nextStep: "Permite revisar pessoa, empresa e tipo de parceria.",
  },
  voluntarios: {
    title: "Gestao de Voluntario",
    description: "Cadastro e acompanhamento dos voluntarios da ONG.",
    nextStep: "Pode receber aprovacao, status e disponibilidade.",
  },
  pessoas: {
    title: "Gestao de Pessoas",
    description: "Base principal para contatos, adotantes, parceiros e voluntarios.",
    nextStep: "Aqui entram listagem, edição e filtros por tipo de pessoa.",
  },
  enderecos: {
    title: "Gestao de Enderecos",
    description: "Consulta e manutencao dos enderecos vinculados ao sistema.",
    nextStep: "Serve de apoio para pessoas, parceiros e adotantes.",
  },
  animais: {
    title: "Gestao de Animal",
    description: "Cadastro e edicao dos animais da ONG.",
    nextStep: "Pode conectar com fotos, status, porte e historico de resgate.",
  },
  adotantes: {
    title: "Gestao de Adotante",
    description: "Acompanhamento dos adotantes e seus registros de adocao.",
    nextStep: "Pode integrar o fluxo de adocao aprovado.",
  },
  doacoes: {
    title: "Gestao de Doacoes",
    description: "Consulta de doacoes recebidas e acompanhamento financeiro.",
    nextStep: "Ideal para controlar doadores, valores e recorrencia.",
  },
};

export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const info = modules[module];

  if (!info) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Modulo ADM</span>
          <h1>{info.title}</h1>
          <p>{info.description}</p>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <strong>CRUD</strong>
            <span>Pronto para evolucao</span>
          </article>
          <article className={styles.statCard}>
            <strong>Fluxo</strong>
            <span>{info.nextStep}</span>
          </article>
          <article className={styles.statCard}>
            <strong>Voltar</strong>
            <span>Retorne ao painel principal</span>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Atalhos</h2>
          <p>Use estes pontos para voltar ao painel ADM ou seguir para as areas publicas.</p>
        </div>

        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <h3>Voltar ao painel</h3>
            <p>Retorna para a pagina principal de administracao.</p>
            <Link className={styles.cardButton} href="/Admin">
              Abrir painel
            </Link>
          </article>

          <article className={styles.card}>
            <h3>Ir para o site</h3>
            <p>Leva para a pagina inicial publica da ONG.</p>
            <Link className={styles.cardButton} href="/">
              Abrir site
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
