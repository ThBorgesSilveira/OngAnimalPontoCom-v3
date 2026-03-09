import Link from "next/link"
export default function Home() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <div className="logo">
                <img src="/images/Logo.png" alt="Logo AnimalPontoCom"/>
              </div>
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainMenu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainMenu">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                <li className="nav-item">
                  <a className="nav-link" href="/pageHowToHelp">COMO AJUDAR</a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    ADOÇÃO
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/pageRegularAdoption">
                        Adoção normal
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/pageSurpriseAdoption">
                        Adoção surpresa
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/pageEvents">EVENTOS</a>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" href="/about">
                    SOBRE NÓS
                  </Link>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/pageBePartner">SEJA PARCEIRO</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/pageFaqs">FAQ</a>
                </li>

                <li className="search-icon">
                  <a href="/pageSearch">
                    <i className="fas fa-search ms-3"></i>
                  </a>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="hero-text">
              <h2>ONG AnimalPontoCom</h2>

              <p>
                Acreditamos que todo animal merece amor, cuidado e um lar. 
                Somos uma ONG dedicada à adoção responsável, ao bem-estar dos pets 
                e à construção de conexões verdadeiras entre pessoas e animais.
                Junte-se a nós nessa missão de espalhar carinho e transformar vidas 
                — humanas e peludas.
              </p>
            </div>

            <figure className="figure">
              <img
                src="/images/caes_e_gatos.png"
                className="figure-img img-fluid rounded"
                alt="Evento de adoção comunitária"
              />

              <figcaption className="figure-caption">
                Evento de adoção comunitária realizado no último sábado no Parque das Nações.
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
    </>
  )
}