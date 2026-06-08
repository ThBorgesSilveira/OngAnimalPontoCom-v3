"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { api, createPersonWithAddress } from "@/lib/api";
import { PersonType } from "@/lib/enums/person-type";
import type { AxiosError } from "axios";

type Animal = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isActive: boolean;
  name: string;
  birthDate: string;
  size: string;
  temperament: string;
  rescueDate: string | null;
  notes: string;
  photoUrl: string | null;
};

type FormData = {
  fullName: string;
  personType: PersonType;
  email: string;
  phone: string;
  cpfCnpj: string;
  notes: string;
  age?: number;
  socialNetwork: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
};

const initialForm: FormData = {
  fullName: "",
  personType: PersonType.FISICA,
  email: "",
  phone: "",
  cpfCnpj: "",
  notes: "",
  age: undefined,
  socialNetwork: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
};

function getAgeLabel(birthDate: string) {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return "Idade desconhecida";
  }

  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return years === 1 ? "1 ano" : `${years} anos`;
  }

  if (months > 0) {
    return months === 1 ? "1 mês" : `${months} meses`;
  }

  return "Menos de 1 mês";
}

export default function RegularAdoption() {
  const [pets, setPets] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);

  useEffect(() => {
    async function loadAnimals() {
      try {
        const response = await api.get<Animal[]>("/animal/all");
        setPets(response.data);
      } catch (error) {
        console.error(error);
        setFetchError(
          "Não foi possível carregar os animais. Atualize a página.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnimals();
  }, []);

  function closeForm() {
    setShowForm(false);
    setErrorMessage("");
    setFormData(initialForm);
  }

  function openForm(name: string) {
    setPetName(name);
    setErrorMessage("");
    setShowForm(true);
  }

  useEffect(() => {
    if (!showForm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeForm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const person = await createPersonWithAddress({
        name: formData.fullName,
        personType: formData.personType,
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

      const animalsResponse = await api.get("/animal/all");
      const animal = (
        animalsResponse.data as Array<{ id: number; name: string }>
      ).find((item) => item.name.toLowerCase() === petName.toLowerCase());

      if (!animal) {
        throw new Error(`Animal ${petName} não encontrado no banco.`);
      }

      await api.post("/adoption-request", {
        personId: person.id,
        animalId: animal.id,
        notes: [
          formData.notes,
          formData.email ? `Email: ${formData.email}` : "",
          formData.phone ? `Telefone: ${formData.phone}` : "",
          formData.socialNetwork
            ? `Rede social: ${formData.socialNetwork}`
            : "",
          formData.age ? `Idade: ${formData.age}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
      });

      setShowForm(false);
      setSuccessMessage(true);
      setFormData(initialForm);

      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string | string[] }>;
      const backendMessage = axiosError.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setErrorMessage(backendMessage.join(" | "));
      } else {
        setErrorMessage(
          backendMessage ??
            (error as Error).message ??
            "Erro ao enviar formulário.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Adote com consciencia</h1>
              <p>
                A adocao responsavel e um gesto de amor que transforma vidas. Ao
                adotar, voce assume o compromisso de cuidar, proteger e oferecer
                um lar seguro para um animal que precisa de carinho.
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className={styles.successBox}>Carregando animais...</div>
        )}

        {fetchError && (
          <div className={styles.successBox}>
            Erro ao carregar animais: {fetchError}
          </div>
        )}

        {!loading && !fetchError && pets.length === 0 && (
          <div className={styles.successBox}>
            Nenhum animal disponível no momento.
          </div>
        )}

        {pets.map((pet) => {
          const imageSrc = pet.photoUrl || `${pet.photoUrl?.toLowerCase()}`;

          return (
            <div key={pet.id} className={styles.petCard}>
              <img src={imageSrc} alt={pet.name} className={styles.petImage} />

              <div className={styles.petInfo}>
                <h3>{pet.name}</h3>
                <p>Idade: {getAgeLabel(pet.birthDate)}</p>
                <p>Porte: {pet.size}</p>
                <p>Temperamento: {pet.temperament}</p>

                {pet.rescueDate && (
                  <p className={styles.rescueText}>
                    Resgatado em{" "}
                    {new Date(pet.rescueDate).toLocaleDateString("pt-BR")}
                  </p>
                )}

                <button
                  className={styles.adoptButton}
                  onClick={() => openForm(pet.name)}
                >
                  Adotar
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {successMessage && (
        <div className={styles.successBox}>
          Mensagem enviada com sucesso!
          <br />
          Entraremos em contato!
        </div>
      )}

      {errorMessage && (
        <div className={styles.successBox}>
          Erro ao enviar formulário: {errorMessage}
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay} onClick={closeForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Formulário de Adoção - {petName}</h2>

              <button className={styles.closeButton} onClick={closeForm}>
                X
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label>Nome completo</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />

              <label>Tipo de pessoa</label>
              <select
                value={formData.personType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personType: e.target.value as PersonType,
                  }))
                }
              >
                <option value={PersonType.FISICA}>Física</option>
                <option value={PersonType.JURIDICA}>Jurídica</option>
              </select>

              <label>E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <label>Telefone</label>
              <input
                type="tel"
                maxLength={11}
                placeholder="Digite seu telefone"
                value={formData.phone}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const onlyNumbers = e.currentTarget.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phone: onlyNumbers }));
                }}
              />

              <label>CPF/CNPJ</label>
              <input
                type="text"
                required
                maxLength={20}
                value={formData.cpfCnpj}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cpfCnpj: e.target.value }))
                }
              />

              <label>Pet escolhido</label>
              <input type="text" value={petName} readOnly />

              <label>Motivo / notas</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              ></textarea>

              <label>Idade</label>
              <input
                type="number"
                min={1}
                value={formData.age ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    age: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />

              <label>Rede social</label>
              <input
                type="text"
                value={formData.socialNetwork}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialNetwork: e.target.value,
                  }))
                }
              />

              <label>Estado</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
              />

              <label>Cidade</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
              />

              <label>Bairro</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, district: e.target.value }))
                }
              />

              <label>Rua</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, street: e.target.value }))
                }
              />

              <label>Número</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
              />

              <label>CEP</label>
              <input
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

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={styles.send}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
