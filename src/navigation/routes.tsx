// App.tsx ou Routes.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./auth/login";
import { Platform, ActivityIndicator, View } from "react-native";
import RegisterScreen from "./auth/register";
import BottomNavigator from "./bottomNavigator";
import WebNavigator from "./webNavigator";
import accountScreen from "./screens/account";
import activitiesScreen from "./screens/activities";
import reportScreen from "./screens/report";
import UserActivitiesScreen from "./screens/userActivities";
import { validateToken } from "./auth/decodedToken";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomNavigator: undefined; // ou pode ter parâmetros
  WebNavigator: undefined;
};

const platform = Platform.OS === "web" ? "WebNavigator" : "BottomNavigator";
const Stack = createNativeStackNavigator();

export default function Routes() {
  const [isValidated, setIsValidated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const result = await validateToken();
      setIsValidated(result);
    };

    checkToken();
  }, []);

  console.log("isValidated:", isValidated);

  if (isValidated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={isValidated == true ? "BottomNavigator" : "Login"}
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
        options={{ headerTitle: "Registro" }}
      />
      <Stack.Screen
        name="Account"
        component={accountScreen}
        options={{ headerTitle: "Conta" }}
      />
      <Stack.Screen
        name="Activities"
        component={activitiesScreen}
        options={{ headerTitle: "Atividades" }}
      />
      <Stack.Screen
        name="Report"
        component={reportScreen}
        options={{ headerTitle: "Relatório" }}
      />
      <Stack.Screen
        name="UserActivities"
        component={UserActivitiesScreen}
        options={{ headerTitle: "Atividades do Utilizador" }}
      />
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WebNavigator"
        component={WebNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
