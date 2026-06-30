import Link from "next/link"
import { Camera, MessageCircle } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"
import { YBLogo } from "@/components/yb-logo"

const socials = [
  { Icon: Camera, label: "Instagram", href: brandConfig.instagram },
  { Icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${brandConfig.whatsappNumber}` },
]

export function SiteFooter() {
  return (
    <footer id="about" className="border-t border-gold/20 bg-forest-deep">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
        <div>
          <YBLogo size="md" photo />
          <p className="mt-5 max-w-xs text-sm leading-7 text-foreground/72">
            YUSUF BRAND создаёт одежду и обувь для уверенного стиля без лишнего шума.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-all hover:border-gold hover:bg-gold hover:text-forest-deep"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn
          title="Магазин"
          links={[
            ["Мужская коллекция", "/men"],
            ["Женская коллекция", "/women"],
            ["Обувь", "/shoes"],
            ["Распродажа", "/sale"],
            ["Каталог", "/catalog"],
          ]}
        />

        <FooterColumn
          title="Компания"
          links={[
            ["О бренде", "/about"],
            ["Контакты", "/contacts"],
            ["Доставка и возврат", "/delivery"],
            ["FAQ", "/faq"],
          ]}
        />

        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
            Помощь
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-foreground/74">
            <li><Link href="/delivery" className="gold-underline hover:text-gold">Доставка и возврат</Link></li>
            <li><Link href="/faq" className="gold-underline hover:text-gold">Частые вопросы</Link></li>
            <li><Link href="/contacts" className="gold-underline hover:text-gold">Связаться с нами</Link></li>
            <li>
              <a
                href={`https://wa.me/${brandConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-underline hover:text-gold"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs uppercase tracking-[0.18em] text-gold-soft/60">
          © {new Date().getFullYear()} YUSUF BRAND. Все права защищены.
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-foreground/74">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="gold-underline hover:text-gold">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
