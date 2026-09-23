import React, { useState } from "react";
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
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import i18n from "@/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDateTime } from "@/components/LocalizedDateTime";

const clampToMinimum = (date, minTime) =>
  minTime !== null && date.getTime() < minTime ? new Date(minTime) : date;

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
  // null plutôt que NaN pour une date invalide : NaN !== NaN relancerait la
  // resynchronisation ci-dessous à chaque rendu.
  const parsedMin = minimumDate ? new Date(minimumDate).getTime() : NaN;
  const minTime = Number.isNaN(parsedMin) ? null : parsedMin;
  const [tempDate, setTempDate] = useState(() =>
    value ? new Date(value) : clampToMinimum(new Date(), minTime)
  );
  const today = new Date();
  const { language } = useLanguage();

  // Resynchronise la date du sélecteur quand la valeur ou la date minimale
  // changent ; la valeur reçue l'emporte sur le plancher.
  const [prevValue, setPrevValue] = useState(value);
  const [prevMinTime, setPrevMinTime] = useState(minTime);
  if (value !== prevValue || minTime !== prevMinTime) {
    setPrevValue(value);
    setPrevMinTime(minTime);
    let nextDate =
      minTime !== prevMinTime ? clampToMinimum(tempDate, minTime) : tempDate;
    if (value && value !== prevValue) nextDate = new Date(value);
    setTempDate(nextDate);
  }

  const handleConfirm = (selectedDate) => {
    const date = selectedDate || tempDate;
    setTempDate(date);
    onChangeText(date.toISOString());
    setModalVisible(false);
  };

  const handlePressInput = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: tempDate,
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            const dateWithNewDate = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              tempDate.getHours(),
              tempDate.getMinutes()
            );

            DateTimePickerAndroid.open({
              value: dateWithNewDate,
              onChange: (timeEvent, selectedTime) => {
                if (selectedTime) {
                  const finalDate = new Date(
                    dateWithNewDate.getFullYear(),
                    dateWithNewDate.getMonth(),
                    dateWithNewDate.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                  );
                  handleConfirm(finalDate);
                }
              },
              mode: "time",
              is24Hour: true,
            });
          }
        },
        mode: "date",
        minimumDate: minimumDate || today,
        maximumDate: new Date(2100, 11, 31),
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={{ flex: 1, gap: 5 }}>
      {/* Label + Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Calendar size={20} color={theme.text} />
        {label && <Text style={theme.textStyles.bodyMedium}>{label}</Text>}
      </View>

      {/* Input */}
      <TouchableOpacity onPress={handlePressInput}>
        <View pointerEvents="none">
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.flightCard, color: theme.title },
              error && { borderWidth: 1, borderColor: Colors.error_color },
            ]}
            placeholder={placeholder}
            value={value ? formatLocalizedDateTime(value, language) : ""}
            editable={false}
            placeholderTextColor={theme.text}
          />
        </View>
      </TouchableOpacity>

      {error ? <Text style={theme.textStyles.errorText}>{error}</Text> : null}

      {/* Modal pour iOS */}
      {Platform.OS === "ios" && (
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.background_card },
              ]}
            >
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate);
                }}
                maximumDate={new Date(2100, 11, 31)}
                minimumDate={minimumDate || today}
                textColor={theme.title}
                locale={language}
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirm(tempDate)}
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
            </View>
          </View>
        </Modal>
      )}
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
