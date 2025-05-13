import { View, Text, StyleSheet, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../../components/button/button";
import { ScrollView } from "react-native-gesture-handler";
import { useValidatedToActivity } from "../../utilities/jwtoken-utilities";
import CustomModal from "../../components/modal/modal";
import { useState } from "react";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { registerToActivity } from "../../services/api-requests";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Image } from "react-native";
import { Activity } from "../../utilities/types";

export default function ActivityInfoScreen() {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { _id, title, description, date, info } = route.params as {
    _id: string;
    title: string;
    description: string;
    date: string;
    info: Activity["info"];
  };
  const base64Icon = `data:image/png;base64,${info.cover}`;
  const isRegisteredToActivity = useValidatedToActivity(_id);
  const decodedToken = useGetDecodedToken();
  const userId = decodedToken?.data?.id;
  return (
    <ScrollView style={styles.scrollableContainer}>
      <View style={styles.coverContainer}>
        <Image
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          source={{ uri: base64Icon }}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={{ fontSize: Platform.OS == "web" ? 28 : 20, width: "50%" }}
          >
            {title}
          </Text>
          {isRegisteredToActivity === null ? (
            <Button
              title="Subscrito"
              variant="outlined"
              isLoading={true}
              disabled={false}
              style={{ width: 150 }}
              onPress={() => {}}
            />
          ) : isRegisteredToActivity ? (
            <Button
              title="Subscrito"
              variant="outlined"
              icon="checkmark-done-outline"
              disabled={true}
              style={{ width: 150 }}
              onPress={() => {
                console.log("Usuário já está inscrito");
              }}
            />
          ) : (
            <Button
              title="Subscrever"
              icon="ticket-outline"
              style={{ width: 150 }}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.title}>Descrição</Text>
            <Text>{description}</Text>
          </View>
          <View>
            <Text style={styles.title}>Data</Text>
            <Text>{date}</Text>
          </View>
          <View>
            <Text style={styles.title}>Enquadramento</Text>
            <Text>{info.enquadramento}</Text>
          </View>
          <View>
            <Text style={styles.title}>Objetivos</Text>
            <Text>{info.objetivos}</Text>
          </View>
          <View>
            <Text style={styles.title}>Atividades</Text>
            <Text>{info.atividades}</Text>
          </View>
          <View>
            <Text style={styles.title}>Informações solicitadas</Text>
            <Text>{info.info_solicitada}</Text>
          </View>
          <View>
            <Text style={styles.title}>Prazos</Text>
            <Text>{info.prazos}</Text>
          </View>
          <View>
            <Text style={styles.title}>Critério de avaliação</Text>
            <Text>{info.criterio_de_avaliacao}</Text>
          </View>
          <View>
            <Text style={styles.title}>Júri</Text>
            {info.juri ? (
              info.juri.map((nome, index) => <Text key={index}>{nome}</Text>)
            ) : (
              <Text>Nenhum júri definido</Text>
            )}
          </View>
          <View>
            <Text style={styles.title}>Prémios e menções honrosas</Text>
            <Text>{info.premios_mencoes_honrosas}</Text>
          </View>
        </View>
      </View>
      <CustomModal
        visible={modalVisible}
        title="Inscrever-se"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          registerToActivity(_id, userId);
          Toast.show({
            type: "success",
            text1: "Inscrição realizada com sucesso! 😊",
            position: "top",
            visibilityTime: 3000,
          });
          {
            Platform.OS == "web"
              ? navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "WebDrawer",
                        state: {
                          routes: [{ name: "Atividades" }],
                        },
                      },
                    ],
                  })
                )
              : navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "BottomNavigator",
                        state: {
                          routes: [{ name: "activities" }],
                        },
                      },
                    ],
                  })
                );
          }

          setModalVisible(false);
        }}
        onCancel={() => {
          console.log("Utilizador não saiu");
          setModalVisible(false);
        }}
      >
        <Text>Tem certeza que deseja se inscrever em {title}?</Text>
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: Platform.OS == "web" ? 24 : 18,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#d7d7d7",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableContainer: {
    flex: 1,
    flexDirection: "column",
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: Platform.OS == "web" ? "20%" : 8,
    gap: 16,
  },
  titleContainer: {
    paddingStart: Platform.OS == "web" ? 32 : 0,
    paddingEnd: Platform.OS == "web" ? 32 : 0,
    paddingTop: Platform.OS == "web" ? 16 : 0,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
