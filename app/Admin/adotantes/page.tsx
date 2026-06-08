"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import { PersonType } from "@/lib/enums/person-type";
import styles from "./page.module.css";

type AdopterItem = {
  id: number;
  isActive: boolean;
  age?: number | null;
  notes?: string | null;
  email?: string | null;
  phone?: string | null;
  socialNetwork?: string | null;
  personId: number;
  person?: {
    id: number;
    name: string;
    cpfCnpj: string;
    personType?: PersonType;
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
  age: string;
  email: string;
  phone: string;
  socialNetwork: string;
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
  age: "",
  email: "",
  phone: "",
  socialNetwork: "",
  notes: "",
};

export default function AdminAdotantesPage() {
  const [items, setItems] = useState<AdopterItem[]>([]);
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
      const response = await api.get("/adopter/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os adotantes.");
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

  function startEdit(item: AdopterItem) {
    setEditingId(item.id);
    setForm({
      name: item.person?.name ?? "",
      personType: item.person?.personType ?? PersonType.FISICA,
      cpfCnpj: item.person?.cpfCnpj ?? "",
      state: item.person?.address?.state ?? "",
      city: item.person?.address?.city ?? "",
      district: item.person?.address?.district ?? "",
      street: item.person?.address?.street ?? "",
      number: item.person?.address?.number ?? "",
      postalCode: item.person?.address?.postalCode ?? "",
      age: item.age ? String(item.age) : "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      socialNetwork: item.socialNetwork ?? "",
      notes: item.notes ?? "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const payload = {
      person: {
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
      },
      age: form.age ? Number(form.age) : undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      socialNetwork: form.socialNetwork || undefined,
      notes: form.notes || undefined,
    };

    try {
      if (isEditing && editingId) {
        await api.patch(`/adopter/${editingId}`, payload);
        setMessage("Adotante atualizado com sucesso.");
      } else {
        await api.post("/adopter", payload);
        setMessage("Adotante criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar adotante.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este adotante?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/adopter/${id}`);
      setMessage("Adotante removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o adotante.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de Adotante</h1>
          <p>Cadastro dos adotantes com pessoa vinculada, contato, idade, redes sociais e observacoes.</p>
        </div>
        <div className={styles.heroLinks}>
          <Link href="/Admin" className={styles.backLink}>Voltar ao painel</Link>
        </div>
      </section>

      {(message || error) && <div className={message ? styles.successBox : styles.errorBox}>{message || error}</div>}

      <section className={styles.grid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>{isEditing ? "Editar adotante" : "Novo adotante"}</h2>

          <label>Nome</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />

          <label>Tipo de pessoa</label>
          <select value={form.personType} onChange={(e) => setForm((p) => ({ ...p, personType: e.target.value as PersonType }))}>
            <option value={PersonType.FISICA}>FISICA</option>
            <option value={PersonType.JURIDICA}>JURIDICA</option>
          </select>

          <label>CPF/CNPJ</label>
          <input value={form.cpfCnpj} onChange={(e) => setForm((p) => ({ ...p, cpfCnpj: e.target.value }))} required />

          <label>Idade</label>
          <input type="number" min="1" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />

          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />

          <label>Telefone</label>
          <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />

          <label>Rede social</label>
          <input value={form.socialNetwork} onChange={(e) => setForm((p) => ({ ...p, socialNetwork: e.target.value }))} />

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

          <label>Observacoes</label>
          <textarea rows={4} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

          <div className={styles.actions}>
            {isEditing && <button type="button" className={styles.secondaryButton} onClick={resetForm}>Cancelar edicao</button>}
            <button type="submit" className={styles.primaryButton} disabled={submitting}>{submitting ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Cadastrar"}</button>
          </div>
        </form>

        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2>Adotantes cadastrados</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>Atualizar</button>
          </div>

          {loading ? <p>Carregando adotantes...</p> : items.length === 0 ? <p>Nenhum adotante encontrado.</p> : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th><th>Nome</th><th>CPF/CNPJ</th><th>Email</th><th>Telefone</th><th>Idade</th><th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.person?.name ?? "-"}</td>
                      <td>{item.person?.cpfCnpj ?? "-"}</td>
                      <td>{item.email ?? "-"}</td>
                      <td>{item.phone ?? "-"}</td>
                      <td>{item.age ?? "-"}</td>
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

