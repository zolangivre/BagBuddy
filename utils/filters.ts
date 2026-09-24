/**
 * Modèle de filtres commun à l'accueil et aux transactions, avec les mêmes
 * clés que le front web (ListingFilters) :
 *
 *   { from, to, date, flexDays, minPrice, maxPrice, minWeight, maxWeight,
 *     status, sort }
 *
 * Une clé absente ne filtre pas. `date` est un jour local « YYYY-MM-DD »,
 * `flexDays` la tolérance autour (FLEX_DAYS), ignorée sans date — comme côté
 * serveur.
 */

export type SortOption =
  | "recent"
  | "earliest_departure"
  | "price_low"
  | "price_high"
  | "weight_high"
  | "weight_low";

export interface Filters {
  from?: string;
  to?: string;
  /** Jour local « YYYY-MM-DD ». */
  date?: string;
  flexDays?: number;
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  status?: string;
  sort?: SortOption;
}

/** Ce que les fonctions d'affichage demandent d'i18n-js. */
export interface Translator {
  t: (key: string, options?: Record<string, unknown>) => string;
}

export interface FilterChip {
  key: "route" | "date" | "price" | "weight" | "status";
  label: string;
  remove: (current: Filters) => Filters;
}

/** Écarts proposés autour de la date : jour exact, ou quelques jours autour. */
export const FLEX_DAYS = [0, 1, 3, 7];

/** Tris de searchTrips, dans l'ordre où la feuille de tri les propose. */
export const SORT_OPTIONS: SortOption[] = [
  "recent",
  "earliest_departure",
  "price_low",
  "price_high",
  "weight_high",
  "weight_low",
];

/** Retire les clés vides : `{}` et `null` veulent tous deux dire « aucun filtre ». */
export function compactFilters(filters: Filters | null | undefined): Filters {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    result[key] = value;
  }
  if (!result.date) delete result.flexDays;
  return result as Filters;
}

/** Nombre de filtres actifs, pour la pastille du bouton. Le tri n'en est pas un. */
export function countActiveFilters(filters: Filters | null | undefined): number {
  const f = compactFilters(filters);
  let count = 0;
  if (f.from || f.to) count += 1;
  if (f.date) count += 1;
  if (f.minPrice !== undefined || f.maxPrice !== undefined) count += 1;
  if (f.minWeight !== undefined || f.maxWeight !== undefined) count += 1;
  if (f.status) count += 1;
  return count;
}

/** Jour local « YYYY-MM-DD » d'un objet Date, sans passer par l'UTC. */
export function toDayString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Objet Date à minuit local pour un jour « YYYY-MM-DD ». */
export function fromDayString(day: string): Date {
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  return new Date(year, month - 1, dayOfMonth);
}

/**
 * Jour calendaire d'une date ISO locale, lu sur la chaîne et non via
 * `new Date(...)` : le fuseau de l'appareil ferait changer de jour un vol du soir.
 */
function calendarDay(value: string | null | undefined): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000;
}

/** Le vol part-il à `flexDays` jours au plus de la date cherchée ? */
export function departsAround(
  departureDate: string | null | undefined,
  date: string | undefined,
  flexDays = 0
): boolean {
  if (!date) return true;
  const wanted = calendarDay(date);
  const actual = calendarDay(departureDate);
  if (wanted === null || actual === null) return false;
  return Math.abs(actual - wanted) <= flexDays;
}

/** « 12 », « 12,5 » ou « 12.5 » → 12.5 ; vide ou illisible → undefined. */
export function parseAmount(text: string | null | undefined): number | undefined {
  const normalized = String(text ?? "").replace(",", ".").trim();
  if (normalized === "") return undefined;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

/**
 * Puces des filtres actifs, dans l'ordre de la feuille. Chaque puce sait se
 * retirer : `remove(filters)` rend les filtres sans elle.
 */
export function filterChips(
  filters: Filters | null | undefined,
  {
    i18n,
    language,
    currencySymbol,
  }: { i18n: Translator; language: string; currencySymbol: string }
): FilterChip[] {
  const f = compactFilters(filters);
  const chips: FilterChip[] = [];

  if (f.from || f.to) {
    chips.push({
      key: "route",
      label: `${f.from ?? i18n.t("filter_anywhere")} → ${f.to ?? i18n.t("filter_anywhere")}`,
      remove: (current) => ({ ...current, from: undefined, to: undefined }),
    });
  }
  if (f.date) {
    const day = fromDayString(f.date).toLocaleDateString(language, {
      day: "numeric",
      month: "short",
    });
    chips.push({
      key: "date",
      label: f.flexDays ? `${day} ± ${f.flexDays} ${i18n.t("filter_days_short")}` : day,
      remove: (current) => ({ ...current, date: undefined, flexDays: undefined }),
    });
  }
  const range = (min: number | undefined, max: number | undefined, unit: string) => {
    if (min !== undefined && max !== undefined) return `${min}–${max} ${unit}`;
    if (min !== undefined) return `≥ ${min} ${unit}`;
    return `≤ ${max} ${unit}`;
  };
  if (f.minPrice !== undefined || f.maxPrice !== undefined) {
    chips.push({
      key: "price",
      label: range(f.minPrice, f.maxPrice, `${currencySymbol}/kg`),
      remove: (current) => ({ ...current, minPrice: undefined, maxPrice: undefined }),
    });
  }
  if (f.minWeight !== undefined || f.maxWeight !== undefined) {
    chips.push({
      key: "weight",
      label: range(f.minWeight, f.maxWeight, "kg"),
      remove: (current) => ({ ...current, minWeight: undefined, maxWeight: undefined }),
    });
  }
  if (f.status) {
    chips.push({
      key: "status",
      label: i18n.t(f.status),
      remove: (current) => ({ ...current, status: undefined }),
    });
  }
  return chips;
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: "€", USD: "$" };

/** Symbole de la devise d'affichage, pour les champs de prix. */
export function currencySymbol(code: string | null | undefined): string {
  return (code && CURRENCY_SYMBOLS[code]) ?? code ?? "€";
}

/**
 * Titre et sous-titre de la barre de recherche : le trajet d'abord, puis les
 * autres critères actifs, ou l'invitation à chercher s'il n'y en a aucun.
 */
export function searchSummary(
  chips: Pick<FilterChip, "key" | "label">[],
  i18n: Translator
): { title: string; subtitle: string } {
  const route = chips.find((chip) => chip.key === "route");
  const others = chips.filter((chip) => chip.key !== "route").map((chip) => chip.label);
  return {
    title: route?.label ?? i18n.t("filter_where_to"),
    subtitle: others.length > 0 ? others.join(" · ") : i18n.t("filter_search_hint"),
  };
}
