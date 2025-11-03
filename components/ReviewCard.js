import { View, Text } from "react-native";
import Colors from "../theme/Colors";
import { useThemeContext } from "../contexts/ThemeContext";
import { Star } from "lucide-react-native";
import Avatar from "./Avatar";

const ReviewCard = ({ review }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const StarsReview = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i < rating ? Colors.light_yellow : Colors.grey}
          fill={i < rating ? Colors.light_yellow : "none"}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };
  return (
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Avatar initials={review.name.charAt(0)} size={40} />
        <View style={{ flexDirection: "column", gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <Text style={theme.textStyles.titleMedium}>{review.name}</Text>
            <Text style={theme.textStyles.bodySmall}>{review.date}</Text>
          </View>
          <StarsReview rating={review.rating} />
          <Text style={theme.textStyles.bodyMedium}>{review.comment}</Text>
        </View>
      </View>
  );
};

export default ReviewCard;
