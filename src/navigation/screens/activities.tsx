import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getActivities } from "../../services/api-requests";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Activity } from "../../utilities/types";
import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes";
import { Platform } from "react-native";

export default function ActivitiesScreen() {
  const userInfo = useGetDecodedToken();
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={[styles.item, { width: Platform.OS == "web" ? 350 : "100%" }]}
      onPress={() => {
        navigation.navigate("ActivityInfoScreen", {
          _id: item._id,
          title: item.title,
          description: item.description,
          objetivos: item.info.objetivos,
          atividade: item.info.atividade,
          infoSolicitada: item.info.info_solicitada,
          prazos: item.info.prazos,
          criterioDeAvaliacao: item.info.criterio_de_avaliacao,
          juri: item.info.juri,
          premiosMencoesHonrosas: item.info.premios_mencoes_honrosas,
          cover: item.info.cover,
          date: String(item.date),
          enquadramento: item.info.enquadramento,
      })}
    }>
      <View
        style={{
          backgroundColor: "#d7d7d7",
          height: 120,
          padding: 10,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: "#636363" }}>
          {item.info.cover == "req.body.cover" || null || undefined
            ? "a imagem vai ficar aqui confia"
            : item.info.cover}
        </Text>
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

  return (
    <View style={styles.screenContainer}>
      {isLoading ? (
        <Text style={{ marginTop: 20 }}>Carregando atividades...</Text>
      ) : activities.length === 0 ? (
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
