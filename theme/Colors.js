const material = {
  dark_grey: "#64748B",
  dark_blue_grey: "#1E293B",
  white: "#FFFFFF",
  very_light_blue: "#F8FAFC",
  very_light_grey: "#E2E8F0",

  dark_cyan: "#0EA5E9",
  dark_cyan_translucent: "#0EA5E91A",
  dark_cyan_translucent_2: "#0EA5E933",

  red: "#EF4444",
  red_translucent: "#EF44441A",
  red_translucent_2: "#EF444433",

  light_green: "#10B981",
  light_green_translucent: "#10B9811A",
  light_green_translucent_2: "#10B98133",

  light_yellow: "#F59E0B",
  light_yellow_translucent: "#F59E0B1A",
  light_yellow_translucent_2: "#F59E0B33",
};

export default {
  primary_color: material.dark_cyan,
  secondary_color: material.dark_blue_grey,
  tertiary_color: material.dark_grey,
  quarternary_color: material.dark_cyan,
  success_color: material.light_green,
  error_color: material.red,
  background_color: material.white,
  
  browse_listing_badge_background: material.very_light_blue,
  browse_listing_badge_border: material.very_light_grey,

  waiting_for_response_badge_background: material.dark_cyan_translucent,
  waiting_for_response_badge_border: material.dark_cyan_translucent_2,

  request_rejected_badge_background: material.red_translucent,
  request_rejected_badge_border: material.red_translucent_2,

  payment_required_badge_background: material.dark_cyan_translucent,
  payment_required_badge_border: material.dark_cyan_translucent_2,

  confirmed_badge_background: material.light_green_translucent,
  confirmed_badge_border: material.light_green_translucent_2,

  completed_badge_background: material.light_green,
  completed_badge_border: material.light_green_translucent_2,

  cancelled_badge_background: material.red_translucent,
  cancelled_badge_border: material.red_translucent_2,

  reservation_received_badge_background: material.light_yellow_translucent,
  reservation_received_badge_border: material.light_yellow_translucent_2,

  awaiting_payment_badge_background: material.dark_cyan_translucent,
  awaiting_payment_badge_border: material.dark_cyan_translucent_2,

  // disabled_background_color: material.medium_grey,
  // disabled_foreground_color: material.dark_grey,
  // text_on_colored_background: material.dark_brown,
  // loading_background_color: material.light_yellow,
  ...material,
};