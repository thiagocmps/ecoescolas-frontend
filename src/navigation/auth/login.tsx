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
import { jwtDecode } from "jwt-decode";
import CustomModal from "../../components/modal/modal";
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
    status: string;
  };
  exp: number;
  iat: number;
};

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ModalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  /*   const [isLoading, setIsLoading] = useState(false);
   */
  async function loginAuth() {
    console.log("Entrar pressionado");
    setIsLoading(true);
    api
      .post("/users/login", {
        email: email,
        password: password,
      })
      .then(async (response) => {
        const decoded = await jwtDecode<DecodedToken>(response.data);

        const role = decoded.data.role;
        const status = decoded.data.status;
        console.warn(status);
        console.warn(role);

        if (status === "pending" && role !== "admin" && role !== "student") {
          <CustomModal
            title="Conta não validada"
            visible={ModalVisible}
            onClose={() => {
              navigation.navigate("Login");
              setModalVisible(false);
            }}
            onConfirm={() => {
              navigation.navigate("Login");
            }}
          ></CustomModal>;
          setIsLoading(false);
          return Toast.show({
            type: "error",
            text1: "Conta não validada",
            text2:
              "Por favor, aguarde a validação da sua conta pelo administrador",
          });
        }

        Toast.show({
          type: "success",
          text1: "Login feito com sucesso!",
          text2: "Bem-vindo de volta 👋",
        });

        await StoreToken(response.data);

        if (role === "worker" && Platform.OS === "web") {
          navigation.reset({
            index: 0,
            routes: [{ name: "WebDrawerWorker" }],
          });
        } else if (role === "worker" && Platform.OS !== "web") {
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigator" }],
          });
        } else if (role === "admin" && Platform.OS !== "web") {
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigator" }],
          });
        } else if (role === "admin" && Platform.OS === "web") {
          navigation.reset({
            index: 0,
            routes: [{ name: "WebDrawerAdmin" }],
          });
        } else if (Platform.OS === "web") {
          navigation.reset({
            index: 0,
            routes: [{ name: "WebDrawer" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigator" }],
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
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
          isLoading={isLoading}
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
