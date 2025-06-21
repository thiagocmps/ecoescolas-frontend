import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import { getActivities } from "../../services/api-requests";
import { Activity } from "../../utilities/types";
import Button from "../../components/button/button";
import ListCard from "../../components/list-card/list-card";
import { globalStyles } from "../../utilities/styles";
import { useCallback } from "react";

export default function ActivitiesScreen() {
  const userInfo = useGetDecodedToken();
  const fetchUsers = useCallback(() => {
    return getActivities();
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: activities,
    loading: isLoading,
    error,
    refetch,
  } = useFetchOnFocus<Activity[]>(fetchUsers, {
    delay: 200,
  });

  return (
    <View style={localStyles.screenContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : !activities || activities.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ marginTop: 20 }}>Não há atividades disponíveis</Text>
        </View>
      ) : (
        <ListCard
          variant="activity"
          onPressClose={() => {}}
          onPressAdd={() => {}}
          creatorTagVisible={true}
          data={activities}
          listHeaderComponent={() => (
            <>
              <View style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 20, marginTop: 32, backgroundColor: "#ffffff", elevation: 10, borderRadius: 20}}>
        
                <Text style={[globalStyles.title, /* { paddingVertical: 40 } */]}>
                  Olá, {userInfo?.data.firstName} {userInfo?.data.lastName}!
                </Text>
                 <Text style={[globalStyles.regularText, { /* paddingBottom: 16 */ }]}>
                Aqui estão as atividades disponíveis para você participar.
              </Text>
              </View>
             
            </>
          )}
          style={{ width: "100%" }}
          onPress={(item) => {
            const activity = item as Activity;
            navigation.navigate("ActivityInfoScreen", {
              creatorId: activity.creatorId,
              _id: activity._id,
              title: activity.title,
              description: activity.description,
              date: String(activity.date),
              info: activity.info,
            });
          }}
        />
      )}
      {userInfo?.data.role === "professor" && (
        <Button
          title="Criar Atividade"
          icon="add"
          style={{
            width: Platform.OS === "web" ? 200 : "60%",
            position: "absolute",
            bottom: 30,
          }}
          onPress={() => navigation.navigate("AddActivity")}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
