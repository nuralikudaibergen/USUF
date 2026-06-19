"use client"

import { MessageCircle } from "lucide-react"
import { brandConfig } from "@/lib/brand-config"

export function WhatsAppFab() {
  const link = `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(
    "Здравствуйте! Хочу узнать подробнее о товарах YUSUF BRAND 🛍️",
  )}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-4 pr-5 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-all hover:scale-105 hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.8)] md:bottom-8 md:right-8"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
        <MessageCircle className="relative size-6 fill-current" />
      </span>
      <span className="hidden sm:inline">Написать в WhatsApp</span>
    </a>
  )
}
