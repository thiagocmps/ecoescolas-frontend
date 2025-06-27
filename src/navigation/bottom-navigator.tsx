// App.js
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AccountScreen from "./screens/account";
import ActivitiesScreen from "./screens/activities";
import UserRegistrationsScreen from "./screens/subscriptions";
import ReportScreen from "./screens/report";
import { useGetDecodedToken } from "../utilities/jwtoken-utilities";
import MyActivitiesScreen from "./screens/my-activities";
import ValidateAccountScreen from "./screens/validate-accounts";

const Tab = createBottomTabNavigator();

function BottomNavigator() {
  const userInfo = useGetDecodedToken();
  const role = userInfo?.data.role;
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Atividades"
        screenOptions={({ route }) => ({
          tabBarStyle: {
            paddingBottom: 12,
            paddingTop: 8,
            height: 84,
          },
          headerShown: false /* EM DUVIDA SE EU TIRO O HEADER OU DEIXO */,
          /*  headerTitle: route.name == "Atividades" ? , <Text>Atividades</Text> : <Text>Outra Rota</Text> */

          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "Conta") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Atividades") {
              iconName = focused ? "bookmarks" : "bookmarks-outline";
            } else if (route.name === "Inscrições") {
              iconName = focused ? "ticket" : "ticket-outline";
            } else if (route.name === "Ocorrências") {
              iconName = focused ? "document-text" : "document-text-outline";
            } else if (route.name === "Minhas atividades") {
              iconName = focused ? "bookmark" : "bookmark-outline";
            } else if (route.name === "Validar contas") {
              iconName = focused ? "person-add" : "person-add-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        {role === "admin" ? (
          <>
            <Tab.Screen
              name="Validar contas"
              component={ValidateAccountScreen}
            />
          </>
        ) : undefined}

        {role === "professor" ? (
          <Tab.Screen
            name="Minhas atividades"
            component={MyActivitiesScreen}
            options={{
              tabBarLabel: ({ color, focused, position, children }) => (
                <Text
                  style={{
                    color,
                    fontSize: 10,
                    alignSelf: "center",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Minhas Atividades
                </Text>
              ),
            }}
          />
        ) : null}
        {role !== "worker" && role !== "admin" && (
          <>
            <Tab.Screen name="Atividades" component={ActivitiesScreen} />
            <Tab.Screen name="Inscrições" component={UserRegistrationsScreen} />
          </>
        )}
        {role !== "admin" && (
          <Tab.Screen name="Ocorrências" component={ReportScreen} />
        )}
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
const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
