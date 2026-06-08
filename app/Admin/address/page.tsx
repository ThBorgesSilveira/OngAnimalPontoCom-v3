"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Address {
  id: number;
  countryCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number?: string;
  complement?: string;
  postalCode: string;
}

interface Person {
  id: number;
  name: string;
  personType: "FISICA" | "JURIDICA";
  cpfCnpj: string;
  isActive: boolean;
  addressId: number;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<"address" | "person">("address");
  
  const [addressForm, setAddressForm] = useState({
    countryCode: "BR",
    state: "",
    city: "",
    district: "",
    street: "",
    number: "",
    complement: "",
    postalCode: "",
  });

  const [personForm, setPersonForm] = useState({
    name: "",
    personType: "FISICA" as "FISICA" | "JURIDICA",
    cpfCnpj: "",
    isActive: true,
    addressId: "",
  });

  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    loadAddresses();
    loadPeople();
  }, []);

  async function loadAddresses() {
    try {
      const resp = await api.get("/address/all");
      setAddresses(resp.data || []);
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
    }
  }

  async function loadPeople() {
    try {
      const resp = await api.get("/person/all");
      setPeople(resp.data || []);
    } catch (err) {
      console.error("Erro ao carregar pessoas:", err);
    }
  }

  function handleAddressChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setAddressForm((s) => ({ ...s, [name]: value }));
  }

  function handlePersonChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "isActive") {
      setPersonForm((s) => ({ ...s, isActive: value === "true" }));
    } else {
      setPersonForm((s) => ({ ...s, [name]: value }));
    }
  }

  function resetAddressForm() {
    setAddressForm({
      countryCode: "BR",
      state: "",
      city: "",
      district: "",
      street: "",
      number: "",
      complement: "",
      postalCode: "",
    });
    setEditingAddressId(null);
  }

  function resetPersonForm() {
    setPersonForm({
      name: "",
      personType: "FISICA",
      cpfCnpj: "",
      isActive: true,
      addressId: "",
    });
    setEditingPersonId(null);
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        countryCode: addressForm.countryCode || "BR",
        state: addressForm.state,
        city: addressForm.city,
        district: addressForm.district,
        street: addressForm.street,
        number: addressForm.number || undefined,
        complement: addressForm.complement || undefined,
        postalCode: addressForm.postalCode,
      };

      if (editingAddressId) {
        await api.put(`/address/${editingAddressId}`, payload);
        setMessageType("success");
        setMessage("Endereço atualizado com sucesso!");
      } else {
        await api.post("/address", payload);
        setMessageType("success");
        setMessage("Endereço criado com sucesso!");
      }

      resetAddressForm();
      await loadAddresses();
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage(
        err?.response?.data?.message || "Erro ao processar endereço"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePersonSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: personForm.name,
        personType: personForm.personType,
        cpfCnpj: personForm.cpfCnpj,
        isActive: personForm.isActive,
        addressId: parseInt(personForm.addressId as string),
      };

      if (editingPersonId) {
        await api.patch(`/person/${editingPersonId}`, payload);
        setMessageType("success");
        setMessage("Pessoa atualizada com sucesso!");
      } else {
        await api.post("/person", payload);
        setMessageType("success");
        setMessage("Pessoa criada com sucesso!");
      }

      resetPersonForm();
      await loadPeople();
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage(
        err?.response?.data?.message || "Erro ao processar pessoa"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEditAddress(address: Address) {
    setAddressForm({
      countryCode: address.countryCode,
      state: address.state,
      city: address.city,
      district: address.district,
      street: address.street,
      number: address.number || "",
      complement: address.complement || "",
      postalCode: address.postalCode,
    });
    setEditingAddressId(address.id);
    setActiveTab("address");
  }

  function handleEditPerson(person: Person) {
    setPersonForm({
      name: person.name,
      personType: person.personType,
      cpfCnpj: person.cpfCnpj,
      isActive: person.isActive,
      addressId: person.addressId.toString(),
    });
    setEditingPersonId(person.id);
    setActiveTab("person");
  }

  async function handleDeleteAddress(id: number) {
    if (!confirm("Tem certeza que deseja deletar este endereço?")) {
      return;
    }

    try {
      await api.delete(`/address/${id}`);
      setMessageType("success");
      setMessage("Endereço deletado com sucesso!");
      await loadAddresses();
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage(err?.response?.data?.message || "Erro ao deletar endereço");
    }
  }

  async function handleDeletePerson(id: number) {
    if (!confirm("Tem certeza que deseja deletar esta pessoa?")) {
      return;
    }

    try {
      await api.delete(`/person/${id}`);
      setMessageType("success");
      setMessage("Pessoa deletada com sucesso!");
      await loadPeople();
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage(err?.response?.data?.message || "Erro ao deletar pessoa");
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1>Gerenciar Endereços e Pessoas</h1>

      {/* Abas */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => setActiveTab("address")}
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: activeTab === "address" ? "#0066cc" : "#f0f0f0",
            color: activeTab === "address" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Endereços
        </button>
        <button
          onClick={() => setActiveTab("person")}
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: activeTab === "person" ? "#0066cc" : "#f0f0f0",
            color: activeTab === "person" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Pessoas
        </button>
      </div>

      {/* Seção de Endereços */}
      {activeTab === "address" && (
        <>
          {/* Formulário de Endereço */}
          <div style={{ marginBottom: 32, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2>{editingAddressId ? "Editar Endereço" : "Novo Endereço"}</h2>

            <form onSubmit={handleAddressSubmit} style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <label style={{ gridColumn: "1 / -1" }}>
                País
                <select name="countryCode" value={addressForm.countryCode} onChange={handleAddressChange}>
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                </select>
              </label>

              <label>
                Estado
                <input
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  required
                />
              </label>

              <label>
                Cidade
                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />
              </label>

              <label>
                Bairro
                <input
                  name="district"
                  value={addressForm.district}
                  onChange={handleAddressChange}
                  required
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Rua
                <input
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                  required
                />
              </label>

              <label>
                Número
                <input
                  name="number"
                  value={addressForm.number}
                  onChange={handleAddressChange}
                />
              </label>

              <label>
                Complemento
                <input
                  name="complement"
                  value={addressForm.complement}
                  onChange={handleAddressChange}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                CEP
                <input
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleAddressChange}
                  required
                />
              </label>

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
                <button type="submit" disabled={loading}>
                  {loading
                    ? "Enviando..."
                    : editingAddressId
                    ? "Atualizar"
                    : "Criar endereço"}
                </button>
                {editingAddressId && (
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    style={{ backgroundColor: "#666" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {message && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  borderRadius: 4,
                }}
              >
                {message}
              </div>
            )}
          </div>

          {/* Lista de Endereços */}
          <div>
            <h2>Endereços ({addresses.length})</h2>

            {addresses.length === 0 ? (
              <p>Nenhum endereço cadastrado.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: 12,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        {addr.street}, {addr.number || "s/n"}
                      </strong>
                      <br />
                      {addr.complement && (
                        <>
                          {addr.complement}
                          <br />
                        </>
                      )}
                      {addr.district} - {addr.city}, {addr.state} - {addr.postalCode}
                      <br />
                      <small>ID: {addr.id}</small>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleEditAddress(addr)}
                        style={{ backgroundColor: "#0066cc" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ backgroundColor: "#cc0000" }}
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Seção de Pessoas */}
      {activeTab === "person" && (
        <>
          {/* Formulário de Pessoa */}
          <div style={{ marginBottom: 32, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2>{editingPersonId ? "Editar Pessoa" : "Nova Pessoa"}</h2>

            <form onSubmit={handlePersonSubmit} style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <label style={{ gridColumn: "1 / -1" }}>
                Nome
                <input
                  name="name"
                  value={personForm.name}
                  onChange={handlePersonChange}
                  required
                />
              </label>

              <label>
                Tipo de Pessoa
                <select
                  name="personType"
                  value={personForm.personType}
                  onChange={handlePersonChange}
                >
                  <option value="FISICA">Pessoa Física</option>
                  <option value="JURIDICA">Pessoa Jurídica</option>
                </select>
              </label>

              <label>
                CPF / CNPJ
                <input
                  name="cpfCnpj"
                  value={personForm.cpfCnpj}
                  onChange={handlePersonChange}
                  placeholder="Ex: 123.456.789-00"
                  required
                />
              </label>

              <label>
                Endereço
                <select
                  name="addressId"
                  value={personForm.addressId}
                  onChange={handlePersonChange}
                  required
                >
                  <option value="">Selecione um endereço</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.street}, {addr.number || "s/n"} - {addr.city}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Ativo
                <select
                  name="isActive"
                  value={personForm.isActive.toString()}
                  onChange={handlePersonChange}
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </label>

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
                <button type="submit" disabled={loading}>
                  {loading
                    ? "Enviando..."
                    : editingPersonId
                    ? "Atualizar"
                    : "Criar pessoa"}
                </button>
                {editingPersonId && (
                  <button
                    type="button"
                    onClick={resetPersonForm}
                    style={{ backgroundColor: "#666" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {message && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  borderRadius: 4,
                }}
              >
                {message}
              </div>
            )}
          </div>

          {/* Lista de Pessoas */}
          <div>
            <h2>Pessoas ({people.length})</h2>

            {people.length === 0 ? (
              <p>Nenhuma pessoa cadastrada.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {people.map((person) => {
                  const addr = addresses.find((a) => a.id === person.addressId);
                  return (
                    <div
                      key={person.id}
                      style={{
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{person.name}</strong>
                        <br />
                        Tipo: {person.personType === "FISICA" ? "Pessoa Física" : "Pessoa Jurídica"}
                        <br />
                        CPF/CNPJ: {person.cpfCnpj}
                        <br />
                        Endereço: {addr ? `${addr.street}, ${addr.number || "s/n"} - ${addr.city}` : "Endereço não encontrado"}
                        <br />
                        Status: {person.isActive ? "✓ Ativo" : "✗ Inativo"}
                        <br />
                        <small>ID: {person.id}</small>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleEditPerson(person)}
                          style={{ backgroundColor: "#0066cc" }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePerson(person.id)}
                          style={{ backgroundColor: "#cc0000" }}
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        label {
          display: flex;
          flex-direction: column;
          font-weight: 500;
          gap: 4px;
        }

        input, select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background-color: #28a745;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        button:hover {
          opacity: 0.9;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
