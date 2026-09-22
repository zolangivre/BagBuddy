import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import Colors from "@/theme/Colors";
import { Eraser, Filter, ListFilter } from "lucide-react-native";
import i18n from "@/i18n";
import FilterModal from "@/components/FilterModal";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function ActionBar({
  onFilterApply,
  onClear,
  showStatusFilter = false,
  selectedStatus = null,
  selectedSort = null,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const statuses = [
    { label: i18n.t("all_statuses"), value: null },
    { label: i18n.t("waiting_for_response"), value: "waiting_for_response" },
    { label: i18n.t("request_rejected"), value: "request_rejected" },
    { label: i18n.t("payment_required"), value: "payment_required" },
    { label: i18n.t("reservation_received"), value: "reservation_received" },
    { label: i18n.t("awaiting_payment"), value: "awaiting_payment" },
    { label: i18n.t("confirmed"), value: "confirmed" },
  ];

  const sortOptions = [
    { label: "Plus récents", value: "recent" },
    { label: "Départs proches", value: "earliest_departure" },
    { label: "Prix le plus bas", value: "price_low" },
    { label: "Prix le plus haut", value: "price_high" },
    { label: "Poids maximum", value: "weight_high" },
    { label: "Poids minimum", value: "weight_low" },
  ];

  const handleSortSelect = (sort) => {
    onFilterApply && onFilterApply({ sort });
    setSortModalVisible(false);
  };

  const handleFilterApply = (filters) => {
    onFilterApply && onFilterApply(filters);
    setModalVisible(false);
  };

  const handleStatusSelect = (status) => {
    onFilterApply && onFilterApply({ status });
    setStatusModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Filter size={20} color={Colors.white} />
        <Text style={styles.buttonText}>{i18n.t("filters")}</Text>
      </TouchableOpacity>

      {showStatusFilter && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStatusModalVisible(true)}
        >
          <ListFilter size={20} color={Colors.white} />
          <Text style={styles.buttonText}>Statut</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setSortModalVisible(true)}
      >
        <ListFilter size={20} color={Colors.white} />
        <Text style={styles.buttonText}>{i18n.t("sort")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.red }]}
        onPress={onClear}
      >
        <Eraser size={20} color={Colors.white} />
      </TouchableOpacity>

      {/* Modals */}
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleFilterApply}
      />

      {showStatusFilter && (
        <Modal transparent visible={statusModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.background_card },
              ]}
            >
              <FlatList
                data={statuses}
                keyExtractor={(item) => item.value ?? "all"}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      selectedStatus === item.value && {
                        backgroundColor: Colors.lightGray,
                      },
                    ]}
                    onPress={() => handleStatusSelect(item.value)}
                  >
                    <Text
                      style={{
                        color:
                          selectedStatus === item.value
                            ? Colors.primary_color
                            : theme.title,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setStatusModalVisible(false)}
              >
                <Text style={{ color: Colors.white }}>{i18n.t("close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Modal transparent visible={sortModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background_card },
            ]}
          >
            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    selectedSort === item.value && {
                      backgroundColor: Colors.lightGray,
                    },
                  ]}
                  onPress={() => handleSortSelect(item.value)}
                >
                  <Text
                    style={{
                      color:
                        selectedSort === item.value
                          ? Colors.primary_color
                          : theme.title,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={{ color: Colors.white }}>{i18n.t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  statusModal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: 250,
  },
  modalContainer: {
    borderRadius: 16,
    maxHeight: "80%",
    padding: 16,
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
