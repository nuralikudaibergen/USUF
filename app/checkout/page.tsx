import { redirect } from "next/navigation"

export default function CheckoutPage() {
  // Старый онлайн-checkout больше не используется.
  // Оформление идёт через WhatsApp.
  redirect("/whatsapp")
}
