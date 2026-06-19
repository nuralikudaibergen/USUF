// Утилита транслитерации кириллицы → латиница и slug-генерация.
// Используется в seed-товарах, в WhatsApp-сообщении и при роутинге.

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
}

/**
 * Транслитерирует строку с кириллицы в латиницу.
 * Регистронезависимо, Unicode-safe.
 */
export function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join("")
}

/**
 * Генерирует URL-slug из произвольной строки.
 * Пример: "Пальто из шерсти" → "palto-iz-shersti"
 */
export function slugify(input: string): string {
  return transliterate(input)
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
