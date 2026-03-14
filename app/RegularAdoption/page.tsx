const pets = [
  {
    name: "Mel",
    age: "2 meses",
    size: "Pequeno",
    temperament: "carinhosa e brincalhona",
    image: "/images/filhotes.png",
  },
  {
    name: "Thor",
    age: "4 meses",
    size: "Médio",
    temperament: "curioso e sociável",
    image: "/images/filhotes_para_adocao.png",
  },
]

export default function RegularAdoptionPage() {
  return (
    <main>
      <section className="hero">
        <h1>Adote com consciência</h1>
        <p>
          A adoção responsável é um gesto de amor que transforma vidas. Conheça
          alguns dos pets disponíveis e encontre seu novo companheiro.
        </p>

        <div className="card-grid mt-4">
          {pets.map((pet) => (
            <div className="card" key={pet.name}>
              <img src={pet.image} className="card-img-top" alt={pet.name} />
              <div className="card-body">
                <h5 className="card-title">{pet.name}</h5>
                <p className="card-text">Idade: {pet.age}</p>
                <p className="card-text">Porte: {pet.size}</p>
                <p className="card-text">Temperamento: {pet.temperament}</p>
                <button className="btn btn-outline-primary" type="button">
                  Quero adotar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="faixa-inferior"></div>
    </main>
  )
}
