import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import CustomModal from "./modal/modal";
import api from "../services/base-api-url";

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export type EmailVerificationRef = {
  startVerification: () => Promise<boolean>;
  email: string;
};

interface EmailVerificationWithModalProps {
  email: string;
}

interface Resolver {
  (result: boolean): void;
}

const EmailVerificationWithModal = forwardRef<EmailVerificationRef, EmailVerificationWithModalProps>(
  ({ email }, ref) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [codeInput, setCodeInput] = useState<string>("");
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [resolver, setResolver] = useState<Resolver>(() => () => {});

    useImperativeHandle(ref, () => ({
      startVerification: (): Promise<boolean> => {
        const code = generateCode();
        setGeneratedCode(code);
        console.log("Código gerado:", code);
        api.post("/users/sendmail", {
          email: email, 
          code: code
        });
        setModalVisible(true);
        return new Promise((resolve) => {
          setResolver(() => resolve);
        });
      },
      email,
    }));

    const handleVerifyCode = (): void => {
      if (codeInput === generatedCode) {
        setModalVisible(false);
        setCodeInput("");
        resolver(true);
      } else {
        Alert.alert("❌ Erro", "Código incorreto, tente novamente.");
      }
    };

    return (
      <CustomModal
        visible={modalVisible}
        title="Verificação de Email"
        onClose={() => {
          setModalVisible(false);
          setCodeInput("");
          resolver(false);
        }}
        onCancel={() => {
          setModalVisible(false);
          setCodeInput("");
          resolver(false);
        }}
        onConfirm={handleVerifyCode}
        confirmText="Verificar"
        cancelText="Cancelar"
      >
        <Text style={styles.instruction}>
          Insira o código de 6 dígitos enviado:
        </Text>
        <TextInput
          style={styles.input}
          value={codeInput}
          onChangeText={setCodeInput}
          keyboardType="numeric"
          maxLength={6}
          placeholder="000000"
        />
      </CustomModal>
    );
  }
);

export default EmailVerificationWithModal;

const styles = StyleSheet.create({
  instruction: {
    marginBottom: 12,
    fontSize: 14,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 160,
    textAlign: "center",
    fontSize: 18,
    marginTop: 8,
  },
});
