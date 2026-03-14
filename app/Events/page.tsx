const events = [
  {
    title: "Feira de Adoção",
    date: "15 de Abril",
    location: "Parque Central",
    image: "/images/filhotes.png",
  },
  {
    title: "Campanha de Vacinação",
    date: "22 de Abril",
    location: "Sede da ONG",
    image: "/images/vacina.png",
  },
  {
    title: "Mutirão de Resgate",
    date: "30 de Abril",
    location: "Bairros parceiros",
    image: "/images/voluntario_2.png",
  },
]

export default function EventsPage() {
  return (
    <main>
      <section className="hero">
        <h1>Próximos eventos</h1>
        <p>
          Acompanhe o calendário de ações da AnimalPontoCom e participe das
          iniciativas em sua região.
        </p>

        <div className="card-grid">
          {events.map((event) => (
            <div className="card" key={event.title}>
              <img src={event.image} className="card-img-top" alt={event.title} />
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">Data: {event.date}</p>
                <p className="card-text">Local: {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lowerBar"></div>
    </main>
  )
}
