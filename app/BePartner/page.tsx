export default function BePartnerPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Torne-se parceiro</h1>
            <p>
              Ao se tornar parceiro da AnimalPontoCom, sua empresa ou iniciativa
              contribui diretamente para ações de resgate, cuidado e adoção
              responsável. Junte-se a nós para ampliar o impacto social da causa
              animal.
            </p>
            <form className="mt-4">
              <div className="mb-3">
                <label className="form-label" htmlFor="nome">
                  Nome ou empresa
                </label>
                <input className="form-control" id="nome" type="text" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  E-mail
                </label>
                <input className="form-control" id="email" type="email" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="tipo">
                  Tipo de parceria
                </label>
                <select className="form-select" id="tipo">
                  <option>Doação recorrente</option>
                  <option>Patrocínio de eventos</option>
                  <option>Voluntariado corporativo</option>
                </select>
              </div>
              <button className="btn btn-primary" type="button">
                Enviar interesse
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
      </section>

      <div className="lowerBar"></div>
    </main>
  )
}
