import { Text } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Formate une date localisée selon la langue actuelle
 */
export const formatLocalizedDate = (date, language = "en", style = "short") => {
  if (!date) return "";
  const dt = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(language, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(dt);
};

/**
 * Formate une heure localisée selon la langue actuelle
 */
export const formatLocalizedTime = (
  date,
  language = "en",
  includeSeconds = false
) => {
  if (!date) return "";

  // S'assurer que date est un objet Date valide
  const dt =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  if (!(dt instanceof Date) || isNaN(dt.getTime())) {
    return ""; // date invalide
  }

  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
    hour12: language === "en",
  }).format(dt);
};


/**
 * Formate date + heure localisée en un seul string
 */
export const formatLocalizedDateTime = (
  date,
  language = "en",
  dateStyle = "short",
  includeSeconds = false
) => {
  if (!date) return "";
  const dt = typeof date === "string" ? new Date(date) : date;

  const dateText = formatLocalizedDate(dt, language, dateStyle);
  const timeText = formatLocalizedTime(dt, language, includeSeconds);

  return `${dateText} • ${timeText}`;
};


/**
 * Composant React pour afficher une date/heure localisée
 */
const LocalizedDateTime = ({
  date,
  showDate = true,
  showTime = false,
  dateStyle = "short",
  includeSeconds = false,
  style,
}) => {
  const { language } = useLanguage();
  if (!date) return null;

  const dt = typeof date === "string" ? new Date(date) : date;

  let formatted = "";

  if (showDate && showTime) {
    formatted = formatLocalizedDateTime(dt, language, dateStyle, includeSeconds);
  } else if (showDate) {
    formatted = formatLocalizedDate(dt, language, dateStyle);
  } else if (showTime) {
    formatted = formatLocalizedTime(dt, language, includeSeconds);
  }

  return <Text style={style}>{formatted}</Text>;
};

export default LocalizedDateTime;
