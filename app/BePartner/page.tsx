"use client";
import { useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";

export enum PartnerType {
  RECURRING_DONATION = "Doação recorrente",
  EVENT_SPONSOR = "Patrocínio de eventos",
  CORPORATE_VOLUNTEERING = "Voluntariado corporativo",
}

export enum PersonType {
  FISICA = "FISICA",
  JURIDICA = "JURIDICA",
}

const partnerTypeOptions = [
  PartnerType.RECURRING_DONATION,
  PartnerType.EVENT_SPONSOR,
  PartnerType.CORPORATE_VOLUNTEERING,
] as const;

const personTypeOptions = [
  { value: PersonType.FISICA, label: "Física" },
  { value: PersonType.JURIDICA, label: "Jurídica" },
] as const;

type PartnerFormData = {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  personType: PersonType;
  partnershipType: PartnerType;
  corporateName: string;
  tradeName: string;
  notes: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
};

const initialForm: PartnerFormData = {
  name: "",
  email: "",
  phone: "",
  cpfCnpj: "",
  personType: PersonType.FISICA,
  partnershipType: PartnerType.RECURRING_DONATION,
  corporateName: "",
  tradeName: "",
  notes: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
};

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function normalizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export default function BePartnerPage() {
  const [formData, setFormData] = useState<PartnerFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/partner", {
        person: {
          name: formData.name.trim(),
          personType: formData.personType,
          cpfCnpj: normalizeDigits(formData.cpfCnpj, 20),
          address: {
            state: formData.state.trim(),
            city: formData.city.trim(),
            district: formData.district.trim(),
            street: formData.street.trim(),
            number: normalizeText(formData.number),
            postalCode: normalizeDigits(formData.postalCode, 8),
          },
        },
        partnershipType: formData.partnershipType,
        corporateName: normalizeText(formData.corporateName),
        tradeName: normalizeText(formData.tradeName),
        notes: normalizeText(
          [
            formData.notes,
            formData.email ? `Email: ${formData.email.trim()}` : "",
            formData.phone ? `Telefone: ${formData.phone.trim()}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
        ),
      });

      setFormData(initialForm);
      setSuccessMessage("Interesse enviado com sucesso!");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setErrorMessage(backendMessage.join(" | "));
      } else {
        setErrorMessage(
          backendMessage ??
            (error as Error).message ??
            "Erro ao enviar formulario.",
        );
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
            Ao se tornar parceiro da AnimalPontoCom, sua empresa ou iniciativa
            contribui diretamente para acoes de resgate, cuidado e adocao
            responsavel.
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="personType">
                Tipo de pessoa
              </label>
              <select
                className="form-select"
                id="personType"
                value={formData.personType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personType: e.target.value as PersonType,
                  }))
                }
              >
                {personTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="corporateName">
                Nome empresarial (opcional)
              </label>
              <input
                className="form-control"
                id="corporateName"
                type="text"
                value={formData.corporateName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    corporateName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="tradeName">
                Nome fantasia (opcional)
              </label>
              <input
                className="form-control"
                id="tradeName"
                type="text"
                value={formData.tradeName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tradeName: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const phone = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    phone,
                  }));
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cpfCnpj: e.target.value }))
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="partnershipType">
                Tipo de parceria
              </label>
              <select
                className="form-select"
                id="partnershipType"
                value={formData.partnershipType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    partnershipType: e.target.value as PartnerType,
                  }))
                }
              >
                {partnerTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, district: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, street: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              ></textarea>
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
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
