export default function HowToHelpPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Como posso ajudar?</h1>
            <p>
              Toda forma de ajuda transforma vidas. Se você quer fazer parte
              dessa rede de cuidado e proteção, existem várias maneiras de
              colaborar com a nossa ONG:
            </p>
            <ul className="lista">
              <li>
                <strong>Adote com responsabilidade:</strong> dar um lar a um animal
                é um gesto de amor que muda destinos.
              </li>
              <li>
                <strong>Doe itens ou recursos:</strong> ração, medicamentos,
                produtos de limpeza, caminhas, brinquedos e contribuições
                financeiras são bem-vindas.
              </li>
              <li>
                <strong>Seja voluntário:</strong> participe de eventos, ajude nos
                cuidados diários ou contribua com suas habilidades.
              </li>
              <li>
                <strong>Apadrinhe um animal:</strong> ajude com custos de
                alimentação e saúde.
              </li>
              <li>
                <strong>Divulgue nossa causa:</strong> compartilhe conteúdos e
                convide amigos para conhecer o projeto.
              </li>
            </ul>
            <p>
              Cada gesto conta. Juntos, podemos construir um mundo mais justo e
              amoroso para todos os animais.
            </p>
          </div>

          <figure className="figure">
            <img
              src="/images/voluntario.png"
              className="figure-img img-fluid rounded"
              alt="Voluntários da ONG AnimalPontoCom"
            />
            <figcaption className="figure-caption">
              Voluntários apoiando resgates e cuidados diários.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="faixa-inferior"></div>
    </main>
  )
}
