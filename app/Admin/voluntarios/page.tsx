"use client";

import PrivateRoute from "@/app/Components/PrivateRoute";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import { PersonType } from "@/lib/enums/person-type";
import styles from "./page.module.css";

type VolunteerItem = {
  id: number;
  isActive: boolean;
  birthDate?: string | null;
  notes?: string | null;
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
  personType: PersonType;
  birthDate: string;
  name: string;
  cpfCnpj: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
  notes: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  personType: PersonType.FISICA,
  birthDate: "",
  cpfCnpj: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
  notes: "",
  isActive: true,
};

const emptyMessage = "Nenhum voluntário encontrado.";

function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function toIsoDate(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

export default function AdminVoluntariosPage() {
  const [items, setItems] = useState<VolunteerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await api.get("/volunteer/all");
      setItems(response.data);
    } catch {
      setError("Não foi possível carregar os voluntários.");
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

  function startEdit(item: VolunteerItem) {
    setEditingId(item.id);
    const rawDate = item.birthDate ? item.birthDate.slice(0, 10) : "";
    setForm({
      name: item.person?.name ?? "",
      personType: item.person?.personType ?? PersonType.FISICA,
      birthDate: rawDate,
      cpfCnpj: item.person?.cpfCnpj ?? "",
      state: item.person?.address?.state ?? "",
      city: item.person?.address?.city ?? "",
      district: item.person?.address?.district ?? "",
      street: item.person?.address?.street ?? "",
      number: item.person?.address?.number ?? "",
      postalCode: item.person?.address?.postalCode ?? "",
      notes: item.notes ?? "",
      isActive: item.isActive,
    });
  }

  function buildPayload() {
    return {
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
      birthDate: toIsoDate(form.birthDate),
      notes: form.notes || undefined,
      isActive: form.isActive,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (isEditing && editingId) {
        await api.patch(`/volunteer/${editingId}`, buildPayload());
        setMessage("Voluntário atualizado com sucesso.");
      } else {
        await api.post("/volunteer", buildPayload());
        setMessage("Voluntário cadastrado com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(" | ")
          : (backendMessage ?? "Erro ao salvar voluntário."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover este voluntário?")) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/volunteer/${id}`);
      setMessage("Voluntário removido com sucesso.");
      await loadItems();
    } catch {
      setError("Não foi possível remover o voluntário.");
    }
  }

  return (
    <PrivateRoute>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>ADM</span>
            <h1>Gestão de Voluntários</h1>
            <p>
              Cadastro e manutenção de voluntários: pessoa vinculada, data de
              nascimento, observações e status.
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
            <h2>{isEditing ? "Editar voluntário" : "Novo voluntário"}</h2>

            <label>Nome da pessoa</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />

            <label>Tipo de pessoa</label>
            <select
              value={form.personType}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  personType: e.target.value as PersonType,
                }))
              }
            >
              <option value={PersonType.FISICA}>Física</option>
              <option value={PersonType.JURIDICA}>Jurídica</option>
            </select>

            <label>CPF/CNPJ</label>
            <input
              value={form.cpfCnpj}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  cpfCnpj: formatCpfCnpj(e.target.value),
                }))
              }
              placeholder={
                form.personType === PersonType.FISICA
                  ? "000.000.000-00"
                  : "00.000.000/0000-00"
              }
              required
            />

            <label>Data de nascimento</label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, birthDate: e.target.value }))
              }
              required
            />

            <label>Estado</label>
            <input
              value={form.state}
              onChange={(e) =>
                setForm((p) => ({ ...p, state: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((p) => ({ ...p, district: e.target.value }))
              }
              required
            />

            <label>Rua</label>
            <input
              value={form.street}
              onChange={(e) =>
                setForm((p) => ({ ...p, street: e.target.value }))
              }
              required
            />

            <label>Número</label>
            <input
              value={form.number}
              onChange={(e) =>
                setForm((p) => ({ ...p, number: e.target.value }))
              }
            />

            <label>CEP</label>
            <input
              value={form.postalCode}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  postalCode: formatPostalCode(e.target.value),
                }))
              }
              placeholder="00000-000"
              required
            />

            <label>Observações</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
            />

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
              <h2>Voluntários cadastrados</h2>
              <button
                type="button"
                className={styles.refreshButton}
                onClick={loadItems}
              >
                Atualizar
              </button>
            </div>

            {loading ? (
              <p>Carregando voluntários...</p>
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
                      <th>Tipo de pessoa</th>
                      <th>Data de nascimento</th>
                      <th>Ativo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.person?.name ?? "-"}</td>
                        <td>{item.person?.cpfCnpj ?? "-"}</td>
                        <td>{item.person?.personType ?? "-"}</td>
                        <td>
                          {item.birthDate
                            ? new Date(item.birthDate).toLocaleDateString(
                                "pt-BR",
                              )
                            : "-"}
                        </td>
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
    </PrivateRoute>
  );
}
