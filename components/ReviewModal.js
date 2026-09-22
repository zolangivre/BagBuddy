import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Star } from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import i18n from "@/i18n";
import { useThemeContext } from "@/contexts/ThemeContext";

const ReviewModal = ({ visible, onClose, onSubmit, review }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  useEffect(() => {
    if (visible) {
      setRating(review ? review.rating : 0);
      setComment(review ? review.comment : "");
      setError(""); // reset errors on open
    }
  }, [visible, review]);

  const handleSubmit = () => {
    if (rating === 0) {
      setError(i18n.t("error_no_rating"));
      return;
    }
    if (!comment.trim()) {
      setError(i18n.t("error_no_comment"));
      return;
    }

    setError("");
    onSubmit({ rating, comment });
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background_card },
          ]}
        >
          <Text style={[styles.title, { color: theme.title }]}>
            {i18n.t("leave_a_review")}
          </Text>

          {/* Stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={32}
                  color={star <= rating ? Colors.light_yellow : theme.title}
                  fill={star <= rating ? Colors.light_yellow : "none"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.modalSearch, { borderColor: theme.text }]}
            placeholder={i18n.t("write_your_review")}
            placeholderTextColor={theme.title}
            color={theme.title}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          {/* Display error */}
          {error ? (
            <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
          ) : null}

          <View style={styles.buttons}>
            <Button
              text={i18n.t("submit")}
              color={Colors.light_yellow}
              onPress={handleSubmit}
            />
            <Button
              text={i18n.t("cancel")}
              color={Colors.gray}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  modalSearch: {
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
  },
});
