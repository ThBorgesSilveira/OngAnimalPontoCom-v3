import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import Header from "./Components/Layout/Header"

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
        
        <Header />

        <section className="hero">

          {children}

        </section>

      <div className="lowerBar"></div>      </body>
    </html>
  )
}
