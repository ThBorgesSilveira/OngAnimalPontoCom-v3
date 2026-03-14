export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>ONG AnimalPontoCom</h2>

            <p>
              Acreditamos que todo animal merece amor, cuidado e um lar. Somos
              uma ONG dedicada à adoção responsável, ao bem-estar dos pets e à
              construção de conexões verdadeiras entre pessoas e animais. Junte-se
              a nós nessa missão de espalhar carinho e transformar vidas - humanas
              e peludas.
            </p>
          </div>

          <figure className="figure">
            <img
              src="/images/caes_e_gatos.png"
              className="figure-img img-fluid rounded"
              alt="Evento de adoção comunitária"
            />

            <figcaption className="figure-caption">
              Evento de adoção comunitária realizado no último sábado no Parque
              das Nações.
            </figcaption>
          </figure>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h2>Maus-tratos mais recorrentes</h2>

            <ul className="lista">
              <li>Abandono em vias públicas</li>
              <li>Negligência de alimentação e cuidados</li>
              <li>Agressões físicas</li>
              <li>Confinamento inadequado</li>
              <li>Exposição a condições extremas</li>
              <li>Exploração forçada</li>
              <li>Envenenamento ou intoxicação</li>
              <li>Uso em práticas cruéis (rinhas, espetáculos)</li>
            </ul>
          </div>

          <figure className="figure">
            <img
              src="/images/gato_resgatado.png"
              className="figure-img img-fluid rounded"
              alt="Conscientização contra maus-tratos"
            />

            <figcaption className="figure-caption">
              Seja o herói que muda o final dessa história triste. Adote!
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="faixa-inferior"></div>
    </main>
  )
}
