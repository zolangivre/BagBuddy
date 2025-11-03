import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Star } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ButtonIcon from "@/components/ButtonIcon";
import { useRouter } from "expo-router";
import mockReviews from "@/mockData/mockReviews";
import ReviewCard from "@/components/ReviewCard";

const ProfileView = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={{ backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <ButtonIcon
              onPress={handleGoBack}
              icon={<ArrowLeft size={24} color={Colors.white} />}
            />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>SC</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 4 }}>
              <Text style={styles.userName}>Sarah Chen</Text>
              <Text style={styles.userLocation}>San Francisco, CA</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Recent Transactions */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <View style={[styles.rowContainer, { gap: 4 }]}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <Text style={theme.textStyles.titleMedium}>4.8</Text>
                </View>
                <Text style={theme.textStyles.bodySmall}>Rating</Text>
              </View>
              <View style={styles.columnContainer}>
                <Text style={theme.textStyles.titleMedium}>47</Text>
                <Text style={theme.textStyles.bodySmall}>Transactions</Text>
              </View>
              <View style={styles.columnContainer}>
                <Text
                  style={[
                    theme.textStyles.titleMedium,
                    { color: theme.success_color },
                  ]}
                >
                  98%
                </Text>
                <Text style={theme.textStyles.bodySmall}>Success rate</Text>
              </View>
            </View>
          </View>
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={{ alignItems: "center", marginBottom: 16, gap: 8 }}>
              <Text
                style={[
                  theme.textStyles.display,
                  { color: theme.title, fontSize: 48 },
                ]}
              >
                4.8
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Star
                  size={20}
                  color={Colors.light_yellow}
                  fill={Colors.light_yellow}
                />
                <Star
                  size={20}
                  color={Colors.light_yellow}
                  fill={Colors.light_yellow}
                />
                <Star
                  size={20}
                  color={Colors.light_yellow}
                  fill={Colors.light_yellow}
                />
                <Star
                  size={20}
                  color={Colors.light_yellow}
                  fill={Colors.light_yellow}
                />
                <Star
                  size={20}
                  color={Colors.light_yellow}
                  fill={Colors.light_yellow}
                />
              </View>
              <Text style={theme.textStyles.bodyLarge}>4 reviews</Text>
            </View>
            {/* <View style={{ marginBottom: 16, gap: 8 }}>
              <View
                style={{
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <ProgressBar step={5} totalSteps={5} width={100} />
                  <Text style={theme.textStyles.bodySmall}>3</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <ProgressBar step={5} totalSteps={5} width={100} />
                  <Text style={theme.textStyles.bodySmall}>3</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <ProgressBar step={5} totalSteps={5} width={100} />
                  <Text style={theme.textStyles.bodySmall}>3</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <ProgressBar step={5} totalSteps={5} width={100} />
                  <Text style={theme.textStyles.bodySmall}>3</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <ProgressBar step={5} totalSteps={5} width={100} />
                  <Text style={theme.textStyles.bodySmall}>3</Text>
                </View>
              </View>
            </View> */}
          </View>
          {/* Review List */}
          <View style={{ gap: 16, marginBottom: 50 }}>
            {mockReviews.map((review) => (
              <>
                <View
                  style={[
                    styles.card,
                    { backgroundColor: theme.background_card },
                  ]}
                >
                  <ReviewCard key={review.id} review={review} />
                </View>
              </>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: Colors.primary_color,
    fontSize: 32,
    fontWeight: "600",
  },
  userName: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerTextContainer: {
    marginBottom: 8,
  },
  userLocation: {
    color: Colors.very_light_grey,
    fontSize: 16,
    fontWeight: "400",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 15,
    gap: 25,
  },
  card: {
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 25,
  },
  transactionsHeader: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
});

export default ProfileView;
