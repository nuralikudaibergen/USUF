import Link from "next/link"
import { Truck, Wallet, PackageCheck, RefreshCw, Clock, Shield } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

export function DeliveryPage() {
  return (
    <section className="bg-forest-deep py-16">
      <div className="mx-auto max-w-5xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">Доставка и возврат</span>
        </nav>

        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-gold md:text-5xl">
          Доставка и возврат
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gold-soft/80">
          Доставляем по всему Казахстану. Заказы оформляются через WhatsApp — мы свяжемся с вами в
          течение часа в рабочее время.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Truck,
              title: "Курьер по Туркестану",
              body: "1–3 рабочих дня. Стоимость уточняйте у менеджера в WhatsApp.",
            },
            {
              icon: PackageCheck,
              title: "Казпочта по РК",
              body: "5–10 рабочих дней. Стоимость — 3 500 ₸, бесплатно от 100 000 ₸.",
            },
            {
              icon: Shield,
              title: "Самовывоз",
              body: `В день заказа из шоурума в ${brandConfig.city} (${brandConfig.showroomAddress}).`,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-lg border border-gold/20 bg-forest p-6"
            >
              <c.icon className="size-6 text-gold" />
              <h3 className="mt-4 font-heading text-base font-bold uppercase tracking-[0.15em] text-gold">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gold-soft/80">
                {c.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-gold/20 bg-forest p-6">
            <div className="flex items-center gap-2 text-gold">
              <Wallet className="size-5" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em]">
                Оплата
              </h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gold-soft/85">
              <li>• Kaspi перевод — ссылка от менеджера в WhatsApp.</li>
              <li>• Наличные курьеру при получении (только Туркестан).</li>
              <li>• Оплата картой через Kaspi QR при самовывозе.</li>
              <li className="text-gold-soft/60">
                Онлайн-оплата картой на сайте не принимается — все заказы подтверждаются
                менеджером.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gold/20 bg-forest p-6">
            <div className="flex items-center gap-2 text-gold">
              <Clock className="size-5" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em]">
                Сроки
              </h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gold-soft/85">
              <li>• Подтверждение заказа — в течение часа (10:00–21:00).</li>
              <li>• Отправка — на следующий рабочий день после оплаты.</li>
              <li>• Трек-номер — приходит в WhatsApp сразу после передачи курьеру.</li>
              <li>• Доставка по Туркестану — пн–сб с 10:00 до 20:00.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gold/20 bg-forest p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold">
              <RefreshCw className="size-5" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.15em]">
                Возврат и обмен
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gold-soft/85">
              Возврат принимается в течение <b>14 дней</b> с момента получения при условии, что
              товар не был в употреблении, сохранены бирки и оригинальная упаковка. Стоимость
              обратной пересылки оплачивает покупатель, кроме случаев брака.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gold-soft/85">
              Чтобы оформить возврат — напишите нам в WhatsApp с номером заказа и причиной.
              Менеджер пришлёт адрес и инструкцию.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
