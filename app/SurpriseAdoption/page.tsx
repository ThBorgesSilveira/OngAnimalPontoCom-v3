import Link from "next/link"

export default function SurpriseAdoptionPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Adoção surpresa</h1>
            <p>
              Na adoção surpresa, você não escolhe o pet. A escolha é feita de
              forma aleatória para incentivar encontros inesperados e especiais.
            </p>
            <p>
              Pronto para viver essa experiência? Clique abaixo e conheça um
              novo companheiro.
            </p>
            <Link className="btn btn-primary" href="/RegularAdoption">
              Ver pets disponíveis
            </Link>
          </div>

          <figure className="figure">
            <img
              src="/images/adocao.png"
              className="figure-img img-fluid rounded"
              alt="Adoção surpresa"
            />
            <figcaption className="figure-caption">
              A surpresa pode se transformar em uma amizade para a vida toda.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="faixa-inferior"></div>
    </main>
  )
}
