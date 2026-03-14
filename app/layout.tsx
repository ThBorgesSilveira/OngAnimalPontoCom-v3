import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "AnimalPontoCom",
  description: "ONG de adoção de animais",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/images/favicon-16x16.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Lato:wght@100;300;400;700;900&family=Marcellus&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/">
                <div className="logo">
                  <img src="/images/Logo.png" alt="Logo AnimalPontoCom" />
                </div>
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainMenu"
                aria-controls="mainMenu"
                aria-expanded="false"
                aria-label="Alternar menu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="mainMenu">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" href="/HowToHelp">
                      COMO AJUDAR
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      type="button"
                    >
                      ADOÇÃO
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" href="/RegularAdoption">
                          Adoção normal
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" href="/SurpriseAdoption">
                          Adoção surpresa
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/Events">
                      EVENTOS
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/AboutUs">
                      SOBRE NÓS
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/BePartner">
                      SEJA PARCEIRO
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/Faqs">
                      FAQ
                    </Link>
                  </li>

                  <li className="search-icon">
                    <Link href="/Search" aria-label="Pesquisar">
                      <i className="fas fa-search ms-3"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  )
}
