import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ImageBase,
} from "react-native";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useState } from "react";
import MultiInputList from "../../components/multi-input.list/multi-input-list";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native-animatable";
import CustomModal from "../../components/modal/modal";
import { createActivity } from "../../services/api-requests";
import { useNavigation, CommonActions } from "@react-navigation/native";

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
  const navigation = useNavigation();
  
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

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64Image = result.assets[0].base64;
      setImageUri(imageUri);
      setImageBase64(base64Image ?? null);
    }
  };

  const userName = userInfo?.data?.firstName + " " + userInfo?.data?.lastName;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.scrollableContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>Olá, Professor {userName}! 😊</Text>
          </View>
          <View style={styles.infoContainer}>
            {/* Cada input tem value e onChangeText para ser controlado */}
            <Input
              label="Titulo:"
              type="input"
              placeholder="Digite o titulo da atividade"
              value={titulo}
              onChangeText={setTitulo}
            />
            <Input
              label="Descrição:"
              type="textarea"
              placeholder="Digite a descrição da atividade"
              value={descricao}
              onChangeText={setDescricao}
            />
            <Input
              label="Enquadramento:"
              type="textarea"
              placeholder="Digite o enquadramento"
              value={enquadramento}
              onChangeText={setEnquadramento}
            />
            <Input
              label="Objetivos:"
              type="textarea"
              placeholder="Digite os objetivos"
              value={objetivos}
              onChangeText={setObjetivos}
            />
            <Input
              label="Atividade:"
              type="textarea"
              placeholder="Digite as atividades"
              value={atividades}
              onChangeText={setAtividades}
            />
            <Input
              label="Prazos:"
              type="textarea"
              placeholder="Digite os prazos da atividade"
              value={prazos}
              onChangeText={setPrazos}
            />
            <Input
              label="Critério de avaliação:"
              type="textarea"
              placeholder="Digite o critério de avaliação"
              value={criterios}
              onChangeText={setCritérios}
            />
            <MultiInputList
              label="Júri:"
              placeholder="Nome do membro do júri"
              items={juris}
              onAdd={(item) => setJuris([...juris, item])}
              onRemove={(index) =>
                setJuris(juris.filter((_, i) => i !== index))
              }
            />
            <Input
              label="Informações solicitadas:"
              type="textarea"
              placeholder="Digite as informações solicitadas"
              value={informacoes}
              onChangeText={setInformacoes}
            />
            <Input
              label="Prémios e menções honrosas:"
              type="textarea"
              placeholder="Digite os prémios e menções honrosas"
              value={premios}
              onChangeText={setPremios}
            />
            <Button
              icon="cloud-upload-outline"
              title="Adicionar capa"
              variant="outlined"
              style={{
                marginTop: 10,
                width: Platform.OS == "web" ? 200 : "100%",
              }}
              onPress={pickImage}
            />
            {imageUri && (
              <View style={styles.preview}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <Text style={styles.uri}>{imageUri}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            console.log("Dados da atividade:");
            console.log({
              titulo,
              descricao,
              enquadramento,
              prazos,
              criterios,
              informacoes,
              premios,
              juris,
              imageUri,
            });
            setModalVisible(true);
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
