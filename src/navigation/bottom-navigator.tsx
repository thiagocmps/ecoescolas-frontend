// App.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AccountScreen from "./screens/account";
import ActivitiesScreen from "./screens/activities";
import UserActivitiesScreen from "./screens/user-activities";
import ReportScreen from "./screens/report";
import { StatusBar } from "expo-status-bar";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const Tab = createBottomTabNavigator();

function BottomNavigator() {
  return (
    <View style={{ flex: 1 }}>
      {<StatusBar style="auto"/>}
      <Tab.Navigator
        initialRouteName="Atividades"
        screenOptions={({ route }) => ({
          tabBarStyle: {
            paddingBottom: 12,
            paddingTop: 8,
            height: 70,
          },
          headerShown: false/* EM DUVIDA SE EU TIRO O HEADER OU DEIXO */,
          /*  headerTitle: route.name == "Atividades" ? , */
          headerTitleAlign: "center",

          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home"; // Default icon name

            if (route.name === "Conta") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Atividades") {
              iconName = focused ? "calendar" : "calendar-outline"; // Ícone para a tela de atividades
            } else if (route.name === "Minhas Atividades") {
              iconName = focused ? "list" : "list-outline"; // Ícone para a tela de atividades do usuário
            } else if (route.name === "Ocorrências") {
              iconName = focused ? "document-text" : "document-text-outline"; // Fixed assignment operator
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Atividades" component={ActivitiesScreen} />
        <Tab.Screen name="Minhas Atividades" component={UserActivitiesScreen} />
        <Tab.Screen name="Ocorrências" component={ReportScreen} />
        <Tab.Screen name="Conta" component={AccountScreen} />
      </Tab.Navigator>
    </View>
  );
}

// Componente App
export default function App() {
  return <BottomNavigator />;
}

// Estilos
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
