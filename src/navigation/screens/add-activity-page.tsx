import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { act, useState } from "react";
import MultiInputList from "../../components/multi-input.list/multi-input-list";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native-animatable";
import CustomModal from "../../components/modal/modal";
import { createActivity, patchActivity } from "../../services/api-requests";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BackArrow from "../../components/back-arrow/back-arrow";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

export default function AddActivityScreen() {
  const userInfo = useGetDecodedToken();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enquadramento, setEnquadramento] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [atividades, setAtividades] = useState("");
  const [prazos, setPrazos] = useState("");
  const [criterios, setCritérios] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [premios, setPremios] = useState("");

  const [juris, setJuris] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    activityId,
    activityTitle,
    activityDescription,
    activityDate,
    creatorId,
    activityInfo,
  } =
    (route.params as {
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
    }) ?? {};
  useEffect(() => {
    if (activityTitle) setTitulo(activityTitle);
    if (activityDescription) setDescricao(activityDescription);
    if (activityInfo?.cover) setImageBase64(activityInfo.cover);
    if (activityInfo?.enquadramento)
      setEnquadramento(activityInfo.enquadramento);
    if (activityInfo?.objetivos) setObjetivos(activityInfo.objetivos);
    if (activityInfo?.atividades) setAtividades(activityInfo.atividades);
    if (activityInfo?.prazos) setPrazos(activityInfo.prazos);
    if (activityInfo?.criterio_de_avaliacao)
      setCritérios(activityInfo.criterio_de_avaliacao);
    if (activityInfo?.info_solicitada)
      setInformacoes(activityInfo.info_solicitada);
    if (activityInfo?.premios_mencoes_honrosas)
      setPremios(activityInfo.premios_mencoes_honrosas);
    if (activityInfo?.juri) setJuris(activityInfo.juri);
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Você precisa permitir o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    console.log("Informações da atividade:", activityInfo);
    console.log("Título da atividade:", activityTitle);
    console.log("Descrição da atividade:", activityDescription);
    console.log("ID da atividade:", activityId);
    console.log("ID do criador:", creatorId);

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64Image = result.assets[0].base64;
      setImageUri(imageUri);
      setImageBase64(base64Image ?? null);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={localStyles.scrollableContainer}>
          <View style={localStyles.coverContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: "#d0d0d0",
                width: "100%",
                height: "100%",
              }}
              onPress={pickImage}
            >
              {imageBase64 ? (
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  source={{ uri: `data:image/png;base64,${imageBase64}` }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="image-outline" size={60} color="#ffffff" />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Adicionar cover
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={localStyles.screenContainer}>
            <View style={localStyles.userNameContainer}></View>
            <View style={localStyles.infoContainer}>
              <Input
                label="Titulo:"
                subLabel="(obrigatório)"
                type="input"
                placeholder="Digite o titulo da atividade"
                value={titulo}
                onChangeText={setTitulo}
              />
              <Input
                label="Descrição:"
                subLabel="(obrigatório)"
                type="textarea"
                placeholder="Digite a descrição da atividade"
                value={descricao}
                onChangeText={setDescricao}
              />
              <Input
                label="Enquadramento:"
                subLabel="(opcional)"
                type="textarea"
                placeholder="Digite o enquadramento"
                value={enquadramento}
                onChangeText={setEnquadramento}
              />
              <Input
                label="Objetivos:"
                subLabel="(obrigatório)"
                type="textarea"
                placeholder="Digite os objetivos"
                value={objetivos}
                onChangeText={setObjetivos}
              />
              <Input
                label="Atividade:"
                subLabel="(opcional)"
                type="textarea"
                placeholder="Digite as atividades"
                value={atividades}
                onChangeText={setAtividades}
              />
              <Input
                label="Prazos:"
                subLabel="(obrigatório)"
                type="textarea"
                placeholder="Digite os prazos da atividade"
                value={prazos}
                onChangeText={setPrazos}
              />
              <Input
                label="Critério de avaliação:"
                subLabel="(obrigatório)"
                type="textarea"
                placeholder="Digite o critério de avaliação"
                value={criterios}
                onChangeText={setCritérios}
              />
              <MultiInputList
                type="array"
                label="Júri:"
                subLabel="(obrigatório)"
                placeholder="Nome do membro do júri"
                items={juris}
                onAdd={(item) => setJuris([...juris, item as string])}
                onRemove={(index) =>
                  setJuris(juris.filter((_, i) => i !== index))
                }
              />
              <Input
                label="Informações solicitadas:"
                subLabel="(opcional)"
                type="textarea"
                placeholder="Digite as informações solicitadas"
                value={informacoes}
                onChangeText={setInformacoes}
              />
              <Input
                label="Prémios e menções honrosas:"
                subLabel="(opcional)"
                type="textarea"
                placeholder="Digite os prémios e menções honrosas"
                value={premios}
                onChangeText={setPremios}
              />
              {/* <Button
                icon="images-outline"
                title="Adicionar imagem"
                contentColor={"#ccc"}
                variant="outlined"
                style={{
                  marginTop: 10,
                  height: 100,
                  borderRadius: 20,
                  width: Platform.OS == "web" ? "100%" : "100%",
                  borderColor: "#ccc",
                }}
                onPress={() => {}}
              /> */}
              {imageUri && (
                <View style={localStyles.preview}>
                  <Image source={{ uri: imageUri }} style={localStyles.image} />
                  <Text style={localStyles.uri}>{imageUri}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={localStyles.buttonContainer}>
          {activityTitle ? (
            <Button
              onPress={() => {
                console.log("Editando atividade:");
                if (
                  !titulo ||
                  !descricao ||
                  !objetivos ||
                  !prazos ||
                  !criterios ||
                  !juris.length
                ) {
                  console.log("preencha tudinho");
                  Toast.show({
                    type: "error",
                    text1: "Erro",
                    text2: "Preencha todos os campos obrigatórios.",
                    visibilityTime: 3000,
                  });
                  return;
                } else {
                  setModalVisibleEdit(true)
                }
              }}
              title="Editar atividade"
              variant="primary"
              icon="pencil-outline"
              style={{
                position: "absolute",
                bottom: 46, 
                width: Platform.OS == "web" ? 200 : "100%",
              }}
            />
          ) : (
            <Button
              onPress={() => {
                console.log("Dados da atividade:");
                /* setModalVisible(true); */
                if (
                  !titulo ||
                  !descricao ||
                  !objetivos ||
                  !prazos ||
                  !criterios ||
                  !juris.length
                ) {
                  console.log("preencha tudinho");
                  Toast.show({
                    type: "error",
                    text1: "Erro",
                    text2: "Preencha todos os campos obrigatórios.",
                    visibilityTime: 3000,
                  });
                  return;
                } else {
                  setModalVisible(true);
                }
              }}
              title="Criar atividade"
              variant="primary"
              icon="add-outline"
              style={{
                position: "absolute",
                bottom: 46,
                width: Platform.OS == "web" ? 200 : "100%",
              }}
            />
          )}
        </View>

        <CustomModal
          visible={modalVisible}
          title="Criando atividade"
          confirmText="Confirmar"
          cancelText="Cancelar"
          onClose={() => setModalVisible(false)}
          onConfirm={() => {
            console.log("Atividade criada.");
            createActivity(
              titulo,
              descricao,
              enquadramento,
              objetivos,
              atividades,
              prazos,
              criterios,
              informacoes,
              premios,
              juris,
              imageBase64
            );
            {
              Platform.OS === "web"
                ? navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "WebDrawer" }],
                    })
                  )
                : navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "BottomNavigator" }],
                    })
                  );
            }

            setModalVisible(false);
          }}
          onCancel={() => {
            console.log("Atividade cancelada.");
            setModalVisible(false);
          }}
        >
          <Text>Tem certeza que deseja continuar?</Text>
        </CustomModal>
        <CustomModal
          visible={modalVisibleEdit}
          title="Editando atividade"
          confirmText="Confirmar"
          cancelText="Cancelar"
          onClose={() => setModalVisibleEdit(false)}
          onConfirm={() => {
            console.log("Atividade editada.");
            console.log("activityId ", activityId)
            patchActivity(
              activityId ?? "",
              titulo,
              descricao,
              enquadramento,
              objetivos,
              atividades,
              prazos,
              criterios,
              informacoes,
              premios,
              juris,
              imageBase64
            );
            {
              Platform.OS === "web"
                ? navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "WebDrawer" }],
                    })
                  )
                : navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "BottomNavigator" }],
                    })
                  );
            }

            setModalVisibleEdit(false);
          }}
          onCancel={() => {
            console.log("Edição de atividade cancelada.");
            setModalVisibleEdit(false);
          }}
        >
          <Text>Tem certeza que deseja continuar?</Text>
        </CustomModal>
        <BackArrow background={true} />
      </KeyboardAvoidingView>
    </>
  );
}

const localStyles = StyleSheet.create({
  coverContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#d7d7d7",
    justifyContent: "center",
    alignItems: "center",
  },
  juriContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  scrollableContainer: {
    height: "100%",
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 160,
  },
  preview: {
    marginTop: 16,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  uri: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#8e1b1b",
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  userName: {
    fontSize: 20,
    marginBottom: 16,
  },

  userNameContainer: {
    width: Platform.OS == "web" ? "50%" : "100%",
    marginBottom: 16,
  },

  infoContainer: {
    alignItems: "center",
    width: Platform.OS == "web" ? "50%" : "100%",
    marginBottom: 16,
    gap: 16,
  },
  screenContainer: {
    paddingBottom: Platform.OS == "web" ? 60 : 160,
    paddingTop: Platform.OS == "web" ? 32 : 64,
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    height: "100%",
  },
});
