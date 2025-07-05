import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import api from "../../services/base-api-url";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import EmailVerificationModal, {
  EmailVerificationRef,
} from "../../components/email-verification-modal";
import { useRef } from "react";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setlsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalConfirmEmail, setModalConfirmEmail] = useState(true);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  const navigation = useNavigation();

  const emailVerificationRef = useRef<EmailVerificationRef>(null);

  function handleRegister() {
    console.log("Registrar pressionado");

    setlsLoading(false);
    if (password !== confirmPassword) {
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Erro",
        text2: "As palavras-passe não coincidem",
      });
      setlsLoading(false);
      return;
    }

    api
      .post("/users/register", {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      })
      .then(async (response) => {
        if (response.status === 200) {
          Toast.show({
            type: "success",
            text1: "Registro feito com sucesso!",
            text2:
              "Por favor, aguarde a validação da sua conta antes de fazer login.",
          });
          setlsLoading(false);
          navigation.goBack(); 
        }
      })
      .catch((error) => {
        setlsLoading(false);
        if (error.response.status === 406) {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "Email já em uso",
            text2: "Por favor, registre um email diferente",
          });
        } else if (error.response.status === 400) {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "Erro",
            text2: "Ocorreu um erro inesperado.",
          });
        }
      });
  }

  // Novo onPress do botão
  const handlePressRegister = async () => {
    if (emailVerificationRef.current) {
      const verified = await emailVerificationRef.current.startVerification();
      if (verified) {
        Toast.show({
          type: "success",
          text1: "Email Válidado",
          text2:
            "Registro feito com sucesso! Espere, um administrador validar sua conta",
        });
        handleRegister();
      }
    }
  };
  return (
    <View style={localStyles.screenContainer}>
      <ScrollView
        style={localStyles.scrollContainer}
        contentContainerStyle={[
          localStyles.scrollableScreenContainer,
          {
            marginBottom: isLargeScreen ? 100 : 0,
            gap: isLargeScreen ? 20 : 0,
          },
        ]}
      >
        <View
          style={{
            gap: 16,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              localStyles.contentContainer,
              { width: isLargeScreen ? "35%" : "100%" },
            ]}
          >
            <Input
              type="input"
              placeholder="Digite aqui seu nome"
              onChangeText={setFirstName}
              icon="person-outline"
              value={firstName}
              label="Primeiro nome:"
            ></Input>
            <Input
              type="input"
              placeholder="Digite aqui seu sobrenome"
              onChangeText={setLastName}
              value={lastName}
              icon="person-outline"
              label="Sobrenome:"
            ></Input>
            <Input
              type="input"
              placeholder="Digite aqui seu email da ESMAD"
              onChangeText={setEmail}
              value={email}
              icon="mail-outline"
              label="Email:"
            ></Input>
          </View>
          <View
            style={[
              localStyles.contentContainer,
              { width: isLargeScreen ? "35%" : "100%" },
            ]}
          >
            <Input
              type="input"
              placeholder="Digite aqui sua palavra-passe"
              onChangeText={setPassword}
              value={password}
              icon="lock-closed-outline"
              secureTextEntry={true}
              label="Palavra-passe:"
            ></Input>
            <Input
              type="input"
              placeholder="Confirme sua palavra-passe"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              icon="lock-closed-outline"
              secureTextEntry={true}
              label="Confirmação de palavra-passe:"
            ></Input>
          </View>
        </View>
        <Button
          style={{ width: isLargeScreen ? "35%" : "100%" }}
          title="Registrar"
          onPress={() => {
            console.log("Registrar pressionado");
            if (email === "") {
              Toast.show({
                type: "error",
                text1: "Email inválido",
                text2: "Por favor, preencha o campo com um email ESMAD válido",
              });
              return undefined;
            }
            if (lastName === "" || lastName === "") {
              Toast.show({
                type: "error",
                text1: "Nome inválido",
                text2: "Por favor, preencha um nome válido",
              });
              return undefined;
            }
            if (password.length < 8 || password === "") {
              Toast.show({
                type: "error",
                text1: "Senhas inválida",
                text2: "A senha deve ter no mínimo 8 digitos",
              });
              return undefined;
            }
            if (password !== confirmPassword) {
              Toast.show({
                type: "error",
                text1: "Senhas incompatíveis",
                text2: "Deve por a mesma senha em ambos os campos",
              });
              return undefined;
            }

            handlePressRegister();
            setlsLoading(false);
            /* handleRegister(); */
          }}
          icon="person-add-outline"
          isLoading={loading}
          disabled={false}
          variant="outlined"
        />
      </ScrollView>
      <EmailVerificationModal ref={emailVerificationRef} email={email} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContainer: {
    width: "100%",
    height: "100%",
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  scrollableScreenContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#ffff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
