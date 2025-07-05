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
import UserRegistrationsScreen from "./screens/subscriptions";
import { validateToken } from "../utilities/jwtoken-utilities";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Importando o Drawer
import AddActivityScreen from "./screens/add-activity-page";
import ActivityInfoScreen from "./screens/activity-info-page";
import { SafeAreaView } from "react-native-safe-area-context";
import MyActivitiesScreen from "./screens/my-activities";
import { useGetDecodedToken } from "../utilities/jwtoken-utilities";
import AddReportScreen from "./screens/add-report-page";
import ReportInfoScreen from "./screens/report-info-page";
import ValidateAccountScreen from "./screens/validate-accounts";
import ValidateAccountInfoPage from "./screens/validate-accounts-info-page";
import { Activity } from "../utilities/types"
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomNavigator: undefined; // ou pode ter parâmetros
  WebDrawer: undefined;
  WebDrawerWorker: undefined;
  WebDrawerAdmin: undefined;
  AddActivity:
    | undefined
    | {
        activityId?: string;
        activityTitle?: string;
        activityDescription?: string;
        activityDate?: string;
        creatorId?: string;
        activityInfo?: {
          cover?: string;
          enquadramento?: string;
          objetivos?: string;
          atividades?: string;
          info_solicitada?: string;
          prazos?: string;
          criterio_de_avaliacao?: string;
          juri?: string[];
          premios_mencoes_honrosas?: string;
        };
      };
  ReportInfoScreen: {
    _id: string;
    userId: string;
    workerId?: string;
    status: string;
    category: string;
    local: {
      bloco: string;
      sala: string;
    };
    description: string;
    image: string;
    createdAt: Date;
  };
  ValidateAccountScreen: undefined;
  ValidateAccountInfoPage: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    numMecanografico: string;
    registrationData: {
      status: string;
      createdAt: string;
    };
  };
  CreatedActivities: undefined;
  AddReport?: undefined;
  ActivityInfoScreen: Activity;
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); // Criando o Drawer

export default function Routes() {
  const [isValidated, setIsValidated] = React.useState<boolean | null>(null);
  const userInfo = useGetDecodedToken();
  const role = userInfo?.data.role;
  const platformOrientation =
    Platform.OS === "web"
      ? role === "worker"
        ? "WebDrawerWorker"
        : role === "admin"
        ? "WebDrawerAdmin"
        : "WebDrawer"
      : "BottomNavigator";

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
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  const WebDrawer = () => (
    <Drawer.Navigator
      initialRouteName={role === "worker" ? "Ocorrências" : "Atividades"}
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
        name="Atividades"
        component={activitiesScreen}
        options={{
          headerTitle: "Conta",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "bookmarks" : "bookmarks-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {role === "professor" && (
        <Drawer.Screen
          name="Minhas Atividades"
          component={MyActivitiesScreen}
          options={{
            headerTitle: "Minhas Atividades",
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons
                name={focused == true ? "bookmark" : "bookmark-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Inscrições"
        component={UserRegistrationsScreen}
        options={{
          headerTitle: "Minhas Atividades",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "ticket" : "ticket-outline"}
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
    </Drawer.Navigator>
  );

  const WebDrawerWorker = () => (
    <Drawer.Navigator
      initialRouteName={"Ocorrências"}
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
    </Drawer.Navigator>
  );

  const WebDrawerAdmin = () => (
    <Drawer.Navigator
      initialRouteName={"Validar contas"}
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
        name="Validar contas"
        component={ValidateAccountScreen}
        options={{
          headerTitle: "Conta",
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused == true ? "person-add" : "person-add-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
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
    </Drawer.Navigator>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 0 : 0,
      }}
    >
      <Stack.Navigator
        initialRouteName={isValidated == true ? platformOrientation : "Login"}
        screenOptions={{
          animation: "slide_from_right",
          headerShown: false,
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
          name="UserRegistrations"
          component={UserRegistrationsScreen}
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
          name="WebDrawerWorker"
          component={WebDrawerWorker}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebDrawerAdmin"
          component={WebDrawerAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatedActivities"
          component={MyActivitiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActivityInfoScreen"
          component={ActivityInfoScreen}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ReportInfoScreen"
          component={ReportInfoScreen}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ValidateAccountScreen"
          component={ValidateAccountScreen}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ValidateAccountInfoPage"
          component={ValidateAccountInfoPage}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="AddReport"
          component={AddReportScreen}
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
