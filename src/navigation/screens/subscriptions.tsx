import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getRegistrationsByUser } from "../../services/api-requests";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import {
  Activity,
  Registration,
  RegistrationWithActivity,
} from "../../utilities/types";
import { ActivityIndicator } from "react-native";
import ListCard from "../../components/list-card/list-card";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../routes"; // Update the path as needed

export default function UserRegistrationsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {
    data: registrations,
    loading: isLoading,
    error,
  } = useFetchOnFocus<(Registration & { activity: Activity | null })[]>(
    getRegistrationsByUser
  );

  if (isLoading) {
    return (
      <View style={localStyles.screenContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (registrations == null || registrations.length === 0) {
    return (
      <View style={localStyles.screenContainer}>
        <Text>Todas as atividades inscritas aparecerão aqui</Text>
      </View>
    );
  }

  return (
    <View style={localStyles.screenContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : !registrations || registrations.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ marginTop: 20 }}>
            Todas as suas inscrições em atividades aparecerão aqui!
          </Text>
        </View>
      ) : (
        <ListCard
          variant="registration"
          onPressAdd={() => {}}
          onPressClose={() => {}}
          data={registrations ?? []}
          onPress={(registration) => {
            const activity = registration as RegistrationWithActivity;
            navigation.navigate("ActivityInfoScreen", {
              _id: activity.activity._id,
              title: activity.activity.title,
              description: activity.activity.description,
              date: String(activity.activity.date),
              info: activity.activity.info,
              creatorId: activity.activity.creatorId,
            });
          }}
        />
      )}
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
