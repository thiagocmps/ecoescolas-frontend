import react, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/button/button";
import TextInput from "../../components/input/input";
import api from "../../services/api";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../routes";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

const logo = require("../../../assets/eco-escolas.png");

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setlsLoading] = useState(false);
  async function loginAuth() {
    console.log("Entrar pressionado");
    setlsLoading(true);
    api
      .post("/users/login", {
        email: email,
        password: password,
      })
      .then(async (response) => {
        console.log("Login bem-sucedido:", response.data);
        Toast.show({
          type: "success", // 'success' | 'error' | 'info'
          text1: "Login feito com sucesso!",
          text2: "Bem-vindo de volta 👋",
        });
        setlsLoading(false);
        /* Guardar o Token aqui */
        await SecureStore.setItemAsync("token", response.data);
        const token = await SecureStore.getItemAsync("token");
        console.log("Token armazenado: ", token);
        console.log("Token:", token);
        navigation.navigate("BottomNavigator"); // Navegar para a tela principal após o login
      })
      .catch((error) => {
        setlsLoading(false);
        console.error("Erro ao fazer login:", error);
      });
  }

  return (
    <View style={styles.screenContainer}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <View style={styles.imageContainer}>
        <Image source={logo} style={{ width: 200, height: 200 }} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite o seu email da ESMAD"
          label="Email:"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />
        <TextInput
          placeholder="Digite sua palavra-passe"
          label="Palavra-passe:"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          icon="lock-closed-outline"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Entrar"
          onPress={() => loginAuth()}
          icon="log-in"
          isLoading={loading}
          disabled={false}
          variant="primary"
        />
        <Button
          title="Não tem conta? Registre-se"
          onPress={() => {
            console.log("Botão de registrar pressionado");
            navigation.navigate("Register"); // Navegar para a tela de registro
          }}
          icon="person-add-outline"
          isLoading={false}
          disabled={false}
          variant="outlined"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
    paddingBottom: 32
    ,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    gap: 8,
  },
});
