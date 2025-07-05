import React, { use } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  TouchableOpacityProps,
} from "react-native";
import {
  Activity,
  Registration,
  RegistrationWithActivity,
  User,
  Report,
} from "../../utilities/types";
import { ImageBackground } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResponsiveWidth } from "../../utilities/responsive-width";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import Tag from "../tag/tag";
import { optionsCategory } from "../../navigation/screens/add-report-page";
import { useState } from "react";
import ImageCarrousel from "../image-carrousel";
import { getLabelAndBlocoFromValue } from "../../utilities/get-local-report";
type Props = {
  variant:
    | "activity"
    | "registration"
    | "members"
    | "report"
    | "Account_Validation";
  activityCreatorId?: string;
  /* filterByStatus?: "pending" | "validated" | "finished"; */
  data:
    | Activity[]
    | Registration[]
    | User[]
    | RegistrationWithActivity[]
    | Report[];
  extraData?: any;
  creatorTagVisible?: boolean | { default: false };
  onPress: (item: Activity | Registration | User | Report) => void;
  onPressClose: (item: Activity | Registration | User | Report) => void;
  onPressAdd: (item: Activity | Registration | User | Report) => void;
  listHeaderComponent?: () => React.ReactElement | null;
  style?: TouchableOpacityProps["style"];
};

