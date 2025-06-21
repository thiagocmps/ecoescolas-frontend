import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { globalStyles } from "../../utilities/styles";
import Tag from "../../components/tag/tag";
import BackArrow from "../../components/back-arrow/back-arrow";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import ImageCarousel from "../../components/image-carrousel";
import { Platform } from "react-native";
import { optionsCategory } from "./add-report-page";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deleteReport, updateReportStatus } from "../../services/api-requests";
import Button from "../../components/button/button";
import CustomModal from "../../components/modal/modal";
import { useState } from "react";

export default function ReportInfoScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const route = useRoute();
  const userInfo = useGetDecodedToken();
  const navigation = useNavigation();
  const userRole = userInfo?.data.role;
  const {
    _id,
    userId,
    workerId,
    status,
    category,
    local,
    description,
    image,
    createdAt,
  } = route.params as {
    _id: string;
    userId: string;
    workerId?: string;
    status: string;
    category: string;
    local: {
      bloco: string;
      sala: string;
    };
    description: string;
    image: string[];
    createdAt: Date;
  };

  const getCategoryLabel = (value: string): string => {
    const option = optionsCategory.find((opt) => opt.value === value);
    return option ? option.label : "Categoria desconhecida";
  };

  return (
    <View style={localStyles.screenContainer}>
      <ScrollView
        style={{ paddingHorizontal: Platform.OS === "web" ? "20%" : 16 }}
      >
        {status !== "solved" ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              elevation: 10,
              zIndex: 10,
              top: 24,
              right: 16,
              padding: 4,
              backgroundColor: "tomato",
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => {
              deleteReport(_id);
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
            }}
          >
            <Ionicons name="trash" size={20} color={"white"} />
          </TouchableOpacity>
        ) : undefined}

        <View
          style={{
            flex: 1,
            flexDirection: Platform.OS === "web" ? "row" : undefined,
            gap: 64,
            paddingTop: Platform.OS === "web" ? 64 : undefined,
          }}
        >
          <View style={localStyles.imageContainer}>
            <ImageBackground
              source={
                local.bloco === "bloco A"
                  ? require("../../../assets/esmad-map/a-selected.png")
                  : local.bloco === "bloco B"
                  ? require("../../../assets/esmad-map/b-selected.png")
                  : local.bloco === "bloco C"
                  ? require("../../../assets/esmad-map/c-selected.png")
                  : local.bloco === "bloco D"
                  ? require("../../../assets/esmad-map/d-selected.png")
                  : local.bloco === "bloco E"
                  ? require("../../../assets/esmad-map/e-selected.png")
                  : local.bloco === "bloco F"
                  ? require("../../../assets/esmad-map/f-selected.png")
                  : local.bloco === "bloco G"
                  ? require("../../../assets/esmad-map/g-selected.png")
                  : "Sem Bloco"
              }
              resizeMode="contain"
              style={[
                {
                  height: Platform.OS === "web" ? 500 : 200,
                  backgroundColor: "#ffffff",
                  marginTop: 8,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            />
          </View>
          <View style={localStyles.contentContainer}>
            <View
              style={{
                marginBottom: 16,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[globalStyles.title, { fontWeight: 500, width: "50%" }]}
              >
                {getCategoryLabel(category)}
              </Text>
              {userInfo?.data.role !== "worker" ? (
                status === "pending" ? (
                  <Tag
                    text="Pendente"
                    icon="ellipse"
                    color="#f0f0f0"
                    iconColor="#717083"
                    textColor="#717083"
                    style={{ width: 100 }}
                  />
                ) : (
                  <Tag
                    text="Resolvido"
                    icon="ellipse"
                    color="#8be0bc"
                    iconColor="#01673d"
                    textColor="#01673d"
                    style={{ width: 100 }}
                  />
                )
              ) : status === "pending" ? (
                <Button
                  onPress={() => {
                    console.log("Clicou no botao de finalizar");
                    console.log(local);
                    setIsModalVisible(true);
                  }}
                  title={"Pendente"}
                  disabled={false}
                  icon="ellipsis-horizontal-outline"
                  style={{ width: 140 }}
                />
              ) : (
                <Button
                  onPress={() => {
                    console.log("Clicou no botao de finalizar");
                    /* updateReportStatus(_id, "pending"); */
                  }}
                  title={"Finalizado"}
                  disabled={true}
                  variant="outlined"
                  icon="checkmark-outline"
                  style={{ width: 140 }}
                />
              )}
            </View>
            <View>
              <Text style={[globalStyles.subtitle, { fontWeight: 500 }]}>
                {local.bloco} - {local.sala}
              </Text>
              <Text style={[globalStyles.subtitle, { fontWeight: 500 }]}>
                Descrição:
              </Text>
              <Text style={globalStyles.subtitle}>{description}</Text>
              {image?.length > 0 && (
                <View style={{ width: "100%" }}>
                  <Text style={globalStyles.subtitle}>Foto:</Text>
                  <View>
                    <ImageCarousel
                      images={image}
                      isEditable={false} /*containeStyle={{width: "100%"}} */
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <BackArrow background={true} />
      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Confirmar resolução"
        onConfirm={() => {
          updateReportStatus(_id, "solved").then(() => {
            setIsModalVisible(false);
            navigation.goBack();
          });
        }}
      >
        <Text style={{ textAlign: "center", marginVertical: 16 }}>
          Tem certeza que deseja marcar esta ocorrência como resolvida?
        </Text>
      </CustomModal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    gap: 24,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 8,
    width: Platform.OS === "web" ? "50%" : "100%",
  },
  imageContainer: {
    paddingTop: 48,
    alignItems: "flex-start",
    width: Platform.OS === "web" ? "40%" : "100%",
    height: Platform.OS === "web" ? 600 : 200,
  },
});
