"use client";
import PrivateRoute from "@/app/Components/PrivateRoute";
import Link from "next/link";
import styles from "./page.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";


const adminSections = [
  { label: "Gestao de usuario", href: "/Admin/usuarios" },
  { label: "Gestao de Evento", href: "/Admin/eventos" },
  { label: "Receber formulario de Adocao e cadastrar/editar pessoa", href: "/Admin/adocoes" },
  { label: "Receber formulario de Parceiro e cadastrar/editar pessoa", href: "/Admin/parcerias" },
  { label: "Gestao de Voluntario", href: "/Admin/voluntarios" },
  { label: "Gestao de Pessoas", href: "/Admin/pessoas" },
  { label: "Gestao de Enderecos", href: "/Admin/enderecos" },
  { label: "Gestao de Animal", href: "/Admin/animais" },
  { label: "Gestao de Adotante", href: "/Admin/adotantes" },
  { label: "Gestao de Doacoes", href: "/Admin/doacoes" },
];

const quickStats = [
  { label: "Modulos ativos", value: "11" },
<<<<<<< HEAD
  { label: "Fluxos integrados", value: "3" },
=======
  { label: "Fluxos integrados", value: "3" },
>>>>>>> 5bf16ef0bb4f421e1e7e5ad542832c629b9cb74e
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
            <h1>Centro de controle da operacao</h1>
            <p>Bem-vindo, {user?.email || "Administrador"}!</p>
            <button onClick={handleLogout} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
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
            <h2>Areas de gestao</h2>
            <p>Escolha o modulo desejado para administrar os dados do sistema.</p>
          </div>

          <div className={styles.cardGrid}>
            {adminSections.map((section, index) => (
              <article key={`${section.label}-${index}`} className={styles.card}>
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{section.label}</h3>
                <p>Acesso para visualizar, cadastrar, editar e acompanhar registros ligados a este modulo.</p>
                <Link className={styles.cardButton} href={section.href}>
                  Abrir modulo
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PrivateRoute>
  );
}