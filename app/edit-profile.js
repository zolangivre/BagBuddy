import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Save } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import ButtonIcon from "../components/ButtonIcon";
import Input from "../components/Input";

export default function EditProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [location, setLocation] = useState("New York, NY");
  const [bio, setBio] = useState("Hello! I'm John.");

  const handleGoBack = () => {
    router.back();
  };

  const handleDelete = () => {
    console.log("Delete account");
  };

  const handleUpdateProfile = () => {
    // TODO: Implement update functionality
    console.log("Update listing");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={Colors.secondary_color} />}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>
        </View>
        <ButtonIcon
          onPress={handleUpdateProfile}
          icon={<Save size={24} color={Colors.error_color} />}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Flight Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            <View style={styles.cardContent}>
              {/* Flight Number */}
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
              />
              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                placeholder="Enter bio"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Delete Button */}
          <Button text="Delete account" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.612,
    borderBottomColor: Colors.very_light_grey,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  headerTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  cardContent: {
    padding: 24,
    paddingTop: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  rowInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  totalContainer: {
    backgroundColor: "rgba(224, 242, 254, 0.20)",
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.439,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeText: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  textArea: {
    backgroundColor: Colors.very_light_blue,
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.secondary_color,
    minHeight: 95,
  },
  helperText: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  tipsCard: {
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tipsTitle: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  tipsContent: {
    padding: 24,
    paddingTop: 16,
    gap: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
});
