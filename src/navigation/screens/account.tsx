import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/button/button";
import { getDecodedToken } from "../../utilities/jwtokenUtilities";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import CustomModal from "../../components/modal/modal";
import { useState } from "react";
import { RemoveToken } from "../../utilities/jwtokenUtilities";
import { useWindowDimensions } from "react-native";


export default function UserScreen() {
  const navigation = useNavigation();
  const decodedToken = getDecodedToken();
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  return (
    
    <View style={styles.screenContainer}>
      <StatusBar style={"auto"} />
      {/* ADICIONAR FOTO DE PERFIL AQUI */}
      <View style={{ width: "100%", gap: 16, paddingTop: 32 }}>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", paddingBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold"}}>
            {decodedToken?.data.firstName} {decodedToken?.data.lastName}
          </Text>
        </View>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={{ ...styles.infoContainer, width: isLargeScreen ? "50%" : "100%" }}>
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
      </View>
      <Button
      style={{ width: isLargeScreen ? 300 : "100%" }}
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
          RemoveToken();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          ); // Navegar para a tela de login após logout
          console.log("Token removido com sucesso!");
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderColor: "#dedede",
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
  },
});
