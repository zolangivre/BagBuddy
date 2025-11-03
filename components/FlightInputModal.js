import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { Search, Plane } from "lucide-react-native";

const FlightInputModal = ({
  label,
  value,
  onChangeText,
  placeholder,
  departure,
  arrival,
  flightDate,
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  // 🔍 Recherche ciblée selon le numéro de vol
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://api.aviationstack.com/v1/flights", {
        params: {
          access_key: "2ec7ad5f94f867a21966899c94709e9d",
          dep_scheduled_time_dep: "2025-11-12",
          dep_iata: departure || "",
          arr_iata: arrival || "",
        },
      });
      setFlights(res.data.data || []);
      console.log("Flight search results:", res.data.data);
      console.log(flightDate.length);
      if (!res.data.data?.length) {
        setError(i18n.t("no_results") || "Aucun vol trouvé.");
      }
    } catch (err) {
      console.error(err);
      setError(i18n.t("error_loading_flights") || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (flight) => {
    onChangeText(flight.flight?.iata);
    setModalVisible(false);
    setSearch("");
    setFlights([]);
  };

  const renderFlight = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: theme.border }]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[styles.flightNumber, { color: theme.title }]}>
        ✈️ {item.flight?.iata || "N/A"} — {item.airline?.name || "Inconnue"}
      </Text>
      <Text style={[styles.flightRoute, { color: theme.text }]}>
        {item.departure?.airport || "?"} → {item.arrival?.airport || "?"}
      </Text>
      <Text style={[styles.flightStatus, { color: theme.text }]}>
        {i18n.t("status") || "Statut"} :{" "}
        {item.flight_status ? item.flight_status.toUpperCase() : "N/A"}
      </Text>
      <Text style={[styles.flightDate, { color: theme.text }]}>
        {i18n.t("date") || "Date"} : {item.flight_date || "-"}
      </Text>
      <Text style={[styles.flightDate, { color: theme.text }]}>
        { "Date scheduled"} : {item.dep_scheduled_time_dep || "-"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Label + icône */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Plane size={20} color={theme.text} />
        {label && (
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        )}
      </View>

      {/* Input cliquable */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.flightCard, color: theme.title },
            ]}
            placeholder={placeholder || "Ex: AF123"}
            value={value}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background_card },
            ]}
          >
            {/* Barre de recherche */}
            <View style={styles.searchRow}>
              <TextInput
                style={[
                  styles.modalSearch,
                  { borderColor: theme.text, color: theme.title },
                ]}
                placeholder={
                  i18n.t("search_flight") || "Numéro de vol (ex: AF123)"
                }
                placeholderTextColor={theme.title}
                value={search}
                onChangeText={setSearch}
                autoFocus
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Search color={theme.text} size={22} />
              </TouchableOpacity>
            </View>

            {/* Loader / Erreur / Résultats */}
            {loading ? (
              <ActivityIndicator size="large" color={theme.text} />
            ) : error ? (
              <Text style={[styles.error, { color: theme.text }]}>{error}</Text>
            ) : (
              <FlatList
                data={flights}
                keyExtractor={(item, i) => item.flight?.iata + i}
                keyboardShouldPersistTaps="handled"
                renderItem={renderFlight}
              />
            )}

            {/* Bouton fermer */}
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: Colors.primary_color },
              ]}
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
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
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  flightRoute: {
    fontSize: 14,
  },
  flightStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  flightDate: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default FlightInputModal;
