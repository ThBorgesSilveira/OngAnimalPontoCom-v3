import Link from "next/link"

interface SubItem {
  label: string
  href: string
}

interface MenuItemProps {
  label: string
  href?: string
  subItems?: SubItem[]
}

export default function MenuItem({ label, href, subItems }: MenuItemProps) {
  if (subItems && subItems.length > 0) {
    return (
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          type="button"
        >
          {label}
        </button>

        <ul className="dropdown-menu">
          {subItems.map((item, index) => (
            <li key={index}>
              <Link className="dropdown-item" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return (
    <li className="nav-item">
      <Link className="nav-link" href={href ?? "#"}>
        {label}
      </Link>
    </li>
  )
}
