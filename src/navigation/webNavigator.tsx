// App.js
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Criar telas simple
// Criando o Bottom Navigator
function DrawerNavigator() {
  return (
    <View>
      <Text>Teste</Text>
    </View>
  );
}

// Componente App
export default function App() {
  return (
    <View>
      <StatusBar style="light"/>
      {/* <DrawerNavigator /> */}
    </View>
  );
}

