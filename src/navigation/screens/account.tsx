import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/button/button";
import { getDecodedToken } from "../auth/decodedToken";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import CustomModal from "../../components/modal/modal";
import { useState } from "react";

export default function UserScreen() {
  const navigation = useNavigation();
  const decodedToken = getDecodedToken();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.screenContainer}>
      <StatusBar style={"dark"} /> 
      {/* ADICIONAR FOTO DE PERFIL AQUI */}
      <View style={{ width: "100%", gap: 16, paddingTop: 32 }}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {decodedToken?.data.firstName} {decodedToken?.data.lastName}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Email: {decodedToken?.data.email}</Text>
          <Text style={styles.text}>
            Perfil:{" "}
            {decodedToken?.data.role == "student"
              ? "Estudante"
              : decodedToken?.data.role == "professor"
              ? "Professor"
              : "Segurança"}
          </Text>
          {decodedToken?.data.role === "student" && (
            <Text style={styles.text}>
              Nº mecanográfico: {decodedToken?.data?.email.slice(0, 8)}
            </Text>
          )}
          <Text style={styles.text}>
            Criado em:{" "}
            {new Date(decodedToken?.data.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>
            Expira em: {new Date(decodedToken?.exp * 1000).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Button
        title="Sair da conta"
        onPress={() => {
          setModalVisible(true);
          console.log("Sair pressionado");
        }}
        icon="log-out-outline"
        isLoading={false}
        disabled={false}
        variant="outlined"
      />
      <CustomModal
        visible={modalVisible}
        title="Sair da conta"
        confirmText="Sair"
        cancelText="Cancelar"
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          console.log("Saindo da conta");
          SecureStore.deleteItemAsync("token")
            .then(() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              ); // Navegar para a tela de login após logout
              console.log("Token removido com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao remover o token:", error);
            });
          setModalVisible(false);
        }}
        onCancel={() => {
          console.log("Utilizador não saiu");
          setModalVisible(false);
        }}
      >
        <Text>Tem certeza que deseja continuar?</Text>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 16,
    gap: 16,
  },
  infoContainer: {
    width: "100%",
    gap: 8,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5,
  },
  text: {
    fontSize: 16,
  },
});
