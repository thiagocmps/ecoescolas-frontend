import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { globalStyles } from "../../utilities/styles";
import BackArrow from "../../components/back-arrow/back-arrow";
import TextInput from "../../components/input/input";
import DropdownSelect, {
  DropdownOption,
} from "../../components/dropdown-select/dropdown-select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native-animatable";
import Button from "../../components/button/button";
import ImagePickerMultiple from "../../components/image-picker-multiple";
import { createReport } from "../../services/api-requests";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";

const optionsBloco: DropdownOption[] = [
  { label: "Bloco A", value: "bloco A" },
  { label: "Bloco B", value: "bloco B" },
  { label: "Bloco C", value: "bloco C" },
  { label: "Bloco D", value: "bloco D" },
  { label: "Bloco E", value: "bloco E" },
  { label: "Bloco F", value: "bloco F" },
  { label: "Bloco G", value: "bloco G" },
];

export const optionsCategory: DropdownOption[] = [
  { label: "🌳 Ambientes com mofo ou cheiro forte", value: "outside_report_1" },
  {
    label: "🌳 Árvore danificada ou com risco de queda",
    value: "outside_report_2",
  },
  { label: "🌳 Lixo jogado em canteiros/jardins", value: "outside_report_3" },

  { label: "💧 Torneira pingando", value: "water_report_1" },
  { label: "💧 Vazamento em banheiro ou cozinha", value: "water_report_2" },
  { label: "💧 Descarga com defeito", value: "water_report_3" },
  { label: "💧 Mangueira aberta sem supervisão", value: "water_report_4" },

  { label: "💡 Luz acesa em sala vazia", value: "energy_report_1" },
  {
    label: "💡 Equipamentos ligados sem uso (projetor, computador, etc.)",
    value: "energy_report_2",
  },
  {
    label: "💡 Ar-condicionado/aquecedor ligado em sala vazia",
    value: "energy_report_3",
  },
  { label: "💡 Lampada avariada", value: "energy_report_4" },
];

const salasPorBloco: Record<string, DropdownOption[]> = {
  "bloco A": [
    { label: "A101", value: "A101" },
    { label: "A201", value: "A201" },
    { label: "A301", value: "A301" },
  ],
  "bloco B": [
    { label: "B101", value: "B101" },
    { label: "B201", value: "B201" },
    { label: "B301", value: "B301" },
  ],
  "bloco C": [
    { label: "C101", value: "C101" },
    { label: "C201", value: "C201" },
    { label: "C301", value: "C301" },
  ],
  "bloco D": [
    { label: "D101", value: "D101" },
    { label: "D201", value: "D201" },
    { label: "D301", value: "D301" },
  ],
  "bloco E": [
    { label: "E101", value: "E101" },
    { label: "E201", value: "E201" },
    { label: "E301", value: "E301" },
  ],
  "bloco F": [
    { label: "F101", value: "F101" },
    { label: "F201", value: "F201" },
    { label: "F301", value: "F301" },
  ],
  "bloco G": [
    { label: "G101", value: "G101" },
    { label: "G201", value: "G201" },
    { label: "G301", value: "G301" },
  ],
};

export default function AddReportScreen() {
  const navigation = useNavigation();
  const userInfo = useGetDecodedToken();
  const userId = userInfo?.data.id;
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputDescription, setInputDescription] = useState("");
  const [selectedOptionSalas, setSelectedOptionSalas] =
    useState<DropdownOption | null>(null);

  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );

  const handleBlocoSelect = (option: DropdownOption | null) => {
    setSelectedOption(option);
    setSelectedOptionSalas(null); // limpa sala selecionada anterior
  };

  const [selectedOptionCategory, setSelectedOptionCategory] =
    useState<DropdownOption | null>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "#ffff" }}>
        <View
          style={[
            localStyles.screenContainer,
            {
              flexDirection: Platform.OS === "web" ? "row" : "column",
              height: "100%",
            },
          ]}
        >
          <View style={[localStyles.header]}>
            <ImageBackground
              source={
                selectedOption?.value === "bloco A"
                  ? require("../../../assets/esmad-map/a-selected.png")
                  : selectedOption?.value === "bloco B"
                  ? require("../../../assets/esmad-map/b-selected.png")
                  : selectedOption?.value === "bloco C"
                  ? require("../../../assets/esmad-map/c-selected.png")
                  : selectedOption?.value === "bloco D"
                  ? require("../../../assets/esmad-map/d-selected.png")
                  : selectedOption?.value === "bloco E"
                  ? require("../../../assets/esmad-map/e-selected.png")
                  : selectedOption?.value === "bloco F"
                  ? require("../../../assets/esmad-map/f-selected.png")
                  : selectedOption?.value === "bloco G"
                  ? require("../../../assets/esmad-map/g-selected.png")
                  : require("../../../assets/esmad-map/esmad-map.png")
              }
              style={localStyles.image}
              resizeMode="contain"
            />
          </View>
          <View style={[localStyles.infoContainer]}>
            <DropdownSelect
              label="Bloco:"
              subLabel="(obrigatório)"
              options={optionsBloco}
              selected={selectedOption}
              onSelect={handleBlocoSelect}
              placeholder="Escolha o bloco"
              containerStyle={{
                zIndex: Platform.OS === "web" ? 100 : undefined,
              }}
            />
            <DropdownSelect
              label="Sala:"
              subLabel="(obrigatório)"
              options={
                selectedOption?.value
                  ? salasPorBloco[selectedOption.value] || []
                  : []
              }
              selected={selectedOptionSalas}
              onSelect={setSelectedOptionSalas}
              placeholder="Escolha a sala"
              containerStyle={{
                zIndex: Platform.OS === "web" ? 90 : undefined,
              }}
            />

            <DropdownSelect
              label="Categoria:"
              subLabel="(obrigatório)"
              options={optionsCategory}
              selected={selectedOptionCategory}
              onSelect={setSelectedOptionCategory}
              placeholder="Escolha a categoria"
              containerStyle={{
                zIndex: Platform.OS === "web" ? 80 : undefined,
              }}
            />

            <TextInput
              type="input"
              placeholder="Descrição da ocorrência"
              onChangeText={setInputDescription}
              value={inputDescription}
              label="Descrição:"
              subLabel="(opcional)"
            />
            <ImagePickerMultiple
              onImagesChange={setSelectedImages}
              maxImages={5}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <BackArrow background={true} />
      <View style={{ position: "absolute", bottom: 48, right: 16, left: 16 }}>
        <Button
          onPress={() => {
            console.log(selectedImages);
            createReport(
              userId,
              selectedOptionCategory?.value,
              selectedOption?.value,
              selectedOptionSalas?.value,
              inputDescription,
              selectedImages
            );
            {
              navigation.goBack();
            }
          }}
          title="Criar ocorrência"
          icon="add"
          style={{
            width: Platform.OS === "web" ? 200 : "100%",
            alignSelf: "center",
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  image: {
    width: "100%",
    height: Platform.OS === "web" ? 400 : 200,
    borderRadius: 8,
  },
  uri: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  screenContainer: {
    flex: 1,
    height: Platform.OS === "web" ? "100%" : "100%",
    backgroundColor: "#ffffff",
  },
  header: {
    width: Platform.OS === "web" ? "50%" : "100%",
    height: Platform.OS === "web" ? "100%" : 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: Platform.OS === "web" ? undefined : 64,
  },
  preview: {
    marginTop: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    position: "relative",
    zIndex: 1,
    width: Platform.OS === "web" ? "50%" : undefined,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 200,
    backgroundColor: "#ffffff",
  },
});
