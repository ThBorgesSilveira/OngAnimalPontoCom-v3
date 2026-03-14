import styles from "./pageAboutUs.module.css"

export default function AboutPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Sobre nós</h1>

            <p>
              A AnimalPontoCom é uma ONG de Criciúma dedicada ao resgate, cuidado e
              adoção responsável de cães e gatos em situação de abandono. Nosso
              trabalho vai além de acolher os animais: buscamos garantir que cada
              pet receba atendimento veterinário, carinho e uma nova chance de vida.
            </p>

            <p>
              Promovemos <strong>feiras de adoção</strong>, como as realizadas em
              parceria com o Angeloni, onde os animais já chegam castrados,
              microchipados e prontos para encontrar um lar. Para adotar, é
              necessário ser maior de 18 anos e passar por uma entrevista com
              nossa equipe, garantindo que cada animal seja acolhido em um
              ambiente adequado.
            </p>

            <p>
              Também organizamos <strong>eventos solidários</strong>, como a live
              "Solidariedade AU Vivo", que arrecadou recursos para quitar dívidas
              em clínicas veterinárias e sensibilizar a comunidade sobre a
              importância da causa animal.
            </p>

            <p>
              Além disso, atuamos em <strong>campanhas de conscientização</strong>{" "}
              sobre posse responsável e bem-estar animal, e apoiamos iniciativas
              de castração para reduzir o número de animais abandonados.
            </p>

            <p>
              Com o apoio da comunidade, conseguimos transformar histórias de
              abandono em histórias de esperança. Juntos, podemos mudar vidas e
              espalhar respeito pelos animais.
            </p>
          </div>

          <figure className={styles.figure}>
            <img
              src="/images/voluntario_3.png"
              className={styles.figureImg}
              alt="Evento de adoção comunitária"
            />
            <figcaption className="figure-caption">
              Voluntários da ONG AnimalPontoCom cuidam de cães e gatos em abrigo
              residencial adaptado.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className={styles.faixaInferior}></div>
    </main>
  )
}
