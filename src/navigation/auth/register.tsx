import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import api from "../../services/baseApiUrl";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

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
          type: "success", // 'success' | 'error' | 'info'
          text1: "Registro feito com sucesso!",
          text2: "Por favor, faça login para continuar 😊",
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
    <View style={styles.screenContainer}>
      <View style={{ gap: 16, width: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={[styles.container, { width: isLargeScreen ? "35%" : "100%" }]}>
          <Input
            placeholder="Digite aqui seu nome"
            onChangeText={setFirstName}
            icon="person-outline"
            value={firstName}
            label="Primeiro nome:"
          ></Input>
          <Input
            placeholder="Digite aqui seu sobrenome"
            onChangeText={setLastName}
            value={lastName}
            icon="person-outline"
            label="Sobrenome:"
          ></Input>
          <Input
            placeholder="Digite aqui seu email da ESMAD"
            onChangeText={setEmail}
            value={email}
            icon="mail-outline"
            label="Email:"
          ></Input>
        </View>
        <View style={[styles.container, { width: isLargeScreen ? "35%" : "100%" }]}>
          <Input
            placeholder="Digite aqui sua palavra-passe"
            onChangeText={setPassword}
            value={password}
            icon="lock-closed-outline"
            secureTextEntry={true}
            label="Palavra-passe:"
          ></Input>
          <Input
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
        style={{ width: isLargeScreen ? "40%" : "100%" }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#ffff",
    paddingVertical: 16,
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

