import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "../navigation/routes"; // Importando o arquivo de rotas
import Toast from "react-native-toast-message";
export default function App() {
  /*  return Platform.OS === "web" ? <WebNavigator/> : <BottomNavigator/>; */
  return (
    <NavigationContainer>
      <Routes />
      <Toast />
    </NavigationContainer>
  );
}
