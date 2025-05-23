// App.tsx ou Routes.tsx
import "react-native-gesture-handler";
import "react-native-reanimated";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./auth/login";
import { Platform, ActivityIndicator, View, Text } from "react-native";
import RegisterScreen from "./auth/register";
import BottomNavigator from "./bottom-navigator";
import { Ionicons } from "@expo/vector-icons";
import accountScreen from "./screens/account";
import activitiesScreen from "./screens/activities";
import reportScreen from "./screens/report";
import UserActivitiesScreen from "./screens/user-activities";
import { validateToken } from "../utilities/jwtoken-utilities";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Importando o Drawer
import AddActivityScreen from "./screens/add-activity-page";
import ActivityInfoScreen from "./screens/activity-info-page";
import { SafeAreaView } from "react-native-safe-area-context";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomNavigator: undefined; // ou pode ter parâmetros
  WebDrawer: undefined;
  AddActivity: undefined;
  ActivityInfoScreen: {
    _id: string;
    title: string;
    description: string;
    date: string;
    info: {
      cover: string;
      enquadramento: string;
      objetivos: string;
      atividades: string;
      info_solicitada: string;
      prazos: string;
      criterio_de_avaliacao: string;
      juri: string[];
      premios_mencoes_honrosas: string;
    };
  };
};

const platform = Platform.OS === "web" ? "WebDrawer" : "BottomNavigator";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); // Criando o Drawer

export default function Routes() {
  const [isValidated, setIsValidated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const result = await validateToken();
      setIsValidated(result);
    };
    checkToken();
  }, []);

  if (isValidated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const WebDrawer = () => (
    <Drawer.Navigator
      initialRouteName="Atividades"
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: {
          width: "20%",
          backgroundColor: "#fff",
        },
        overlayColor: "transparent",
        headerShown: false,
        drawerActiveTintColor: "tomato",
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="Conta"
        component={accountScreen}
        options={{
          headerTitle: "Conta",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Atividades"
        component={activitiesScreen}
        options={{
          headerTitle: "Conta",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Ocorrências"
        component={reportScreen}
        options={{
          headerTitle: "Conta",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Minhas Atividades"
        component={UserActivitiesScreen}
        options={{
          headerTitle: "Minhas Atividades",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={isValidated == true ? platform : "Login"}
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerTitle: "Registro", headerTransparent: false }}
        />
        <Stack.Screen
          name="Account"
          component={accountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Activities"
          component={activitiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Report"
          component={reportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserActivities"
          component={UserActivitiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigator"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="WebDrawer"
          component={WebDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActivityInfoScreen"
          component={ActivityInfoScreen}
          options={{ headerTitle: "", headerTransparent: true }}
        />

        <Stack.Screen
          name="AddActivity"
          component={AddActivityScreen}
          options={{ headerTitle: "", headerTransparent: true }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
