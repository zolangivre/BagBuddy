/**
 * Taux de change pour l'affichage uniquement. Le serveur fixe les prix et
 * encaisse en EUR : une autre devise n'est qu'une estimation montrée à côté.
 *
 * Source : Frankfurter (https://frankfurter.dev), gratuit, sans clé ni quota
 * mensuel, alimenté par les taux quotidiens des banques centrales. Un taux par
 * jour ouvré suffit : on le garde en cache et on ne le relit que s'il a vieilli.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Devise dans laquelle le serveur exprime et encaisse tous les montants. */
export const BASE_CURRENCY = "EUR";

/** Devises proposées à l'affichage, en plus de la devise de base. */
export const DISPLAY_CURRENCIES = ["EUR", "USD"] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

/** Nombre d'unités de chaque devise pour 1 EUR. */
export type Rates = Partial<Record<DisplayCurrency, number>>;

export interface CachedRates {
  rates: Rates;
  /** Jour de publication des taux, « YYYY-MM-DD ». */
  date: string | null;
  /** Date de lecture, en ms depuis l'epoch. */
  fetchedAt: number;
}

/**
 * Repli tant qu'aucun taux n'a jamais pu être lu (premier lancement hors
 * ligne). Taux BCE du 24/09/2026 : l'ordre de grandeur suffit pour une estimation.
 */
export const FALLBACK_RATES: Rates = { EUR: 1, USD: 1.14 };

const STORAGE_KEY = "exchangeRates";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;
const QUOTES = DISPLAY_CURRENCIES.filter((code) => code !== BASE_CURRENCY);
const ENDPOINT = `https://api.frankfurter.dev/v2/rates?base=${BASE_CURRENCY}&quotes=${QUOTES.join(",")}`;

/**
 * Lit la réponse de Frankfurter v2 : un tableau
 * `[{ date, base, quote, rate }]`. Rend null si elle ne contient aucun taux
 * utilisable, pour ne jamais remplacer un bon cache par une réponse vide.
 */
export function parseFrankfurterRates(
  payload: unknown
): { rates: Rates; date: string | null } | null {
  if (!Array.isArray(payload)) return null;
  const rates: Rates = { [BASE_CURRENCY]: 1 };
  let date: string | null = null;
  for (const entry of payload) {
    const quote = entry?.quote;
    const rate = entry?.rate;
    if (
      entry?.base === BASE_CURRENCY &&
      (DISPLAY_CURRENCIES as readonly string[]).includes(quote) &&
      typeof rate === "number" &&
      Number.isFinite(rate) &&
      rate > 0
    ) {
      rates[quote as DisplayCurrency] = rate;
      date = typeof entry.date === "string" ? entry.date : date;
    }
  }
  return Object.keys(rates).length > 1 ? { rates, date } : null;
}

export function isStale(cached: CachedRates | null, now = Date.now()): boolean {
  return !cached || now - cached.fetchedAt > MAX_AGE_MS;
}

export async function readCachedRates(): Promise<CachedRates | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    return cached && typeof cached.fetchedAt === "number" && cached.rates
      ? (cached as CachedRates)
      : null;
  } catch {
    return null;
  }
}

/** Lit les taux du jour et les met en cache. Rend null en cas d'échec. */
export async function fetchRates(): Promise<CachedRates | null> {
  try {
    const response = await fetch(ENDPOINT);
    if (!response.ok) return null;
    const parsed = parseFrankfurterRates(await response.json());
    if (!parsed) return null;
    const cached: CachedRates = { ...parsed, fetchedAt: Date.now() };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cached)).catch(() => {});
    return cached;
  } catch {
    return null;
  }
}

/** Convertit un montant en EUR vers `currency`, ou null sans taux connu. */
export function convertFromBase(
  amount: number,
  currency: string,
  rates: Rates
): number | null {
  if (currency === BASE_CURRENCY) return amount;
  const rate = rates[currency as DisplayCurrency];
  return rate ? amount * rate : null;
}
