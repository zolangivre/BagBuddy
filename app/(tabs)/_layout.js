import { Stack } from "expo-router";
import BottomTabNavigator from "../../components/BottomTabNavigator";
import { View, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
