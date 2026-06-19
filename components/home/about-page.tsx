import Link from "next/link"
import { YBLogo } from "@/components/yb-logo"
import { Sparkles, ShieldCheck, Globe, Heart } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

const values = [
  {
    icon: Sparkles,
    title: "Смелый дизайн",
    text: "Чёткие линии, благородные ткани, силуэты, в которых есть характер. Каждая вещь — высказывание.",
  },
  {
    icon: ShieldCheck,
    title: "Качество без компромиссов",
    text: "Премиальные ткани, ручная отделка, контроль на каждом этапе производства.",
  },
  {
    icon: Globe,
    title: "Минимализм и устойчивость",
    text: "Мы создаём вещи, которые носятся годами. Меньше — лучше. Это наш манифест.",
  },
  {
    icon: Heart,
    title: "Для своих",
    text: "YB — это клуб для тех, кто сам задаёт правила. Ранний доступ, эксклюзивные дропы, закрытый мерч.",
  },
]

const milestones = [
  { year: "2024", text: `Запуск YUSUF BRAND в ${brandConfig.city}` },
  { year: "2025", text: "Первая мужская и женская коллекции" },
  { year: "2026", text: "Открытие шоурума и расширение команды" },
]

export function AboutPageContent() {
  return (
    <div className="bg-forest-deep">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(232,160,32,0.18) 0%, transparent 60%), linear-gradient(180deg, #0F2A1F 0%, #1B4332 100%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center md:py-32">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
            О бренде
          </span>
          <h1 className="mt-4 font-heading text-5xl font-black uppercase leading-[0.95] text-gold sm:text-7xl md:text-[96px]">
            YUSUF <span className="gold-shine">BRAND</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gold-soft/85 sm:text-lg">
            YUSUF BRAND — премиальный казахстанский бренд одежды и обуви из
            {` ${brandConfig.city}`}. Мы создаём вещи для тех, кто ведёт
            собой, а не следует за другими. Смелый, уверенный, чистый дизайн.
            Премиальные ткани. Дерзкий характер.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
              Наши ценности
            </span>
            <h2 className="mt-3 font-heading text-3xl font-black uppercase text-gold md:text-4xl">
              Что мы отстаиваем
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-gold" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-md border border-gold/20 bg-forest-deep p-6 transition-all hover:border-gold/60"
              >
                <div className="flex size-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <v.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-gold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-soft/75">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-forest-deep py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
              История
            </span>
            <h2 className="mt-3 font-heading text-3xl font-black uppercase text-gold md:text-4xl">
              От идеи — к бренду
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gold-soft/80">
              YUSUF BRAND родился из простой идеи: казахстанский fashion может
              быть на уровне лучших мировых домов. Мы работаем с проверенными
              производителями, используем премиальные ткани и дерзкий
              минималистичный дизайн.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gold-soft/80">
              Каждая коллекция — это наш ответ на вопрос «как должна выглядеть
              одежда для уверенного в себе человека». Без лишнего шума. Только суть.
            </p>
          </div>
          <div className="rounded-md border border-gold/30 bg-forest p-8">
            <h3 className="font-heading text-xl font-extrabold uppercase tracking-[0.15em] text-gold">
              Ключевые даты
            </h3>
            <ol className="mt-6 space-y-5">
              {milestones.map((m) => (
                <li key={m.year} className="flex items-start gap-4 border-l-2 border-gold/40 pl-4">
                  <span className="font-heading text-2xl font-extrabold text-gold">
                    {m.year}
                  </span>
                  <span className="text-sm leading-relaxed text-gold-soft/85">
                    {m.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gold/20 bg-forest py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <YBLogo size="lg" stacked />
          <h2 className="mt-8 font-heading text-3xl font-black uppercase text-gold md:text-5xl">
            Готовы носить свою уверенность?
          </h2>
          <p className="mt-4 text-base text-gold-soft/80">
            Откройте для себя мужскую и женскую коллекции этого сезона.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/men"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-forest transition-all hover:shadow-[0_10px_30px_-10px_rgba(232,160,32,0.7)]"
            >
              Мужская
            </Link>
            <Link
              href="/women"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-8 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
            >
              Женская
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-8 py-3.5 font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
            >
              Каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
