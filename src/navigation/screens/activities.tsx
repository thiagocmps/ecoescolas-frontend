import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getActivities } from "../../services/api-requests";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Button from "../../components/button/button";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes";
import { Platform } from "react-native";
import { Image } from "react-native";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import { Activity } from "../../utilities/types";
import { ActivityIndicator } from "react-native";

export default function ActivitiesScreen() {
  const userInfo = useGetDecodedToken();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: activities,
    loading: isLoading,
    error,
  } = useFetchOnFocus<Activity[]>(getActivities);

  const renderItem = ({ item }: { item: Activity }) => {
    const base64Icon = `data:image/png;base64,${item.info.cover}`;
    /* console.log("Item: ", item.info); */
    return (
      <TouchableOpacity
        style={[styles.item, { width: Platform.OS == "web" ? 350 : "100%" }]}
        onPress={() => {
          navigation.navigate("ActivityInfoScreen", {
            _id: item._id,
            title: item.title,
            description: item.description,
            date: String(item.date),
            info: item.info,
          });
        }}
      >
        <View
          style={{
            backgroundColor: "#d7d7d7",
            height: 120,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            source={{ uri: base64Icon }}
          />
        </View>
        <View style={{ padding: 10 }}>
          <Text numberOfLines={1} style={{ fontSize: 16 }}>
            {" "}
            {item.title}
          </Text>
          <Text numberOfLines={2} style={{ paddingTop: 6 }}>
            {" "}
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : !activities || activities.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Não há atividades disponíveis</Text>
      ) : (
        <FlatList
          key={userInfo?.data.role === "professor" ? "professor" : "student"}
          data={activities}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          style={{ width: "100%" }}
          numColumns={Platform?.OS == "web" ? 2 : 1}
          columnWrapperStyle={
            Platform.OS == "web"
              ? { justifyContent: "space-between", gap: 16 }
              : undefined
          }
          contentContainerStyle={[
            styles.listContainer,
            {
              paddingBottom: userInfo?.data.role === "professor" ? 100 : 0,
              alignItems: Platform.OS == "web" ? "center" : undefined,
            },
          ]}
        />
      )}
      {userInfo?.data.role == "professor" ? (
        <Button
          title="Criar Atividade"
          style={{
            width: Platform.OS == "web" ? "30%" : "60%",
            position: "absolute",
            bottom: 30,
          }}
          icon="add"
          onPress={() => {
            console.log("Clicou");
            navigation.navigate("AddActivity");
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 8,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8b8b8",
    alignSelf: "center",
  },
  screenContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  listContainer: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
  },
});
