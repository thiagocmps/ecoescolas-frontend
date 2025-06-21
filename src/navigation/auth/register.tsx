import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import api from "../../services/base-api-url";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setlsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  const navigation = useNavigation();

  function handleRegister() {
    console.log("Registrar pressionado");

    setlsLoading(true);
    if (password !== confirmPassword) {
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Erro",
        text2: "As palavras-passe não coincidem.",
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
        console.log("Registro bem-sucedido:", response.data);
        Toast.show({
          type: "success",
          text1: "Registro feito com sucesso!",
          text2: "Por favor, aguarde a validação da sua conta antes de fazer login.",
        });
        setlsLoading(false);
        navigation.goBack(); // Navegar para a tela de login após o registro
      })
      .catch((error) => {
        setlsLoading(false);
        console.error("Erro ao fazer registro:", error);
        if (error.response && error.response.status === 400) {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "Erro",
            text2: "Email já está em uso.",
          });
        } else {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "Erro",
            text2: "Ocorreu um erro inesperado.",
          });
        }
      });
  }
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
            setlsLoading(true);
            handleRegister();
          }}
          icon="person-add-outline"
          isLoading={loading}
          disabled={false}
          variant="outlined"
        />
      </ScrollView>
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
