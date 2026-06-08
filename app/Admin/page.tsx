"use client";
import PrivateRoute from "@/app/Components/PrivateRoute";
import Link from "next/link";
import styles from "./page.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

const adminSections = [
  { label: "Gestão de Usuário", href: "/Admin/usuarios" },
  { label: "Gestão de Evento", href: "/Admin/eventos" },
  { label: "Gestão de Voluntário", href: "/Admin/voluntarios" },
  { label: "Gestão de Pessoas", href: "/Admin/pessoas" },
  { label: "Gestão de Endereços", href: "/Admin/enderecos" },
  { label: "Gestão de Animal", href: "/Admin/animais" },
  { label: "Gestão de Parceiro", href: "/Admin/parceiros" },
  { label: "Gestão de Adotante", href: "/Admin/adotantes" },
  { label: "Gestão de Doações", href: "/Admin/doacoes" },
];

const quickStats = [
  { label: "Módulos ativos", value: "9" },
  { label: "Fluxos integrados", value: "9" },
  { label: "Base operacional", value: "100%" },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/Admin/login");
  };

  return (
    <PrivateRoute>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Painel ADM</span>
            <h1>Centro de controle da operação</h1>
            <p>Bem-vindo, {user?.email || "Administrador"}!</p>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </div>

          <div className={styles.statsGrid}>
            {quickStats.map((item) => (
              <article key={item.label} className={styles.statCard}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Áreas de gestão</h2>
            <p>
              Escolha o módulo desejado para administrar os dados do sistema.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {adminSections.map((section, index) => (
              <article
                key={`${section.label}-${index}`}
                className={styles.card}
              >
                <span className={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{section.label}</h3>
                <p>
                  Acesso para visualizar, cadastrar, editar e acompanhar
                  registros ligados a este módulo.
                </p>
                <Link className={styles.cardButton} href={section.href}>
                  Abrir módulo
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PrivateRoute>
  );
}
