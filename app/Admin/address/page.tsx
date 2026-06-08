"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type AddressItem = {
  id: number;
  countryCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number?: string;
  complement?: string;
  postalCode: string;
};

type FormState = {
  countryCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number?: string;
  complement?: string;
  postalCode: string;
};

const initialForm: FormState = {
  countryCode: "BR",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  complement: "",
  postalCode: "",
};

export default function AdminAddressPage() {
  const [items, setItems] = useState<AddressItem[]>([]);
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
      const response = await api.get("/address/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os enderecos.");
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

  function startEdit(item: AddressItem) {
    setEditingId(item.id);
    setForm({
      countryCode: item.countryCode ?? "BR",
      state: item.state ?? "",
      city: item.city ?? "",
      district: item.district ?? "",
      street: item.street ?? "",
      number: item.number ?? "",
      complement: item.complement ?? "",
      postalCode: item.postalCode ?? "",
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
          countryCode: form.countryCode,
          state: form.state,
          city: form.city,
          district: form.district,
          street: form.street,
          number: form.number || undefined,
          complement: form.complement || undefined,
          postalCode: form.postalCode,
        };

        await api.put(`/address/${editingId}`, payload);
        setMessage("Endereco atualizado com sucesso.");
      } else {
        await api.post("/address", {
          countryCode: form.countryCode,
          state: form.state,
          city: form.city,
          district: form.district,
          street: form.street,
          number: form.number || undefined,
          complement: form.complement || undefined,
          postalCode: form.postalCode,
        });
        setMessage("Endereco criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar endereco.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este endereco?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/address/${id}`);
      setMessage("Endereco removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o endereco.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de enderecos</h1>
          <p>
            Cadastro de enderecos da ONG — pais, estado, cidade, bairro, rua, numero,
            complemento e CEP.
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
          <h2>{isEditing ? "Editar endereco" : "Novo endereco"}</h2>

          <label>Pais *</label>
          <select
            value={form.countryCode}
            onChange={(e) => setForm((p) => ({ ...p, countryCode: e.target.value }))}
            required
          >
            <option value="BR">Brasil</option>
            <option value="US">Estados Unidos</option>
            <option value="AR">Argentina</option>
            <option value="CL">Chile</option>
            <option value="CO">Colombia</option>
          </select>

          <label>Estado *</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
            required
            maxLength={50}
            placeholder="Ex: Sao Paulo, Rio de Janeiro"
          />

          <label>Cidade *</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            required
            maxLength={100}
            placeholder="Ex: Sao Paulo, Rio de Janeiro"
          />

          <label>Bairro *</label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
            required
            maxLength={100}
            placeholder="Ex: Pinheiros, Centro"
          />

          <label>Rua *</label>
          <input
            type="text"
            value={form.street}
            onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
            required
            maxLength={255}
            placeholder="Ex: Avenida Paulista"
          />

          <label>Numero</label>
          <input
            type="text"
            value={form.number}
            onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
            maxLength={20}
            placeholder="Ex: 100"
          />

          <label>Complemento</label>
          <input
            type="text"
            value={form.complement}
            onChange={(e) => setForm((p) => ({ ...p, complement: e.target.value }))}
            maxLength={100}
            placeholder="Ex: Apto 101, Sala 5"
          />

          <label>CEP *</label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
            required
            maxLength={20}
            placeholder="Ex: 01311-100"
          />

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
            <h2>Enderecos cadastrados</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando enderecos...</p>
          ) : items.length === 0 ? (
            <p>Nenhum endereco encontrado.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rua</th>
                    <th>Numero</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th>CEP</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.street}</td>
                      <td>{item.number || "-"}</td>
                      <td>{item.city}</td>
                      <td>{item.state}</td>
                      <td>{item.postalCode}</td>
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
