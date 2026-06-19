import Link from "next/link"
import { MessageCircle, Phone, Mail, AtSign, MapPin, Send } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

export function ContactsPage() {
  const wa = `https://wa.me/${brandConfig.whatsappNumber}`
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    brandConfig.showroomAddress,
  )}&output=embed`

  return (
    <section className="bg-forest-deep py-16">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">Контакты</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-gold md:text-5xl">
              Свяжитесь с нами
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gold-soft/80">
              Самый быстрый способ — написать в WhatsApp. Отвечаем в течение часа в рабочее время.
            </p>

            <ul className="mt-8 space-y-4">
              <ContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value={brandConfig.phoneDisplay}
                href={wa}
                external
              />
              <ContactItem
                icon={Phone}
                label="Телефон"
                value={brandConfig.phoneDisplay}
                href={`tel:${brandConfig.phoneDisplay.replace(/\D/g, "")}`}
              />
              <ContactItem
                icon={Mail}
                label="Email"
                value={brandConfig.email}
                href={`mailto:${brandConfig.email}`}
              />
              <ContactItem
                icon={AtSign}
                label="Instagram"
                value="@yusuf_brand_kz"
                href={brandConfig.instagram}
                external
              />
              <ContactItem
                icon={MapPin}
                label="Шоурум"
                value={brandConfig.showroomAddress}
                href={brandConfig.showroomMapUrl}
                external
              />
            </ul>
          </div>

          <div className="space-y-8">
            <form
              action={`mailto:${brandConfig.email}`}
              method="post"
              encType="text/plain"
              className="rounded-lg border border-gold/20 bg-forest p-6"
            >
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-gold">
                Напишите нам
              </h2>
              <p className="mt-1 text-xs text-gold-soft/60">
                Форма откроет ваш почтовый клиент. Сообщение придёт на {brandConfig.email}.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Имя" name="name" required />
                <Field label="Телефон" name="phone" type="tel" required />
              </div>
              <div className="mt-3">
                <Field label="Email" name="email" type="email" />
              </div>
              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2 text-sm text-gold outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-heading text-sm font-extrabold uppercase tracking-[0.25em] text-forest"
              >
                <Send className="size-4" /> Отправить
              </button>
            </form>

            <div className="overflow-hidden rounded-lg border border-gold/20">
              <iframe
                src={mapEmbed}
                title="Карта — YUSUF BRAND"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof MessageCircle
  label: string
  value: string
  href: string
  external?: boolean
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-gold/20 hover:bg-forest/60"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-forest-deep/40 text-gold">
          <Icon className="size-4" />
        </span>
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-gold-soft/70">
            {label}
          </span>
          <span className="block text-sm font-semibold text-gold group-hover:text-gold-soft">
            {value}
          </span>
        </span>
      </a>
    </li>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gold-soft/80">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-gold/30 bg-forest-deep/40 px-3 py-2 text-sm text-gold outline-none focus:border-gold"
      />
    </div>
  )
}
