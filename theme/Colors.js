import { typography } from "./Fonts";

const material = {
  dark_grey: "#64748B",
  dark_grey_translucent: "#64748B1A",
  dark_grey_translucent_2: "#64748B33",

  dark_blue_grey: "#1E293B",
  white: "#FFFFFF",
  very_light_blue: "#F8FAFC",
  very_light_grey: "#E2E8F0",

  dark_cyan: "#0EA5E9",
  dark_cyan_translucent: "#0EA5E91A",
  dark_cyan_translucent_2: "#0EA5E933",
  dark_cyan_translucent_3: "#0EA5E90D",

  red: "#EF4444",
  red_translucent: "#EF44441A",
  red_translucent_2: "#EF444433",
  red_translucent_3: "#EF44440D",

  light_green: "#10B981",
  light_green_translucent: "#10B9811A",
  light_green_translucent_2: "#10B98133",
  light_green_translucent_3: "#10B9810D",

  light_yellow: "#F59E0B",
  light_yellow_translucent: "#F59E0B1A",
  light_yellow_translucent_2: "#F59E0B33",
  light_yellow_translucent_3: "#F59E0B0D",

  dark: "#0A0A0A",
  dark_2: "#171717",
  dark_3: "#A1A1A1",
  dark_4: "#262626",
  
};

