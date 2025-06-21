import { View, Text } from "react-native";
import { globalStyles } from "../../utilities/styles";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import { getAllUsers } from "../../services/api-requests";
import ListCard from "../../components/list-card/list-card";
import { useCallback } from "react";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { User } from "../../utilities/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes";
import { ActivityIndicator } from "react-native-paper";

export default function ValidateAccountScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fetchUsers = useCallback(() => {
    return getAllUsers();
  }, []);

  const { data, loading, error } = useFetchOnFocus(fetchUsers);

  if (loading) {
    return (
      <View style={globalStyles.screenContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <ListCard
        data={data ?? []}
        onPress={(item) => {
          const user = item as User;
          console.log("clicou");
          navigation.navigate("ValidateAccountInfoPage", {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            numMecanografico: user.numMecanografico ?? "",
            registrationData: user.registrationData ?? {
              status: user.status,
              createdAt: user.createdAt,
            },
          });
        }}
        onPressClose={() => {}}
        onPressAdd={() => {}}
        variant="Account_Validation"
      ></ListCard>
    </View>
  );
}
