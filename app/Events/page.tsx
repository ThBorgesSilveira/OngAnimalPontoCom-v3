"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type EventCard = {
  id: number;
  isActive: boolean;
  name: string;
  eventDate: string;
  eventType: string;
  notes?: string | null;
  address?: {
    city?: string;
    district?: string;
    street?: string;
    number?: string;
  };
};

const eventImages = [
  "/images/filhotes.png",
  "/images/vacina.png",
  "/images/voluntario_2.png",
  "/images/adocao.png",
  "/images/voluntario_3.png",
];

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await api.get("/schedule-event/all");
        const activeEvents = (response.data as EventCard[])
          .filter((event) => event.isActive)
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

        setEvents(activeEvents);
      } catch {
        setError("Nao foi possivel carregar os eventos no momento.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const heroEvent = useMemo(() => events[0], [events]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Agenda viva</span>
          <h1>Proximos eventos</h1>
          <p>
            Acompanhe o calendario de acoes da AnimalPontoCom e participe das iniciativas da
            ONG com os eventos cadastrados e ativos no sistema.
          </p>
        </div>

        <div className={styles.heroHighlight}>
          {heroEvent ? (
            <>
              <span className={styles.highlightLabel}>Destaque do momento</span>
              <h2>{heroEvent.name}</h2>
              <p>{formatDate(heroEvent.eventDate)}</p>
              <p className={styles.highlightLocation}>
                {heroEvent.address
                  ? [heroEvent.address.street, heroEvent.address.number, heroEvent.address.city]
                      .filter(Boolean)
                      .join(", ")
                  : "Endereco ainda nao informado"}
              </p>
            </>
          ) : (
            <p className={styles.emptyState}>Nenhum evento ativo cadastrado no momento.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Eventos ativos</h2>
          <p>Somente eventos marcados como ativos no painel ADM aparecem aqui.</p>
        </div>

        {loading ? (
          <p>Carregando eventos...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : events.length === 0 ? (
          <p className={styles.emptyState}>Nenhum evento ativo cadastrado no momento.</p>
        ) : (
          <div className={styles.cardGrid}>
            {events.map((event, index) => (
              <article className={styles.card} key={event.id}>
                <div className={styles.imageWrap}>
                  <Image
                    src={eventImages[index % eventImages.length]}
                    alt={event.name}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.eventType}>{event.eventType}</span>
                  <h3>{event.name}</h3>
                  <p className={styles.date}>{formatDate(event.eventDate)}</p>
                  <p className={styles.location}>
                    {event.address
                      ? [event.address.street, event.address.number, event.address.city]
                          .filter(Boolean)
                          .join(", ")
                      : "Endereco ainda nao informado"}
                  </p>
                  {event.notes && <p className={styles.notes}>{event.notes}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