export default function ListCard({
  variant,
  data,
  onPress,
  onPressClose: onPressClose,
  listHeaderComponent,
  creatorTagVisible,
  activityCreatorId: activityCreator,
  onPressAdd: onPressAdd,
  style,
}: Props) {
  const currentUser = useGetDecodedToken();
  const userId = currentUser?.data.id;
  const numColumns = Platform.OS === "web" ? 2 : 1;
  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const cardWidth = useResponsiveWidth(numColumns);

  const getCategoryLabel = (value: string): string => {
    const option = optionsCategory.find((opt) => opt.value === value);
    return option ? option.label : "Categoria desconhecida";
  };

  const renderItem = ({ item }: { item: any }) => {
    const creatorId = item?.creatorId;
    const isCreator = userId === creatorId ? true : false;

    if (variant === "activity") {
      const activity = item as Activity;
      const base64IconActivity = `data:image/png;base64,${activity.info.cover}`;
      return (
        <TouchableOpacity
          style={[
            style,
            localStyles.item,
            { width: Platform.OS === "web" ? cardWidth : "100%" },
          ]}
          onPress={() => onPress(activity)}
        >
          <ImageBackground
            style={localStyles.imageWrapper}
            source={{ uri: base64IconActivity }}
            resizeMode="cover"
          ></ImageBackground>
          {isCreator == true ? (
            creatorTagVisible == true ? (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <Tag text="Criador" icon="pencil-outline" color="tomato" />
              </View>
            ) : undefined
          ) : undefined}

          <View
            style={{
              padding: 10,
              height: Platform.OS === "web" ? 85 : undefined,
            }}
          >
            <Text numberOfLines={1} style={{ fontSize: 16 }}>
              {activity.title}
            </Text>
            <Text numberOfLines={2} style={{ paddingTop: 6 }}>
              {activity.description}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (variant === "registration") {
      const registrationWithActivity = item as RegistrationWithActivity;
      const base64IconActivity = `data:image/png;base64,${registrationWithActivity.activity?.info.cover}`;

      return (
        <TouchableOpacity
          style={[
            style,
            localStyles.item,
            { width: Platform.OS === "web" ? cardWidth : "100%" },
          ]}
          onPress={() => onPress(registrationWithActivity)}
        >
          <ImageBackground
            style={localStyles.imageWrapper}
            source={{ uri: base64IconActivity }}
          ></ImageBackground>
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 35,
              }}
            >
              <Text
                style={{ fontSize: 16, width: "60%" }}
                lineBreakMode="clip"
                numberOfLines={2}
              >
                {registrationWithActivity.activity?.title}
              </Text>
              {registrationWithActivity.status === "pending" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                  }}
                >
                  <Tag
                    text="Pendente"
                    icon="ellipse"
                    color="#f0f0f0"
                    iconColor="#717083"
                    textColor="#717083"
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                  }}
                >
                  <Tag
                    text="Validado"
                    icon="ellipse"
                    color="#8be0bc"
                    iconColor="#01673d"
                    textColor="#01673d"
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (variant == "members") {
      const user = item as User;
      return (
        <TouchableOpacity
          style={[
            style,
            localStyles.membersItem,
            {
              width: Platform.OS === "web" ? "50%" : "90%",
              alignItems: "center",
              minHeight: user.registrationData.images.length > 0 ? 300 : 50,
              /* paddingVertical: 8, */
            },
          ]}
          onPress={() => onPress(user)}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              paddingVertical: 16,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: "#b8b8b8",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                width: "100%",
                /* paddingHorizontal: Platform.OS === "web" ? "25%" : 0, */
                flexDirection: "row",
                alignItems: Platform.OS === "web" ? "center" : "center",
                alignSelf: Platform.OS === "web" ? "center" : undefined,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={
                    {
                      /*  fontWeight: "bold" */
                    }
                  }
                >
                  {user.firstName} {user.lastName}
                </Text>
                {user.numMecanografico ? (
                  <Text> {user.numMecanografico}</Text>
                ) : (
                  <View
                    style={{
                      padding: 4,
                      width: 24,
                      height: 24,
                      backgroundColor: "tomato",
                      borderRadius: 180,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons
                      name="school"
                      size={16}
                      color={"white"}
                    ></Ionicons>
                  </View>
                )}
              </View>
              {currentUser?.data.id == activityCreator ? (
                user.registrationData.status === "pending" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                      borderRadius: 180,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                    }}
                  >
                    <TouchableOpacity onPress={() => onPressAdd(user)}>
                      <View
                        style={
                          {
                            /* borderWidth: 1.25, borderRadius: 180, padding: 4 */
                          }
                        }
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={"black"}
                        ></Ionicons>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressClose(user)}>
                      <Ionicons
                        name="close"
                        size={20}
                        color={"black"}
                      ></Ionicons>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
                    <TouchableOpacity onPress={() => onPressClose(user)}>
                      <Ionicons
                        name="close"
                        size={20}
                        color={"black"}
                      ></Ionicons>
                    </TouchableOpacity>
                  </View>
                )
              ) : null}
            </View>
            {Array.isArray(user.registrationData.images) &&
              user.registrationData.images.length > 0 && (
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                  <ImageCarrousel images={user.registrationData.images} />
                </View>
              )}
          </View>
        </TouchableOpacity>
      );
    }

    if (variant === "Account_Validation") {
      const account = item as User;
      /* if (account.role === "admin") {
        return undefined;
      } */
      return (
        <TouchableOpacity
          style={[
            style,
            localStyles.item,
            {
              width: Platform.OS === "web" ? cardWidth : "100%",
              height: 100,
              paddingHorizontal: 16,
              justifyContent: "flex-start",
              paddingVertical: 16,
            },
          ]}
          onPress={() => onPress(account)}
        >
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 8, width: "65%" }}>
                <Text>
                  {account.firstName} {account.lastName} -{" "}
                  {account.role === "student"
                    ? "Estudante"
                    : account.role === "professor"
                    ? "Professor"
                    : account.role === "worker"
                    ? "Segurança"
                    : "Administrador"}
                </Text>
              </View>
              {account.status === "pending" ? (
                <Tag
                  text="Pendente"
                  icon="ellipse"
                  color="#f0f0f0"
                  iconColor="#717083"
                  textColor="#717083"
                />
              ) : (
                <Tag
                  text="Validado"
                  icon="ellipse"
                  color="#8be0bc"
                  iconColor="#01673d"
                  textColor="#01673d"
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (variant === "report") {
      const report = item as Report;
      const local = getLabelAndBlocoFromValue(report.local.sala);
      return (
        <TouchableOpacity
          style={[
            style,
            localStyles.item,
            { width: Platform.OS === "web" ? cardWidth : "100%" },
          ]}
          onPress={() => onPress(report)}
        >
          <ImageBackground
            source={
              report.local.bloco === "bloco A"
                ? require("../../../assets/esmad-map/a-selected.png")
                : report.local.bloco === "bloco B"
                ? require("../../../assets/esmad-map/b-selected.png")
                : report.local.bloco === "bloco C"
                ? require("../../../assets/esmad-map/c-selected.png")
                : report.local.bloco === "bloco D"
                ? require("../../../assets/esmad-map/d-selected.png")
                : report.local.bloco === "bloco E"
                ? require("../../../assets/esmad-map/e-selected.png")
                : report.local.bloco === "bloco F"
                ? require("../../../assets/esmad-map/f-selected.png")
                : report.local.bloco === "bloco G"
                ? require("../../../assets/esmad-map/g-selected.png")
                : report.local.bloco === "patio"
                ? require("../../../assets/esmad-map/patio-selected.png")
                : "Sem bloco"
            }
            resizeMode="contain"
            style={[
              localStyles.imageWrapper,
              {
                height: 140,
                backgroundColor: "#ffffff",
                marginTop: 8,
              },
            ]}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: 16,
              width: "100%",
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ width: "90%" }}>
                  {getCategoryLabel(report.category)}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 4,
                    backgroundColor: "tomato",
                    borderRadius: 10,
                  }}
                  onPress={() => onPressClose(report)}
                >
                  <Ionicons name="trash" size={20} color={"white"} />
                </TouchableOpacity>
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold" }}
                numberOfLines={1}
              >
                {local?.bloco} - {local?.label}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {currentUser?.data.role === "worker" ? (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Text style={{}}>
                      {report.userId.firstName} {report.userId.lastName}
                    </Text>
                    {report.userId.role === "professor" ? (
                      <View
                        style={{
                          paddingHorizontal: 6,

                          borderRadius: 100,
                          backgroundColor: "tomato",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="school" color={"white"}></Ionicons>
                      </View>
                    ) : undefined}
                  </View>
                ) : undefined}
                {report.status === "pending" ? (
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
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return variant == "members" ? (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      numColumns={1}
      ListHeaderComponent={listHeaderComponent}
      contentContainerStyle={[
        localStyles.membersContainer /* {backgroundColor: "#ff0000"} */,
      ]}
      style={{ flex: 1 }}
    />
  ) : (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      numColumns={Platform.OS === "web" ? 2 : 1}
      ListHeaderComponent={listHeaderComponent}
      columnWrapperStyle={
        Platform.OS === "web"
          ? { justifyContent: "space-between", gap: 16 }
          : undefined
      }
      contentContainerStyle={[
        localStyles.listContainer,
        Platform.OS !== "web" && { alignItems: "stretch" },
      ]}
      style={{ width: "100%", flexGrow: 1 }}
    />
  );
}

const localStyles = StyleSheet.create({
  membersItem: {
    alignSelf: "center",
    textAlign: "left",
    minWidth: 160,
    justifyContent: "center",
    minHeight: 50,
    overflow: "hidden",
  },
  membersContainer: {
    justifyContent: "center",
    gap: 16,
    paddingBottom: 50,
  },
  item: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    minWidth: 160,
    borderRadius: 20,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8b8b8",
    alignSelf: "center",
  },
  listContainer: {
    width: "100%",
    paddingHorizontal: Platform.OS === "web" ? 8 : 16,
    alignItems: "center",
    paddingBottom: 100,
  },
  imageWrapper: {
    backgroundColor: "#d7d7d7",
    height: 120,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
