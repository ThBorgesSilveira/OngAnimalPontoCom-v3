"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type UserItem = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  isActive: boolean;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN",
  isActive: true,
};

export default function AdminUsuariosPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/user/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: UserItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      password: "",
      role: item.role,
      isActive: item.isActive,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (isEditing && editingId) {
        const payload: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
        };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        await api.patch(`/user/${editingId}`, payload);
        setMessage("Usuário atualizado com sucesso.");
      } else {
        await api.post("/user", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          isActive: form.isActive,
        });
        setMessage("Usuário criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(" | ")
          : (backendMessage ?? "Erro ao salvar usuário."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este usuário?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/user/${id}`);
      setMessage("Usuário removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o usuário.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestão de usuário</h1>
          <p>
            Cadastro dos usuários que acessam o painel administrativo, com nome,
            email, senha, perfil e status.
          </p>
        </div>
        <div className={styles.heroLinks}>
          <Link className={styles.backLink} href="/Admin">
            Voltar ao painel
          </Link>
        </div>
      </section>

      {(message || error) && (
        <div className={message ? styles.successBox : styles.errorBox}>
          {message || error}
        </div>
      )}

      <section className={styles.grid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>{isEditing ? "Editar usuário" : "Novo usuário"}</h2>

          <label>Nome</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />

          <label>{isEditing ? "Nova senha (opcional)" : "Senha"}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            required={!isEditing}
            minLength={6}
          />

          <label>Perfil</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                role: e.target.value as FormState["role"],
              }))
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
            />
            Ativo
          </label>

          <div className={styles.actions}>
            {isEditing && (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetForm}
              >
                Cancelar edição
              </button>
            )}
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={submitting}
            >
              {submitting
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Cadastrar"}
            </button>
          </div>
        </form>

        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2>Usuários cadastrados</h2>
            <button
              type="button"
              className={styles.refreshButton}
              onClick={loadItems}
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando usuários...</p>
          ) : items.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th>Ativo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.isActive ? "Sim" : "Não"}</td>
                      <td className={styles.rowActions}>
                        <button type="button" onClick={() => startEdit(item)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
