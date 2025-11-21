import React, { useState } from "react";
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

const ReviewModal = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarPress = (starIndex) => {
    setRating(starIndex);
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{i18n.t("leave_a_review")}</Text>

          {/* Star rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Star
                  size={32}
                  color={star <= rating ? Colors.light_yellow : Colors.gray}
                  fill={star <= rating ? Colors.light_yellow : "none"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment input */}
          <TextInput
            style={styles.textInput}
            placeholder={i18n.t("write_your_review")}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          {/* Buttons */}
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
    backgroundColor: Colors.white,
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
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray_light,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
  },
});
