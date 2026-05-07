import Logo from "./Logo"
import MenuBar from "./MenuBar"

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <Logo />

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
          <MenuBar
            items={[
              { label: "COMO AJUDAR", href: "/HowToHelp" },
              {
                label: "ADOÇÃO",
                subItems: [
                  { label: "Adoção normal", href: "/RegularAdoption" },
                  { label: "Adoção surpresa", href: "/SurpriseAdoption" },
                ],
              },
              { label: "EVENTOS", href: "/Events" },
              { label: "SOBRE NÓS", href: "/AboutUs" },
              { label: "SEJA PARCEIRO", href: "/BePartner" },
              { label: "FAQ", href: "/Faqs" },
            ]}
          />
        </div>
      </nav>
    </header>
  )
}
