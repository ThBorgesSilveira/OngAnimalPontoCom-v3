"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { api, createPersonWithAddress } from "@/lib/api";
import type { AxiosError } from "axios";

const pets = [
  {
    name: "Rex",
    idade: "3 meses",
    porte: "Medio",
    temp: "brincalhao e carinhoso",
    img: "rex.jpg",
    rescue: true,
  },
  {
    name: "Luna",
    idade: "2 meses",
    porte: "Pequeno",
    temp: "docil e brincalhona",
    img: "luna.jpg",
  },
  {
    name: "Thor",
    idade: "1 ano",
    porte: "Grande",
    temp: "protetor e leal",
    img: "thor.jpg",
  },
  {
    name: "Nina",
    idade: "6 meses",
    porte: "Medio",
    temp: "tranquila e carinhosa",
    img: "nina.jpg",
  },
  {
    name: "Bidu",
    idade: "4 meses",
    porte: "Pequeno",
    temp: "brincalhao",
    img: "bidu.jpg",
  },
];

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  reason: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  postalCode: string;
};

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  cpfCnpj: "",
  reason: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  postalCode: "",
};

export default function RegularAdoption() {
  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);

  function openForm(name: string) {
    setPetName(name);
    setErrorMessage("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const person = await createPersonWithAddress({
        name: formData.fullName,
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
      const animal = (animalsResponse.data as Array<{ id: number; name: string }>).find(
        (item) => item.name.toLowerCase() === petName.toLowerCase(),
      );

      if (!animal) {
        throw new Error(`Animal ${petName} nao encontrado no banco.`);
      }

      await api.post("/adoption-request", {
        personId: person.id,
        animalId: animal.id,
        notes: `Email: ${formData.email} | Telefone: ${formData.phone} | Motivo: ${formData.reason}`,
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
        setErrorMessage(backendMessage ?? (error as Error).message ?? "Erro ao enviar formulario.");
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
                A adocao responsavel e um gesto de amor que transforma vidas. Ao adotar, voce
                assume o compromisso de cuidar, proteger e oferecer um lar seguro para um animal
                que precisa de carinho.
              </p>
            </div>
          </div>
        </section>

        {pets.map((pet) => (
          <div key={pet.name} className={styles.petCard}>
            <img src={`/images/${pet.img}`} alt={pet.name} className={styles.petImage} />

            <div className={styles.petInfo}>
              <h3>{pet.name}</h3>
              <p>Idade: {pet.idade}</p>
              <p>Porte: {pet.porte}</p>
              <p>Temperamento: {pet.temp}</p>

              {pet.rescue && <p className={styles.rescueText}>Resgatado ha um mes</p>}

              <button className={styles.adoptButton} onClick={() => openForm(pet.name)}>
                Adotar
              </button>
            </div>
          </div>
        ))}
      </main>

      {successMessage && (
        <div className={styles.successBox}>
          Mensagem enviada com sucesso!
          <br />
          Entraremos em contato!
        </div>
      )}

      {errorMessage && <div className={styles.successBox}>Erro ao enviar: {errorMessage}</div>}

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Formulario de Adocao - {petName}</h2>

              <button className={styles.closeButton} onClick={() => setShowForm(false)}>
                X
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label>Nome completo</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              />

              <label>E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />

              <label>Telefone</label>
              <input
                type="tel"
                required
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
                onChange={(e) => setFormData((prev) => ({ ...prev, cpfCnpj: e.target.value }))}
              />

              <label>Pet escolhido</label>
              <input type="text" value={petName} readOnly />

              <label>Por que deseja adotar?</label>
              <textarea
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              ></textarea>

              <label>Estado</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              />

              <label>Cidade</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              />

              <label>Bairro</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              />

              <label>Rua</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              />

              <label>Numero</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
              />

              <label>CEP</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
              />

              <div className={styles.buttons}>
                <button type="button" className={styles.cancel} onClick={() => setShowForm(false)}>
                  Cancelar
                </button>

                <button type="submit" className={styles.send} disabled={isSubmitting}>
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
