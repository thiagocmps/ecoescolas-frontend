import { useState } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
import Button from "../../components/button/button";
import TextInput from "../../components/input/input";
import api from "../../services/base-api-url";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../routes";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { StoreToken } from "../../utilities/jwtoken-utilities";
import { useWindowDimensions } from "react-native";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { jwtDecode } from "jwt-decode";
const logo = require("../../../assets/eco-escolas.png");
const platform = Platform.OS === "web" ? "WebDrawer" : "BottomNavigator";

type DecodedToken = {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
  };
  exp: number;
  iat: number;
};

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setlsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

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
          type: "success",
          text1: "Login feito com sucesso!",
          text2: "Bem-vindo de volta 👋",
        });
        setlsLoading(false);
        /* StoreToken(response.data); */
        const decoded = await jwtDecode<DecodedToken>(response.data);
        
        const role = decoded.data.role;
        if (role === "worker" && Platform.OS === "web") {
          await StoreToken(response.data);
          navigation.reset({
            index: 0,
            routes: [{ name: "WebDrawerWorker" }],
          });
        } else if (role === "worker" && Platform.OS !== "web") {
          await StoreToken(response.data);
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigator" }],
          });
          setlsLoading(false);
          return;
        } else if (Platform.OS === "web") {
          await StoreToken(response.data);
          navigation.reset({
            index: 0,
            routes: [{ name: "WebDrawer" }],
          });
        } else {
          StoreToken(response.data);
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigator" }],
          });
        }
      })
      .catch((error) => {
        setlsLoading(false);
        console.error("Erro ao fazer login:", error);
        if (error.status === 401 || error.status === 403) {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "❌ Erro ao fazer login",
            text2: "Verifique suas credenciais e tente novamente.",
          });
        } else if (error.status === 500) {
          Toast.show({
            type: "error", // 'success' | 'error' | 'info'
            text1: "❌ Erro no servidor",
            text2: "Tente novamente mais tarde.",
          });
        }
      });
  }

  return (
    <View style={localStyles.screenContainer}>
      <View style={localStyles.imageContainer}>
        <Image source={logo} style={{ width: 200, height: 200 }} />
      </View>
      <View
        style={[
          localStyles.inputContainer,
          { width: isLargeScreen ? "35%" : "100%" },
        ]}
      >
        <TextInput
          type="input"
          placeholder="Digite o seu email da ESMAD"
          label="Email:"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />
        <TextInput
          type="input"
          placeholder="Digite sua palavra-passe"
          label="Palavra-passe:"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          icon="lock-closed-outline"
        />
      </View>
      <View style={localStyles.buttonContainer}>
        <Button
          style={{ width: isLargeScreen ? "35%" : "100%" }}
          title="Entrar"
          onPress={() => loginAuth()}
          icon="log-in"
          isLoading={loading}
          disabled={false}
          variant="primary"
        />
        <Button
          title="Não tem conta? Registre-se"
          style={{ width: isLargeScreen ? "35%" : "100%" }}
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

const localStyles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    gap: 8,
    alignItems: "center",
  },
});
