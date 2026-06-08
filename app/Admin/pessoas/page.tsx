"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type PersonItem = {
  id: number;
  name: string;
  personType: "FISICA" | "JURIDICA";
  cpfCnpj: string;
  addressId: number;
  isActive?: boolean;
};

type AddressOption = {
  id: number;
  state: string;
  city: string;
  street: string;
};

type FormState = {
  name: string;
  personType: "FISICA" | "JURIDICA";
  cpfCnpj: string;
  addressId: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  personType: "FISICA",
  cpfCnpj: "",
  addressId: "",
  isActive: true,
};

export default function AdminPessoasPage() {
  const [items, setItems] = useState<PersonItem[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
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
      const response = await api.get("/person/all");
      setItems(response.data);
    } catch {
      setError("Não foi possivel carregar as pessoas.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAddresses() {
    try {
      const response = await api.get("/address/all");
      setAddresses(response.data);
    } catch {
      setError("Não foi possível carregar os endereços.");
    }
  }

  useEffect(() => {
    loadItems();
    loadAddresses();
  }, []);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: PersonItem) {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      personType: item.personType ?? "FISICA",
      cpfCnpj: item.cpfCnpj ?? "",
      addressId: item.addressId?.toString() ?? "",
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
          personType: form.personType,
          cpfCnpj: form.cpfCnpj,
          addressId: parseInt(form.addressId),
          isActive: form.isActive,
        };

        await api.patch(`/person/${editingId}`, payload);
        setMessage("Pessoa atualizada com sucesso.");
      } else {
        await api.post("/person", {
          name: form.name,
          personType: form.personType,
          cpfCnpj: form.cpfCnpj,
          addressId: parseInt(form.addressId),
          isActive: form.isActive,
        });
        setMessage("Pessoa criada com sucesso.");
      }

      resetForm();
      await loadItems();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(" | ")
          : (backendMessage ?? "Erro ao salvar pessoa."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja remover esta pessoa?")) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/person/${id}`);
      setMessage("Pessoa removida com sucesso.");
      await loadItems();
    } catch {
      setError("Não foi possível remover a pessoa.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>ADM</span>
          <h1>Gestão de pessoas</h1>
          <p>
            Cadastro de pessoas — nome, tipo de pessoa (fisica ou juridica),
            CPF/CNPJ, endereco e status.
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
          <h2>{isEditing ? "Editar pessoa" : "Nova pessoa"}</h2>

          <label>Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            maxLength={255}
          />

          <label>Tipo de Pessoa *</label>
          <select
            value={form.personType}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                personType: e.target.value as "FISICA" | "JURIDICA",
              }))
            }
            required
          >
            <option value="FISICA">Pessoa Fisica</option>
            <option value="JURIDICA">Pessoa Juridica</option>
          </select>

          <label>CPF/CNPJ *</label>
          <input
            type="text"
            value={form.cpfCnpj}
            onChange={(e) =>
              setForm((p) => ({ ...p, cpfCnpj: e.target.value }))
            }
            required
            maxLength={20}
            placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
          />

          <label>Endereco *</label>
          <select
            value={form.addressId}
            onChange={(e) =>
              setForm((p) => ({ ...p, addressId: e.target.value }))
            }
            required
          >
            <option value="">Selecione um endereco</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.city} - {addr.state}
              </option>
            ))}
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
                Cancelar edicao
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
            <h2>Pessoas cadastradas</h2>
            <button
              type="button"
              className={styles.refreshButton}
              onClick={loadItems}
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando pessoas...</p>
          ) : items.length === 0 ? (
            <p>Nenhuma pessoa encontrada.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>CPF/CNPJ</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        {item.personType === "FISICA" ? "Fisica" : "Juridica"}
                      </td>
                      <td>{item.cpfCnpj}</td>
                      <td>{item.isActive ? "Ativo" : "Inativo"}</td>
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
