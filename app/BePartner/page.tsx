"use client";
import { useState } from "react";
import type { AxiosError } from "axios";
import { api, createPersonWithAddress } from "@/lib/api";

type FormData = {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  partnershipType: string;
  notes: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  cpfCnpj: "",
  partnershipType: "Doacao recorrente",
  notes: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
};

export default function BePartnerPage() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const person = await createPersonWithAddress({
        name: formData.name,
        cpfCnpj: formData.cpfCnpj,
        address: {
          state: formData.state,
          city: formData.city,
          district: formData.district,
          street: formData.street,
          number: formData.number,
          postalCode: formData.postalCode,
        },
      });

      await api.post("/partner", {
        personId: person.id,
        corporateName: formData.name,
        tradeName: formData.name,
        notes: `Tipo: ${formData.partnershipType} | Email: ${formData.email} | Telefone: ${formData.phone} | Observacoes: ${formData.notes}`,
      });

      setFormData(initialForm);
      setSuccessMessage("Interesse enviado com sucesso!");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setErrorMessage(backendMessage.join(" | "));
      } else {
        setErrorMessage(backendMessage ?? (error as Error).message ?? "Erro ao enviar formulario.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Torne-se parceiro</h1>
          <p>
            Ao se tornar parceiro da AnimalPontoCom, sua empresa ou iniciativa contribui
            diretamente para acoes de resgate, cuidado e adocao responsavel.
          </p>

          {successMessage && <p className="text-success">{successMessage}</p>}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="nome">
                Nome ou empresa
              </label>
              <input
                className="form-control"
                id="nome"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <input
                className="form-control"
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="telefone">
                Telefone
              </label>
              <input
                className="form-control"
                id="telefone"
                type="tel"
                required
                maxLength={11}
                value={formData.phone}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const onlyNumbers = e.currentTarget.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phone: onlyNumbers }));
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="cpfCnpj">
                CPF/CNPJ
              </label>
              <input
                className="form-control"
                id="cpfCnpj"
                type="text"
                required
                maxLength={20}
                value={formData.cpfCnpj}
                onChange={(e) => setFormData((prev) => ({ ...prev, cpfCnpj: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="tipo">
                Tipo de parceria
              </label>
              <select
                className="form-select"
                id="tipo"
                value={formData.partnershipType}
                onChange={(e) => setFormData((prev) => ({ ...prev, partnershipType: e.target.value }))}
              >
                <option>Doacao recorrente</option>
                <option>Patrocinio de eventos</option>
                <option>Voluntariado corporativo</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="state">
                Estado
              </label>
              <input
                className="form-control"
                id="state"
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="city">
                Cidade
              </label>
              <input
                className="form-control"
                id="city"
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="district">
                Bairro
              </label>
              <input
                className="form-control"
                id="district"
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="street">
                Rua
              </label>
              <input
                className="form-control"
                id="street"
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="number">
                Numero
              </label>
              <input
                className="form-control"
                id="number"
                type="text"
                value={formData.number}
                onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="postalCode">
                CEP
              </label>
              <input
                className="form-control"
                id="postalCode"
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="notes">
                Observacoes
              </label>
              <textarea
                className="form-control"
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              ></textarea>
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar interesse"}
            </button>
          </form>
        </div>

        <figure className="figure">
          <img
            src="/images/voluntario.png"
            className="figure-img img-fluid rounded"
            alt="Equipe da ONG AnimalPontoCom"
          />
          <figcaption className="figure-caption">
            Parcerias fortalecem o cuidado com animais resgatados.
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
