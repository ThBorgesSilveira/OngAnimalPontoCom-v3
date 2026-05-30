"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type PartnerItem = {
  id: number;
  isActive: boolean;
  notes?: string | null;
  corporateName?: string | null;
  tradeName?: string | null;
  personId: number;
  person?: {
    id: number;
    name: string;
    cpfCnpj: string;
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
  cpfCnpj: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
  corporateName: string;
  tradeName: string;
  notes: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  cpfCnpj: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
  corporateName: "",
  tradeName: "",
  notes: "",
  isActive: true,
};

const emptyMessage = "Nenhum parceiro encontrado.";

export default function AdminParceirosPage() {
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await api.get("/partner/all");
      setItems(response.data);
    } catch {
      setError("Nao foi possivel carregar os parceiros.");
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

  function startEdit(item: PartnerItem) {
    setEditingId(item.id);
    setForm({
      name: item.person?.name ?? "",
      cpfCnpj: item.person?.cpfCnpj ?? "",
      state: item.person?.address?.state ?? "",
      city: item.person?.address?.city ?? "",
      district: item.person?.address?.district ?? "",
      street: item.person?.address?.street ?? "",
      number: item.person?.address?.number ?? "",
      postalCode: item.person?.address?.postalCode ?? "",
      corporateName: item.corporateName ?? "",
      tradeName: item.tradeName ?? "",
      notes: item.notes ?? "",
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
        await api.patch(`/partner/${editingId}`, {
          person: {
            name: form.name,
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
          corporateName: form.corporateName,
          tradeName: form.tradeName,
          notes: form.notes,
          isActive: form.isActive,
        });
        setMessage("Parceiro atualizado com sucesso.");
      } else {
        await api.post("/partner", {
          person: {
            name: form.name,
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
          corporateName: form.corporateName,
          tradeName: form.tradeName,
          notes: form.notes,
          isActive: form.isActive,
        });
        setMessage("Parceiro criado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(Array.isArray(backendMessage) ? backendMessage.join(" | ") : backendMessage ?? "Erro ao salvar parceiro.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este parceiro?")) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/partner/${id}`);
      setMessage("Parceiro removido com sucesso.");
      await loadItems();
    } catch {
      setError("Nao foi possivel remover o parceiro.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestao de Parceiro</h1>
          <p>
            Baseada nos campos reais da tabela `partner`: pessoa vinculada, nomes corporativos,
            observacoes e status.
          </p>
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
          <h2>{isEditing ? "Editar parceiro" : "Novo parceiro"}</h2>

          <label>Nome da pessoa</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />

          <label>CPF/CNPJ</label>
          <input
            value={form.cpfCnpj}
            onChange={(e) => setForm((p) => ({ ...p, cpfCnpj: e.target.value }))}
            required
          />

          <label>Estado</label>
          <input
            value={form.state}
            onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
            required
          />
          <label>Cidade</label>
          <input
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            required
          />
          <label>Bairro</label>
          <input
            value={form.district}
            onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
            required
          />
          <label>Rua</label>
          <input
            value={form.street}
            onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
            required
          />
          <label>Numero</label>
          <input
            value={form.number}
            onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
          />
          <label>CEP</label>
          <input
            value={form.postalCode}
            onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
            required
          />

          <label>Nome corporativo</label>
          <input value={form.corporateName} onChange={(e) => setForm((p) => ({ ...p, corporateName: e.target.value }))} />

          <label>Nome fantasia</label>
          <input value={form.tradeName} onChange={(e) => setForm((p) => ({ ...p, tradeName: e.target.value }))} />

          <label>Observacoes</label>
          <textarea rows={4} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

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
            <h2>Parceiros cadastrados</h2>
            <button type="button" className={styles.refreshButton} onClick={loadItems}>
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando parceiros...</p>
          ) : items.length === 0 ? (
            <p>{emptyMessage}</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Pessoa</th>
                    <th>CPF/CNPJ</th>
                    <th>Nome fantasia</th>
                    <th>Ativo</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.person?.name ?? "-"}</td>
                      <td>{item.person?.cpfCnpj ?? "-"}</td>
                      <td>{item.tradeName ?? "-"}</td>
                      <td>{item.isActive ? "Sim" : "Nao"}</td>
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
