import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import i18n from "@/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

const DateInputModal = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = null,
  minimumDate = null,
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(
    value ? new Date(value) : new Date()
  );
  const today = new Date();
  const { language } = useLanguage();

  const displayDate = value
    ? (() => {
        const d = new Date(value);
        if (isNaN(d)) return ""; // sécurité
        return new Intl.DateTimeFormat(language, {
          weekday: "long", // jour de la semaine
          day: "numeric", // numéro du jour
          month: "long", // nom du mois
          year: "numeric", // année
        }).format(d);
      })()
    : "";

  // Mettre à jour tempDate si la date minimale change
  useEffect(() => {
    if (minimumDate) {
      const minDate = new Date(minimumDate);
      setTempDate((currentDate) => {
        if (currentDate < minDate) {
          return minDate;
        }
        return currentDate;
      });
    }
  }, [minimumDate]);

  const handleConfirm = () => {
    onChangeText(tempDate.toISOString().split("T")[0]);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, gap: 5 }}>
      {/* Label + Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Calendar size={20} color={theme.text} />
        {label && <Text style={theme.textStyles.bodyMedium}>{label}</Text>}
      </View>

      {/* Input */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.flightCard, color: theme.title },
              error && { borderWidth: 1, borderColor: Colors.error_color },
            ]}
            placeholder={placeholder}
            value={displayDate}
            editable={false}
            placeholderTextColor={theme.text}
          />
        </View>
      </TouchableOpacity>

      {error ? <Text style={theme.textStyles.errorText}>{error}</Text> : null}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background_card },
            ]}
          >
            {/* Date Picker */}
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                if (selectedDate) setTempDate(selectedDate);
                if (Platform.OS === "android") handleConfirm();
              }}
              maximumDate={new Date(2100, 11, 31)}
              minimumDate={minimumDate || today}
              textColor={theme.title}
              locale={language}
            />

            {/* Bouton de confirmation (iOS uniquement) */}
            {Platform.OS === "ios" && (
              <>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <Text style={[theme.textStyles.buttonText, { fontSize: 14 }]}>
                    {i18n.t("confirm")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[theme.textStyles.buttonText, { fontSize: 14 }]}>
                    {i18n.t("close")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
    padding: 16,
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.red,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.primary_color,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default DateInputModal;
