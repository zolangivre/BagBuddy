import { View, TextInput, StyleSheet } from "react-native";
import { Search, Filter } from "lucide-react-native";
import Colors from "../theme/Colors";
import i18n from "@/i18n";

const SearchBar = () => {
  return (
    <View style={styles.searchBar}>
      <Filter size={20} color={Colors.tertiary_color} />
      <TextInput
        style={styles.searchInput}
        placeholder={i18n.t("search_placeholder")}
        placeholderTextColor={Colors.tertiary_color}
      />
      <Search size={20} color={Colors.tertiary_color} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.tertiary_color,
  },
});

export default SearchBar;
