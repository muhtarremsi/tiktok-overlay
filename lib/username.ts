/**
 * Normalisiert einen TikTok-Username für die API:
 * - Leerzeichen am Anfang/Ende entfernen
 * - Führendes @ entfernen
 * - Kleinschreibung (TikTok-API erwartet oft lowercase)
 */
export function normalizeTiktokUsername(input: string | null | undefined): string {
  if (input == null || typeof input !== 'string') return '';
  return input.trim().replace(/^@+\s*/, '').trim().toLowerCase();
}
