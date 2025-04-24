import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import Modal from "react-native-modal";
import { TouchableOpacityProps } from "react-native-gesture-handler";

type CustomModalProps = {
  style?: TouchableOpacityProps["style"];
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (event: GestureResponderEvent) => void;
  onCancel?: (event: GestureResponderEvent) => void;
};

const CustomModal: React.FC<CustomModalProps> = ({
  style,
  visible,
  onClose,
  title,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={[styles.modalContainer, style]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.content}>{children}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={onCancel ?? onClose}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.buttonText}>{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.button, styles.confirmButton]}
          >
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  content: {
    marginBottom: 24,
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "tomato",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
