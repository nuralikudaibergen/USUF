# YUSUF BRAND

Next.js интернет-магазин одежды и обуви с админ-панелью, Supabase-хранилищем товаров/фото и оформлением заказа через WhatsApp.

## Локальный запуск

```bash
pnpm install
pnpm dev
```

Сайт: `http://localhost:3000`  
Админка: `http://localhost:3000/admin`

## Переменные окружения

Создайте `.env.local` для локального запуска и такие же переменные в Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Для продакшена `NEXT_PUBLIC_SITE_URL` должен быть реальным адресом сайта:

- временно: `https://your-project.vercel.app`
- после подключения домена: `https://yusufbrand.kz`

## Supabase

Перед использованием админки выполните SQL из файла:

```text
supabase/schema.sql
```

Он создаёт таблицы товаров, категорий, промокодов, заказов и bucket `product-images`.

## Деплой на Vercel

1. Загрузите проект на GitHub.
2. Откройте [vercel.com/new](https://vercel.com/new).
3. Выберите репозиторий.
4. Framework Preset: `Next.js`.
5. Install Command: `pnpm install`.
6. Build Command: `pnpm build`.
7. Output Directory оставьте пустым, Vercel сам использует `.next`.
8. В Vercel → Project → Settings → Environment Variables добавьте:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
9. Нажмите Deploy.

## Важное про админку

Сейчас админка открывается напрямую по `/admin`, без пароля. Это сделано по текущему требованию проекта.

Если сайт будет публичным, любой человек, который узнает ссылку `/admin`, сможет менять товары. Для реального магазина лучше позже добавить авторизацию администратора.

## Команды

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```
