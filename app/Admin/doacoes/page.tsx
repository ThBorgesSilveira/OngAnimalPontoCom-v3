"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { api, createPersonWithAddress } from "@/lib/api";
import { PersonType } from "@/lib/enums/person-type";
import styles from "./page.module.css";

type DonationItem = {
  id: number;
  isActive: boolean;
  donationType: string;
  amount: number | string;
  notes?: string | null;
  personId: number;
  person?: {
    id: number;
    name: string;
    cpfCnpj: string;
    personType?: PersonType;
  };
};

type FormState = {
  name: string;
  personType: PersonType;
  cpfCnpj: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
  donationType: string;
  amount: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  personType: PersonType.FISICA,
  cpfCnpj: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
  donationType: "",
  amount: "",
  notes: "",
};

export default function AdminDoacoesPage() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/donation/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar as doacoes.");
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
    setEditingPersonId(null);
  }

  function startEdit(item: DonationItem) {
    setEditingId(item.id);
    setEditingPersonId(item.personId);
    setForm({
      ...initialForm,
      name: item.person?.name ?? "",
      personType: item.person?.personType ?? PersonType.FISICA,
      cpfCnpj: item.person?.cpfCnpj ?? "",
      donationType: item.donationType,
      amount: String(item.amount),
      notes: item.notes ?? "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      let personId = editingPersonId;

      if (!isEditing) {
        const person = await createPersonWithAddress({
          name: form.name,
          personType: form.personType,
          cpfCnpj: form.cpfCnpj,
          address: {
            state: form.state,
            city: form.city,
            district: form.district,
            street: form.street,
            number: form.number,
            postalCode: form.postalCode,
          },
        });
        personId = person.id;
      }

      if (!personId) {
        setError("Pessoa doadora nao encontrada para esta doacao.");
        return;
      }

      const payload = {
        donationType: form.donationType,
        amount: Number(form.amount),
        notes: form.notes || undefined,
        personId,
      };

      if (isEditing && editingId) {
        await api.patch(`/donation/${editingId}`, payload);
        setMessage("Doacao atualizada com sucesso.");
      } else {
        await api.post("/donation", payload);
        setMessage("Doacao criada com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar doacao.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover esta doacao?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/donation/${id}`);
      setMessage("Doacao removida com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover a doacao.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de Doacoes</h1>
          <p>Cadastro das doacoes com tipo, valor, observacoes e pessoa doadora vinculada.</p>
        </div>
        <div className={styles.heroLinks}>
          <Link href="/Admin" className={styles.backLink}>Voltar ao painel</Link>
        </div>
      </section>

      {(message || error) && <div className={message ? styles.successBox : styles.errorBox}>{message || error}</div>}

      <section className={styles.grid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>{isEditing ? "Editar doacao" : "Nova doacao"}</h2>

          <label>Nome do doador</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required={!isEditing} disabled={isEditing} />

          <label>Tipo de pessoa</label>
          <select value={form.personType} onChange={(e) => setForm((p) => ({ ...p, personType: e.target.value as PersonType }))} disabled={isEditing}>
            <option value={PersonType.FISICA}>FISICA</option>
            <option value={PersonType.JURIDICA}>JURIDICA</option>
          </select>

          <label>CPF/CNPJ</label>
          <input value={form.cpfCnpj} onChange={(e) => setForm((p) => ({ ...p, cpfCnpj: e.target.value }))} required={!isEditing} disabled={isEditing} />

          {!isEditing && (
            <>
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
            </>
          )}

          <label>Tipo da doacao</label>
          <input value={form.donationType} onChange={(e) => setForm((p) => ({ ...p, donationType: e.target.value }))} required />

          <label>Valor/quantidade</label>
          <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />

          <label>Observacoes</label>
          <textarea rows={4} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

          <div className={styles.actions}>
            {isEditing && <button type="button" className={styles.secondaryButton} onClick={resetForm}>Cancelar edicao</button>}
            <button type="submit" className={styles.primaryButton} disabled={submitting}>{submitting ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Cadastrar"}</button>
          </div>
        </form>

        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2>Doacoes cadastradas</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>Atualizar</button>
          </div>

          {loading ? <p>Carregando doacoes...</p> : items.length === 0 ? <p>Nenhuma doacao encontrada.</p> : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th><th>Doador</th><th>CPF/CNPJ</th><th>Tipo</th><th>Valor</th><th>Observacoes</th><th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.person?.name ?? "-"}</td>
                      <td>{item.person?.cpfCnpj ?? "-"}</td>
                      <td>{item.donationType}</td>
                      <td>{Number(item.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td>{item.notes ?? "-"}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <button type="button" onClick={() => startEdit(item)}>Editar</button>
                          <button type="button" onClick={() => handleDelete(item.id)}>Remover</button>
                        </div>
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


