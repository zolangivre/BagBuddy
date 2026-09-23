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

/** Écarts proposés autour de la date : jour exact, ou quelques jours autour. */
export const FLEX_DAYS = [0, 1, 3, 7];

/** Tris de searchTrips, dans l'ordre où la feuille de tri les propose. */
export const SORT_OPTIONS = [
  "recent",
  "earliest_departure",
  "price_low",
  "price_high",
  "weight_high",
  "weight_low",
];

/** Retire les clés vides : `{}` et `null` veulent tous deux dire « aucun filtre ». */
export function compactFilters(filters) {
  const result = {};
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    result[key] = value;
  }
  if (!result.date) delete result.flexDays;
  return result;
}

/** Nombre de filtres actifs, pour la pastille du bouton. Le tri n'en est pas un. */
export function countActiveFilters(filters) {
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
export function toDayString(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Objet Date à minuit local pour un jour « YYYY-MM-DD ». */
export function fromDayString(day) {
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  return new Date(year, month - 1, dayOfMonth);
}

/**
 * Jour calendaire d'une date ISO locale, lu sur la chaîne et non via
 * `new Date(...)` : le fuseau de l'appareil ferait changer de jour un vol du soir.
 */
function calendarDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000;
}

/** Le vol part-il à `flexDays` jours au plus de la date cherchée ? */
export function departsAround(departureDate, date, flexDays = 0) {
  if (!date) return true;
  const wanted = calendarDay(date);
  const actual = calendarDay(departureDate);
  if (wanted === null || actual === null) return false;
  return Math.abs(actual - wanted) <= flexDays;
}

/** « 12 », « 12,5 » ou « 12.5 » → 12.5 ; vide ou illisible → undefined. */
export function parseAmount(text) {
  const normalized = String(text ?? "").replace(",", ".").trim();
  if (normalized === "") return undefined;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

/**
 * Puces des filtres actifs, dans l'ordre de la feuille. Chaque puce sait se
 * retirer : `remove(filters)` rend les filtres sans elle.
 */
export function filterChips(filters, { i18n, language, currencySymbol }) {
  const f = compactFilters(filters);
  const chips = [];

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
  const range = (min, max, unit) => {
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

const CURRENCY_SYMBOLS = { EUR: "€", USD: "$" };

/** Symbole de la devise d'affichage, pour les champs de prix. */
export function currencySymbol(code) {
  return CURRENCY_SYMBOLS[code] ?? code ?? "€";
}

/**
 * Titre et sous-titre de la barre de recherche : le trajet d'abord, puis les
 * autres critères actifs, ou l'invitation à chercher s'il n'y en a aucun.
 */
export function searchSummary(chips, i18n) {
  const route = chips.find((chip) => chip.key === "route");
  const others = chips.filter((chip) => chip.key !== "route").map((chip) => chip.label);
  return {
    title: route?.label ?? i18n.t("filter_where_to"),
    subtitle: others.length > 0 ? others.join(" · ") : i18n.t("filter_search_hint"),
  };
}
