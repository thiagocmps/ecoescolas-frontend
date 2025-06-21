import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  getActivitiesByCreator,
} from "../../services/api-requests";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import {
  Activity,
} from "../../utilities/types";
import { ActivityIndicator } from "react-native";
import ListCard from "../../components/list-card/list-card";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../routes"; // Update the path as needed
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useCallback } from "react";
import Button from "../../components/button/button";
import { Platform } from "react-native";
import { globalStyles } from "../../utilities/styles";

export default function MyActivitiesScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userInfo = useGetDecodedToken();
  const userId = userInfo?.data.id;
  const fetchActivities = useCallback(() => {
    return getActivitiesByCreator(userId);
  }, [userId]);

  const {
    data: activities,
    loading: isLoading,
    error,
  } = useFetchOnFocus<Activity[]>(fetchActivities);

  return (
    <View style={localStyles.screenContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : !activities || activities.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ marginTop: 20 }}>
            Todas as suas atividades criadas aparecerão aqui!
          </Text>
        </View>
      ) : (
        <ListCard
          variant="activity"
          onPressAdd={() => {}}
          onPressClose={() => {}}
          data={activities ?? []}
          listHeaderComponent={() => (
            <>
              <Text style={[globalStyles.title, { paddingTop: 40 }]}>
                Olá, {userInfo?.data.firstName} {userInfo?.data.lastName}
              </Text>
              <Text style={[globalStyles.regularText, { paddingBottom: 20 }]}>
                Aqui você pode ver todas as atividades que você criou!
              </Text>
            </>
          )}
          onPress={(activity) => {
            const activities = activity as Activity;
            console.log(activities._id);
            navigation.navigate("ActivityInfoScreen", {
              _id: activities._id,
              title: activities.title,
              description: activities.description,
              date: String(activities.date),
              info: activities.info,
              creatorId: activities.creatorId,
            });
          }}
        />
      )}
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
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
