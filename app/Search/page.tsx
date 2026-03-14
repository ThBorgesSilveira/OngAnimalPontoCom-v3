export default function SearchPage() {
  return (
    <main>
      <section className="hero">
        <h1>Pesquisar</h1>
        <p>Encontre conteúdos, pets e informações sobre a ONG.</p>
        <div className="search-box">
          <input
            className="form-control"
            placeholder="Digite sua busca..."
            type="text"
          />
          <button className="btn btn-primary" type="button">
            Buscar
          </button>
        </div>
        <div className="mt-4">
          <h5>Resultados aparecerão aqui...</h5>
        </div>
      </section>

      <div className="lowerBar"></div>
    </main>
  )
}
