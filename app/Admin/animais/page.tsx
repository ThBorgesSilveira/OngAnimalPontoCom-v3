"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type AnimalItem = {
  id: number;
  name: string;
  birthDate?: string;
  size?: string;
  temperament?: string;
  rescueDate?: string;
  notes?: string;
  photoUrl?: string;
  isActive?: boolean;
};

type FormState = {
  name: string;
  birthDate?: string;
  size?: string;
  temperament?: string;
  rescueDate?: string;
  notes?: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  birthDate: "",
  size: "",
  temperament: "",
  rescueDate: "",
  notes: "",
  isActive: true,
};

export default function AdminAnimaisPage() {
  const [items, setItems] = useState<AnimalItem[]>([]);
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
      const response = await api.get("/animal/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os animais.");
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

  function startEdit(item: AnimalItem) {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      birthDate: item.birthDate ?? "",
      size: item.size ?? "",
      temperament: item.temperament ?? "",
      rescueDate: item.rescueDate ?? "",
      notes: item.notes ?? "",
      isActive: item.isActive ?? true,
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
          birthDate: form.birthDate || undefined,
          size: form.size || undefined,
          temperament: form.temperament || undefined,
          rescueDate: form.rescueDate || undefined,
          notes: form.notes || undefined,
          isActive: form.isActive,
        };

        await api.patch(`/animal/${editingId}`, payload);
        setMessage("Animal atualizado com sucesso.");
      } else {
        await api.post("/animal", {
          name: form.name,
          birthDate: form.birthDate || undefined,
          size: form.size || undefined,
          temperament: form.temperament || undefined,
          rescueDate: form.rescueDate || undefined,
          notes: form.notes || undefined,
          isActive: form.isActive,
        });
        setMessage("Animal criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar animal.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este animal?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/animal/${id}`);
      setMessage("Animal removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o animal.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de animais</h1>
          <p>
            Cadastro dos animais da ONG — nome, data de nascimento, tamanho, temperamento,
            data de resgate, notas e status.
          </p>
        </div>
        <div className={styles.heroLinks}>
          <Link className={styles.backLink} href="/Admin">
            Voltar ao painel
          </Link>
        </div>
      </section>

      {(message || error) && (
        <div className={message ? styles.successBox : styles.errorBox}>{message || error}</div>
      )}

      <section className={styles.grid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>{isEditing ? "Editar animal" : "Novo animal"}</h2>

          <label>Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            maxLength={255}
          />

          <label>Data de Nascimento</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
          />

          <label>Tamanho</label>
          <input
            type="text"
            value={form.size}
            onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
            maxLength={50}
            placeholder="Ex: Pequeno, Médio, Grande"
          />

          <label>Temperamento</label>
          <input
            type="text"
            value={form.temperament}
            onChange={(e) => setForm((p) => ({ ...p, temperament: e.target.value }))}
            maxLength={100}
            placeholder="Ex: Dócil, Brincalhão, Calmo"
          />

          <label>Data de Resgate</label>
          <input
            type="date"
            value={form.rescueDate}
            onChange={(e) => setForm((p) => ({ ...p, rescueDate: e.target.value }))}
          />

          <label>Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Informações adicionais sobre o animal"
            className={styles.textarea}
            rows={3}
          />

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Ativo
          </label>

          <div className={styles.actions}>
            {isEditing && (
              <button type="button" className={styles.secondaryButton} onClick={resetForm}>
                Cancelar edicao
              </button>
            )}
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Cadastrar"}
            </button>
          </div>
        </form>

        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2>Animais cadastrados</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando animais...</p>
          ) : items.length === 0 ? (
            <p>Nenhum animal encontrado.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Tamanho</th>
                    <th>Temperamento</th>
                    <th>Dt. Resgate</th>
                    <th>Status</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.size || "-"}</td>
                      <td>{item.temperament || "-"}</td>
                      <td>
                        {item.rescueDate
                          ? new Date(item.rescueDate).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                      <td>{item.isActive ? "Ativo" : "Inativo"}</td>
                      <td className={styles.rowActions}>
                        <button type="button" onClick={() => startEdit(item)}>
                          Editar
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)}>
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
