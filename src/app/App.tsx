import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "../navigation/routes";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <NavigationContainer>
            <Routes />
            <Toast />
          </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
