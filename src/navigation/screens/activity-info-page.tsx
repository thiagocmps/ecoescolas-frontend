import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
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

export default function ActivityInfoScreen() {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {
    _id,
    title,
    description,
    date,
    enquadramento,
    objetivos,
    atividade,
    infoSolicitada,
    prazos,
    criterioDeAvaliacao,
    juri,
    premiosMencoesHonrosas,
    cover,
  } = route.params as {
    _id: string;
    title: string;
    description: string;
    date: string;
    enquadramento: string;
    objetivos: string;
    atividade: string;
    infoSolicitada: string;
    prazos: string;
    criterioDeAvaliacao: string;
    juri: Array<string>;
    premiosMencoesHonrosas: string;
    cover: string;
  };
  const isRegisteredToActivity = useValidatedToActivity(_id);
  /* console.log("Resultado do hook: ", isRegisteredToActivity); */
  const decodedToken = useGetDecodedToken();
  const userId = decodedToken?.data?.id;
  return (
    <ScrollView style={styles.scrollableContainer}>
      <View style={styles.coverContainer}>
        <Text>{cover}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, width: "50%" }}>{title}</Text>
          {isRegisteredToActivity === null ? (
            <Button
              title="Inscrito"
              isLoading={true}
              disabled={false}
              style={{ width: 150 }}
              onPress={() => {
                console.log("");
              }}
            />
          ) : isRegisteredToActivity ? (
            <Button
              title="Inscrito"
              disabled={true}
              style={{ width: 150 }}
              onPress={() => {
                console.log("Usuário já está inscrito");
              }}
            />
          ) : (
            <Button
              title="Inscrever-se"
              icon="add"
              style={{ width: 150 }}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          )}
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Descrição</Text>
          <Text>{description}</Text>
        </View>
        <Text>{date}</Text>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Enquadramento
          </Text>
          <Text>{enquadramento}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Objetivos</Text>
          <Text>{objetivos}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Atividade</Text>
          <Text>{atividade}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Informações solicitadas
          </Text>
          <Text>{infoSolicitada}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Prazos</Text>
          <Text>{prazos}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Critério de avaliação
          </Text>
          <Text>{criterioDeAvaliacao}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Júri</Text>
          <Text>{juri}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Prémios e menções honrosas
          </Text>
          <Text>{premiosMencoesHonrosas}</Text>
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
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'BottomNavigator',
                  state: {
                    routes: [{ name: 'activities' }],
                  },
                },
              ],
            })
          );
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
    padding: 16,
    gap: 8,
  },
  titleContainer: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
