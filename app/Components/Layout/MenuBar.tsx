import MenuItem from "./MenuItem"

interface MenuBarProps {
  items: {
    label: string
    href?: string
    subItems?: { label: string; href: string }[]
  }[]
}

export default function MenuBar({ items }: MenuBarProps) {
  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {items.map((item, index) => (
        <MenuItem
          key={index}
          label={item.label}
          href={item.href}
          subItems={item.subItems}
        />
      ))}
    </ul>
  )
}
