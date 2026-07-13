import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";

const AlertModal = ({
  visible,
  onClose,
  title = "",
  message = "",
  buttons = [
    { text: "Annuler", onPress: onClose, style: "cancel" },
    { text: "OK", onPress: onClose, style: "default" },
  ],
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background_card }]}>
          {title ? (
            <Text style={theme.textStyles.titleSmall}>{title}</Text>
          ) : null}
          {message ? (
            <Text style={theme.textStyles.bodyMedium}>
              {message}
            </Text>
          ) : null}

          <View style={styles.buttonsContainer}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.style === "cancel" && styles.cancelButton,
                  btn.style === "destructive" && styles.destructiveButton,
                ]}
                onPress={btn.onPress}
              >
                <Text
                  style={[
                    theme.textStyles.buttonText, { fontSize: 14 },
                    btn.style === "destructive" && { color: Colors.white },
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    gap: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary_color,
  },
  cancelButton: {
    backgroundColor: Colors.dark_cyan,
  },
  destructiveButton: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default AlertModal;
