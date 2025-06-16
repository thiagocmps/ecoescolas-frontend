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
      <View style={[localStyles.modalContainer, style]}>
        {title && <Text style={localStyles.title}>{title}</Text>}
        <View style={localStyles.content}>{children}
        </View>
        <View style={localStyles.buttonsContainer}>
          <TouchableOpacity
            onPress={onCancel ?? onClose}
            style={[localStyles.button, localStyles.cancelButton]}
          >
            <Text style={localStyles.buttonText}>{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            style={[localStyles.button, localStyles.confirmButton]}
          >
            <Text style={localStyles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const localStyles = StyleSheet.create({
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
