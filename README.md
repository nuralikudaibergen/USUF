# YUSUF BRAND — интернет-магазин

Премиальный интернет-магазин одежды и обуви YUSUF BRAND (Туркестан, Казахстан).
Все заказы оформляются через WhatsApp — каталог служит витриной.

## Стек

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5.7**
- **Tailwind CSS v4** + кастомные утилиты (`gold-glow`, `gold-underline`, `gold-shine`)
- Шрифты: **Bebas Neue** (display), **Montserrat** (heading), **Inter** (body)
- Локальное хранилище админки: **localStorage** (товары/промокоды/категории)
- Аналитика: **@vercel/analytics**

## Структура

```
app/                  # маршруты Next.js
  ├── page.tsx         # главная
  ├── catalog/         # каталог со всеми фильтрами
  ├── product/[slug]/  # карточка товара (slug-URL)
  ├── men, women, shoes, sale/  # разделы
  ├── cart/            # корзина
  ├── whatsapp/        # оформление заказа через WhatsApp
  ├── auth/            # вход по телефону
  ├── account/         # личный кабинет
  ├── admin/           # админ-панель
  │   ├── products/    # CRUD товаров
  │   ├── categories/  # CRUD категорий
  │   ├── promos/      # промокоды
  │   └── orders/      # CTA WhatsApp
  ├── about, contacts, delivery, faq/
  ├── sitemap.ts       # SEO sitemap
  └── robots.ts        # SEO robots

components/            # переиспользуемые компоненты
  ├── home/            # секции для главной и страниц коллекций
  ├── info/            # контакты, доставка, FAQ
  ├── ui/              # базовые UI (button, input)
  ├── site-header.tsx
  ├── site-footer.tsx
  ├── product-card.tsx
  ├── product-detail.tsx
  ├── image-zoom.tsx
  └── whatsapp-fab.tsx

lib/                   # контексты, утилиты, конфиг
  ├── brand-config.ts  # ВСЕ контакты и брендовые данные тут
  ├── products.ts      # тип Product + seed-каталог (можно оставить пустым)
  ├── slug.ts          # транслитерация для slug-URL
  ├── cart-context.tsx
  ├── wishlist-context.tsx
  ├── auth-context.tsx
  ├── admin-store.tsx  # админский state (товары/промокоды/категории)
  └── whatsapp-order.ts # шаблон WhatsApp-сообщения
```

## Где менять контакты

Все контактные данные бренда — в одном месте: `lib/brand-config.ts`. Меняйте
только этот файл, остальное подтянется автоматически:

```ts
export const brandConfig = {
  whatsappNumber: "77056211845",
  siteUrl: "https://yusufbrand.kz",
  name: "YUSUF BRAND",
  phoneDisplay: "+7 (705) 621-18-45",
  email: "Kudaibergennurali0@gmail.com",
  instagram: "https://www.instagram.com/yusuf_brand_kz?igsh=...",
  city: "Туркестан",
  showroomAddress: "Туркестан, проспект Тәуке хан, 242/6",
  showroomMapUrl: "https://2gis.kz/turkestan/geo/70000001105993483",
}
```

## Запуск локально

```bash
pnpm install
pnpm dev
```

Откройте `http://localhost:3000`.

## Деплой на Vercel

1. Залейте репозиторий на GitHub.
2. Зайдите на [vercel.com/new](https://vercel.com/new), выберите репозиторий.
3. Framework Preset: **Next.js** (определится автоматически).
4. Build Command: `next build`. Output: `.next`. Install: `pnpm install`.
5. В **Environment Variables** ничего не требуется.
6. Нажмите **Deploy**. Через ~2 минуты получите URL вида `yusufbrand.vercel.app`.

### Подключение своего домена `yusufbrand.kz`

1. В Vercel → **Settings → Domains** → добавьте `yusufbrand.kz` и `www.yusufbrand.kz`.
2. Vercel покажет DNS-записи. У вашего регистратора домена пропишите:
   - `A yusufbrand.kz → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
3. SSL-сертификат выпустится автоматически.
4. После привязки домена обновите `siteUrl` в `lib/brand-config.ts` на `https://yusufbrand.kz`.

## Как добавлять товары

### Через админ-панель (рекомендуется)

1. Откройте `/auth` и введите **любой номер телефона, оканчивающийся на `0000`**
   (например, `+7 700 000 00 00`) и **любой 4-значный код**.
2. Войдите как админ → перейдите в `/admin/products` → **«Добавить товар»**.
3. Заполните форму. После сохранения товар появится на главной, в каталоге
   и в поиске.
4. Товары сохраняются в **localStorage браузера** — это значит, что они
   видны только на том устройстве, где были добавлены. Для полноценного
   каталога на всех устройствах нужен бэкенд (Supabase, Firebase или API).

### Через код (для разработчика)

Товары в коде — в `lib/products.ts`. Можно заполнить `products: Product[]`
массивом, тогда они будут видны всем (но недоступны для редактирования через
админку на клиенте).

## WhatsApp-шаблон

Файл: `lib/whatsapp-order.ts`. Шаблон сообщения приходит менеджеру:

```
Здравствуйте! Хочу сделать заказ 🛍️

1. Пальто из шерсти Кэмел (L) — 189 000 ₸
   🔗 https://yusufbrand.kz/product/palto-iz-shersti

💰 Итого: 189 000 ₸

👤 Имя: ...
📞 Телефон: ...
📍 Город: ...

Жду подтверждения!
```

## Безопасность админки

В демо-режиме админ = любой номер, оканчивающийся на `0000`. Это **только
для тестирования**. Для боевого деплоя нужно подключить реальный бэкенд с
авторизацией (Supabase Auth, NextAuth, Firebase Auth).