export default {
  primary_color: material.dark_cyan,
  secondary_color: material.dark_blue_grey,
  tertiary_color: material.dark_grey,
  quarternary_color: material.dark_cyan,
  success_color: material.light_green,
  error_color: material.red,
  background_color: material.white,
  light_yellow: material.light_yellow,

  browse_listing_badge_background: material.dark_grey_translucent,
  browse_listing_badge_border: material.dark_grey_translucent_2,

  waiting_for_response_badge_background: material.dark_cyan_translucent,
  waiting_for_response_badge_border: material.dark_cyan_translucent_2,

  waiting_for_response_seller_badge_background: material.red_translucent,
  waiting_for_response_seller_badge_border: material.red_translucent_2,

  request_rejected_badge_background: material.red_translucent,
  request_rejected_badge_border: material.red_translucent_2,

  payment_required_badge_background: material.dark_cyan_translucent,
  payment_required_badge_border: material.dark_cyan_translucent_2,

  confirmed_badge_background: material.light_green_translucent,
  confirmed_badge_border: material.light_green_translucent_2,

  completed_badge_background: material.light_green,
  completed_badge_border: material.light_green_translucent_2,
  completed_status_card_background: material.light_green_translucent,

  cancelled_badge_background: material.red_translucent,
  cancelled_badge_border: material.red_translucent_2,

  reservation_received_badge_background: material.light_yellow_translucent,
  reservation_received_badge_border: material.light_yellow_translucent_2,

  awaiting_payment_badge_background: material.dark_cyan_translucent,
  awaiting_payment_badge_border: material.dark_cyan_translucent_2,
  ...material,
  light: {
    startBackground: [
      "rgba(14, 165, 233, 0.05)",
      "#FFFFFF",
      "rgba(224, 242, 254, 0.10)",
    ],
    background: material.white,
    background_card: material.white,
    title: material.dark_blue_grey,
    title_inverse: material.white,
    text: material.dark_grey,
    navBackground: material.white,
    navTopBorder: material.very_light_grey,
    flightCard:
      "linear-gradient(90deg, rgba(224, 242, 254, 0.30) 0%, rgba(224, 242, 254, 0.20) 50%, rgba(224, 242, 254, 0.30) 100%)",
    
    textStyles: {
      // === TITRES ===
      display: { ...typography.display, color: material.dark_blue_grey },
      titleLarge: { ...typography.headline1, color: material.white },
      titleMedium: { ...typography.headline2, color: material.dark_blue_grey },
      titleSmall: { ...typography.headline3, color: material.dark_blue_grey },
      cardStatusTitle: {
        ...typography.cardStatusTitle,
        color: material.dark_blue_grey,
      },
      // === SOUS-TITRES / SECTIONS ===
      subtitle: { ...typography.subtitle, color: material.dark_grey },
      sectionTitle: { ...typography.title2, color: material.dark_blue_grey },

      // === TEXTE DE CONTENU ===
      bodyLarge: { ...typography.body1, color: material.dark_grey },
      bodyMedium: { ...typography.body2, color: material.dark_grey },
      bodySmall: { ...typography.body3, color: material.dark_grey },

      // === LABELS / INFOS ===
      label: { ...typography.label, color: material.dark_grey },
      caption: { ...typography.caption, color: material.dark_grey },

      // === CHIFFRES / STATS ===
      statValue: { ...typography.headline3, color: material.dark_blue_grey },
      statLabel: { ...typography.body3, color: material.dark_grey },

      // === BADGES & ÉTATS ===
      badgeText: { ...typography.label, color: material.dark_cyan },
      successText: { ...typography.body2, color: material.light_green },
      errorText: { ...typography.body2, color: material.red },

      // === BOUTONS ===
      buttonText: { ...typography.button, color: material.white },

      // === HEADERS / CARDS ===
      headerTitle: { ...typography.title2, color: material.dark_blue_grey },
      cardTitle: { ...typography.subtitle, color: material.dark_blue_grey },
      cardSubtitle: { ...typography.body3, color: material.dark_grey },

      // === DIVERS ===
      highlight: { ...typography.body1, color: material.dark_cyan },
      muted: { ...typography.body1, color: material.very_light_grey },
      number: { ...typography.headline2, color: material.dark_cyan },
    },
  },

  dark: {
    startBackground: [material.dark, material.dark_2, material.dark],
    background: material.dark,
    background_card: material.dark_2,
    title: material.white,
    title_inverse: material.dark_blue_grey,
    text: material.dark_3,
    navBackground: material.dark_2,
    navTopBorder: material.dark_4,
    flightCard:
      "linear-gradient(90deg, rgba(38.09, 38.09, 38.09, 0.30) 0%, rgba(38.09, 38.09, 38.09, 0.20) 50%, rgba(38.09, 38.09, 38.09, 0.30) 100%)",
    textStyles: {
      display: { ...typography.display, color: material.white },
      titleLarge: { ...typography.headline1, color: material.white },
      titleMedium: { ...typography.headline2, color: material.white },
      titleSmall: { ...typography.headline3, color: material.white },
      cardStatusTitle: {
        ...typography.cardStatusTitle,
        color: material.dark_blue_grey,
      },

      subtitle: { ...typography.subtitle, color: material.dark_3 }, 
      sectionTitle: { ...typography.title2, color: material.white }, 

      bodyLarge: { ...typography.body1, color: material.dark_3 },
      bodyMedium: { ...typography.body2, color: material.dark_3 }, 
      bodySmall: { ...typography.body3, color: material.dark_3 }, 

      label: { ...typography.label, color: material.dark_3 },
      caption: { ...typography.caption, color: material.dark_3 }, 

      statValue: { ...typography.headline3, color: material.white },
      statLabel: { ...typography.body3, color: material.dark_3 },

      badgeText: { ...typography.label, color: material.dark_cyan }, 
      successText: { ...typography.body2, color: material.light_green }, 
      errorText: { ...typography.body2, color: material.red }, 

      buttonText: { ...typography.button, color: material.white }, 

      headerTitle: { ...typography.title2, color: material.white }, 
      cardTitle: { ...typography.title3, color: material.white }, 
      cardSubtitle: { ...typography.body3, color: material.dark_3 }, 

      highlight: { ...typography.body1, color: material.dark_cyan }, 
      muted: { ...typography.body1, color: material.very_light_grey },
      number: { ...typography.headline2, color: material.dark_cyan }, 
    },
  },
};
