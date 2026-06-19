import Link from "next/link"
import { Camera, MessageCircle } from "lucide-react"
import { YBLogo } from "@/components/yb-logo"
import { brandConfig } from "@/lib/brand-config"

const socials = [
  { Icon: Camera, label: "Instagram", href: brandConfig.instagram },
  { Icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${brandConfig.whatsappNumber}` },
]

export function SiteFooter() {
  return (
    <footer id="about" className="mt-20 border-t border-gold/20 bg-forest-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <YBLogo size="md" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-gold-soft/70">
            Смелый, уверенный, премиальный fashion. YUSUF BRAND создаёт одежду
            и обувь для тех, кто сам определяет свой стиль.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-all hover:border-gold hover:bg-gold hover:text-forest"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
            Магазин
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-gold-soft/80">
            <li>
              <Link href="/men" className="gold-underline hover:text-gold">Мужская коллекция</Link>
            </li>
            <li>
              <Link href="/women" className="gold-underline hover:text-gold">Женская коллекция</Link>
            </li>
            <li>
              <Link href="/shoes" className="gold-underline hover:text-gold">Обувь</Link>
            </li>
            <li>
              <Link href="/sale" className="gold-underline hover:text-gold">Распродажа</Link>
            </li>
            <li>
              <Link href="/catalog" className="gold-underline hover:text-gold">Каталог</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
            Компания
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-gold-soft/80">
            <li><Link href="/about" className="gold-underline hover:text-gold">О бренде</Link></li>
            <li><Link href="/contacts" className="gold-underline hover:text-gold">Контакты</Link></li>
            <li><Link href="/delivery" className="gold-underline hover:text-gold">Доставка и возврат</Link></li>
            <li><Link href="/faq" className="gold-underline hover:text-gold">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
            Помощь
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-gold-soft/80">
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div>
            <h4 className="font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
              Клуб YB
            </h4>
            <p className="text-sm text-gold-soft/70">
              Новинки, эксклюзивные предложения, закрытые дропы для участников клуба.
            </p>
          </div>
          <form
            action={`mailto:${brandConfig.email}`}
            method="post"
            encType="text/plain"
            className="flex w-full max-w-md"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Ваш email"
              className="w-full rounded-l-md border border-gold/30 bg-forest px-4 py-3 text-sm text-gold outline-none placeholder:text-gold/50 focus:border-gold"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-r-md bg-gold px-5 py-3 text-sm font-extrabold uppercase tracking-[0.15em] text-forest transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              Вступить
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs uppercase tracking-[0.2em] text-gold-soft/60">
          © {new Date().getFullYear()} YUSUF BRAND. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
