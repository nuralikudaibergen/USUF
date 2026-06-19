import Link from "next/link"
import { Plus } from "lucide-react"

const groups = [
  {
    title: "Доставка",
    items: [
      {
        q: "Как быстро вы доставите заказ?",
        a: "По Туркестану — 1–3 рабочих дня. По Казахстану через Казпочту — 5–10 рабочих дней. В день передачи курьеру мы пришлём трек-номер в WhatsApp.",
      },
      {
        q: "Есть ли бесплатная доставка?",
        a: "Да. По РК Казпочтой — бесплатно от 100 000 ₸. По Туркестану условия согласуются с менеджером. Иначе стоимость зависит от региона: 3 500–5 000 ₸.",
      },
      {
        q: "Можно ли забрать заказ самовывозом?",
        a: "Можно. Самовывоз из шоурума в Туркестане (проспект Тәуке хан, 242/6) в день подтверждения заказа — адрес пришлёт менеджер.",
      },
    ],
  },
  {
    title: "Оплата",
    items: [
      {
        q: "Как оплатить заказ?",
        a: "Kaspi перевод, наличные курьеру (только Туркестан) или Kaspi QR при самовывозе. Онлайн-оплата картой на сайте не принимается.",
      },
      {
        q: "Когда списание денег?",
        a: "Только после подтверждения заказа менеджером. Никаких автоматических списаний.",
      },
    ],
  },
  {
    title: "Возврат",
    items: [
      {
        q: "За какой срок можно вернуть товар?",
        a: "В течение 14 дней с момента получения. Товар не должен быть в употреблении, должны быть сохранены бирки и упаковка.",
      },
      {
        q: "Кто оплачивает обратную пересылку?",
        a: "Покупатель — кроме случаев брака или ошибки с нашей стороны. Возврат денег — в течение 3 рабочих дней после получения товара.",
      },
    ],
  },
  {
    title: "Размеры и материалы",
    items: [
      {
        q: "Как подобрать размер?",
        a: "В карточке каждого товара указана сетка размеров. Если сомневаетесь — напишите в WhatsApp, поможем подобрать по вашим меркам.",
      },
      {
        q: "Из чего сделаны вещи?",
        a: "Состав указан в блоке «Состав и материал» на странице товара. Мы используем натуральные ткани: шерсть, кашемир, шёлк, плотный хлопок, итальянская кожа.",
      },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      {
        q: "Зачем входить по телефону?",
        a: "Чтобы сохранять избранное и адреса доставки. Без входа каталог и оформление заказа тоже работают.",
      },
      {
        q: "Как стать админом?",
        a: "Админ-вход — это вход по номеру, оканчивающемуся на «0000». В демо-режиме этого достаточно, чтобы открыть панель управления.",
      },
    ],
  },
]

export function FaqPage() {
  return (
    <section className="bg-forest-deep py-16">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gold-soft/70">
          <Link href="/" className="hover:text-gold">
            Главная
          </Link>
          <span>/</span>
          <span className="font-medium text-gold">FAQ</span>
        </nav>

        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-gold md:text-5xl">
          Частые вопросы
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gold-soft/80">
          Если ответа не нашлось — напишите нам в WhatsApp, и менеджер ответит лично.
        </p>

        <div className="mt-10 space-y-10">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="mb-4 inline-block border-b border-gold/40 pb-1 font-heading text-lg font-bold uppercase tracking-[0.2em] text-gold">
                {g.title}
              </h2>
              <div className="space-y-3">
                {g.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-lg border border-gold/20 bg-forest open:border-gold/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-bold text-gold sm:text-base">
                        {item.q}
                      </span>
                      <Plus className="size-4 shrink-0 text-gold transition-transform group-open:rotate-45" />
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-gold-soft/85">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
