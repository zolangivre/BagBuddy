import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { AIRPORT } from "@/constants/airports";
import i18n from "@/i18n";
import { PlaneLanding, PlaneTakeoff } from "lucide-react-native";

const AirportInputModal = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = null,
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAirports = useMemo(() => {
    if (!search) return AIRPORT;
    return AIRPORT.filter(
      (a) =>
        a.value.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50); // max 50 suggestions
  }, [search]);

  const handleSelect = (airport) => {
    onChangeText(airport.value);
    setModalVisible(false);
    setSearch("");
  };

  return (
    <View style={{ flex: 1, gap: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {label === i18n.t("departure") && (
          <PlaneTakeoff size={20} color={theme.text} />
        )}
        {label === i18n.t("arrival") && (
          <PlaneLanding size={20} color={theme.text} />
        )}
        {label && <Text style={theme.textStyles.bodyMedium}>{label}</Text>}
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.flightCard, color: theme.title },
              error && { borderWidth: 1, borderColor: Colors.error_color },
            ]}
            placeholder={placeholder}
            value={value}
            editable={false}
            placeholderTextColor={theme.text}
          />
        </View>
      </TouchableOpacity>

      {error ? <Text style={theme.textStyles.errorText}>{error}</Text> : null}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background_card },
            ]}
          >
            <TextInput
              style={[styles.modalSearch, { borderColor: theme.text }]}
              placeholder={i18n.t("search_airport")}
              placeholderTextColor={theme.title}
              color={theme.title}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />

            <FlatList
              data={filteredAirports}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={{ color: theme.title }}>
                    {item.value} - {item.city} ({item.name}) - {item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#FFF" }}>{i18n.t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 6,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    maxHeight: "80%",
    padding: 16,
  },
  modalSearch: {
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.primary_color,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default AirportInputModal;
