"use client";
import PrivateRoute from "@/app/Components/PrivateRoute";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type EventItem = {
  id: number;
  isActive: boolean;
  name: string;
  eventDate: string;
  eventType: string;
  notes?: string | null;
  address?: {
    id: number;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    number?: string;
    postalCode?: string;
  };
};

type FormState = {
  name: string;
  eventDate: string;
  eventType: string;
  notes: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  eventDate: "",
  eventType: "",
  notes: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
  isActive: true,
};

export default function AdminEventosPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await api.get("/schedule-event/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os eventos.");
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

  function startEdit(item: EventItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      eventDate: item.eventDate?.split("T")[0] ?? "",
      eventType: item.eventType,
      notes: item.notes ?? "",
      state: item.address?.state ?? "",
      city: item.address?.city ?? "",
      district: item.address?.district ?? "",
      street: item.address?.street ?? "",
      number: item.address?.number ?? "",
      postalCode: item.address?.postalCode ?? "",
      isActive: item.isActive,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const addressResponse = await api.post("/address", {
        countryCode: "BR",
        state: form.state,
        city: form.city,
        district: form.district,
        street: form.street,
        number: form.number,
        postalCode: form.postalCode.replace(/\D/g, "").slice(0, 8),
      });

      if (isEditing && editingId) {
        await api.patch(`/schedule-event/${editingId}`, {
          name: form.name,
          eventDate: form.eventDate,
          eventType: form.eventType,
          notes: form.notes,
          isActive: form.isActive,
          addressId: addressResponse.data.id,
        });
        setMessage("Evento atualizado com sucesso.");
      } else {
        await api.post("/schedule-event", {
          name: form.name,
          eventDate: form.eventDate,
          eventType: form.eventType,
          notes: form.notes,
          isActive: form.isActive,
          addressId: addressResponse.data.id,
        });
        setMessage("Evento criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar evento.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este evento?")) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/schedule-event/${id}`);
      setMessage("Evento removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o evento.");
    }
  }

  return (

      
  <PrivateRoute>
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de Evento</h1>
          <p>Baseada nos campos reais da tabela `schedule_event` e no endereco vinculado.</p>
        </div>
        <div className={styles.heroLinks}>
          <Link href="/Admin" className={styles.backLink}>
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
          <h2>{isEditing ? "Editar evento" : "Novo evento"}</h2>

          <label>Nome</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />

          <label>Data do evento</label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
            required
          />

          <label>Tipo de evento</label>
          <input value={form.eventType} onChange={(e) => setForm((p) => ({ ...p, eventType: e.target.value }))} required />

          <label>Observacoes</label>
          <textarea rows={4} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

          <label>Estado</label>
          <input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} required />

          <label>Cidade</label>
          <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />

          <label>Bairro</label>
          <input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} required />

          <label>Rua</label>
          <input value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} required />

          <label>Numero</label>
          <input value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} />

          <label>CEP</label>
          <input value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} required />

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
            <h2>Eventos cadastrados</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando eventos...</p>
          ) : items.length === 0 ? (
            <p>Nenhum evento encontrado.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Endereco</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.eventDate?.split("T")[0] ?? "-"}</td>
                      <td>{item.eventType}</td>
                      <td>
                        {[item.address?.street, item.address?.number, item.address?.city].filter(Boolean).join(", ") || "-"}
                      </td>
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
  </PrivateRoute>
  );
}
