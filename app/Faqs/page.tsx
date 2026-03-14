const faqs = [
  {
    question: "Quais são os requisitos para adotar?",
    answer:
      "É necessário ser maior de 18 anos, apresentar documento e passar por entrevista.",
  },
  {
    question: "Posso doar ração ou medicamentos?",
    answer:
      "Sim. Recebemos doações de ração, medicamentos, produtos de limpeza e itens para os abrigos.",
  },
  {
    question: "Como funciona o apadrinhamento?",
    answer:
      "Você contribui com custos mensais de alimentação e saúde de um animal resgatado.",
  },
  {
    question: "A ONG realiza eventos?",
    answer:
      "Realizamos feiras de adoção, campanhas de vacinação e ações de conscientização.",
  },
]

export default function FaqsPage() {
  return (
    <main>
      <section className="hero">
        <h1>Perguntas frequentes</h1>
        <div className="mt-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="mb-4">
              <h5>{faq.question}</h5>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="lowerBar"></div>
    </main>
  )
}
