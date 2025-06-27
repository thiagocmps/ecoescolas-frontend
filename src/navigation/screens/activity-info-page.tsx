import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../../components/button/button";
import {
  useValidatedToActivity as useRegisteredToActivity,
  useGetDecodedToken,
} from "../../utilities/jwtoken-utilities";
import CustomModal from "../../components/modal/modal";
import { useState } from "react";
import {
  registerToActivity,
  deleteRegistration,
  deleteActivity,
  useIsValidatedToActivity,
} from "../../services/api-requests";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Image } from "react-native";
import { Activity, User } from "../../utilities/types";
import ListCard from "../../components/list-card/list-card";
import { getAllMembers } from "../../services/api-requests";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import { useCallback } from "react";
import { globalStyles } from "../../utilities/styles";
import { useAsync } from "../../services/api-requests";
import { getCreatorById } from "../../services/api-requests";
import { validateToActivity } from "../../services/api-requests";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackArrow from "../../components/back-arrow/back-arrow";
import type { RootStackParamList } from "../routes";
import { StackNavigationProp } from "@react-navigation/stack";
import ImagePickerMultiple from "../../components/image-picker-multiple";
import ImageCarousel from "../../components/image-carrousel";
import { addImagesToRegistration } from "../../services/api-requests";
import { ImageBackground } from "react-native";
import { Divider } from "react-native-paper";

export default function ActivityInfoScreen() {
  const route = useRoute();
  const { creatorId, _id, title, description, date, info } = route.params as {
    creatorId: string;
    _id: string;
    title: string;
    description: string;
    date: string;
    info: Activity["info"];
  };

  const userInfo = useGetDecodedToken();
  const userId = userInfo?.data?.id;
  const base64Icon = `data:image/png;base64,${info.cover}`;
  const [validationUpdated, setValidationUpdated] = useState(false);
  const isValidatedToActivity = useIsValidatedToActivity(
    _id,
    validationUpdated
  );
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisibleSubs, setModalVisibleSubs] = useState(false);
  const [selectedActivityImages, setSelectedActivityImages] = useState<
    string[]
  >([]);
  const [modalVisibleDeleteActivity, setModalVisibleDeleteActivity] =
    useState(false);
  const [modalVisibleDeleteRegistration, setModalVisibleDeleteRegistration] =
    useState(false);
  const [modalVisibleAddImages, setModalVisibleAddImages] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [userInformation, setUserInformation] = useState<string | null>(null);

  const [registrationUpdated, setRegistrationUpdated] = useState(false);
  const isRegisteredToActivity = useRegisteredToActivity(
    _id,
    registrationUpdated
  );

  const { data: creator, loading } = useAsync(
    () => getCreatorById(creatorId),
    [creatorId]
  );

  const fetchMembers = useCallback(() => getAllMembers(_id), [_id]);

  const {
    data: members,
    loading: isLoading,
    refetch,
  } = useFetchOnFocus(fetchMembers, {
    delay: 200,
  });

  return (
    <View style={localStyles.screenContainer}>
      <ListCard
        variant="members"
        onPressAdd={(item) => {
          const user = item as User;
          const userId = user._id;
          console.log("Adicionar membro");
          const activityId = _id;
          console.log("userId", userId);
          console.log("activityId", activityId);
          validateToActivity(activityId, userId);
          setValidationUpdated((prev) => !prev);
          refetch();
        }}
        onPressClose={(item) => {
          setModalVisibleDeleteRegistration(true);
          console.log("Remover membro");
          const user = item as User;
          const userId = user._id;
          const activityId = _id;
          setUserInformation(userId);
          setActivityId(activityId);
        }}
        activityCreatorId={creatorId}
        data={members ?? []}
        extraData={members}
        listHeaderComponent={() => (
          <View style={{ flex: 1 }}>
            <View
              style={[
                localStyles.coverContainer,
                ,
                { position: "relative", overflow: "visible" },
              ]}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: base64Icon }}
              />
              {userId === creatorId ? (
                <>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      elevation: 10,
                      zIndex: 10,
                      top: 24,
                      right: 72,
                      padding: 4,
                      backgroundColor: "tomato",
                      height: 40,
                      width: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      navigation.navigate("AddActivity", {
                        activityId: _id,
                        activityTitle: title,
                        activityDescription: description,
                        activityDate: date,
                        activityInfo: info,
                        creatorId: creatorId,
                      });
                    }}
                  >
                    <Ionicons name="pencil" size={24} color="white" />
                  </TouchableOpacity>
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
                      console.log("Apagar atividade");
                      setModalVisibleDeleteActivity(true);
                    }}
                  >
                    <Ionicons name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </>
              ) : undefined}
            </View>
            <View style={localStyles.contentContainer}>
              <View style={localStyles.titleContainer}>
                <Text
                  style={{
                    fontSize: Platform.OS == "web" ? 28 : 20,
                    width: "50%",
                  }}
                >
                  {title}
                </Text>
                {isRegisteredToActivity === null ? (
                  <Button
                    title="Inscrito"
                    variant="outlined"
                    isLoading={true}
                    disabled={false}
                    style={{ width: 150 }}
                    onPress={() => {}}
                  />
                ) : isRegisteredToActivity ? (
                  <Button
                    title="Inscrito"
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
                    title="Inscrever-se"
                    icon="ticket-outline"
                    style={{ width: 150 }}
                    onPress={() => {
                      setModalVisibleSubs(true);
                    }}
                  />
                )}
              </View>
              <View style={localStyles.infoContainer}>
                <View>
                  <Text style={localStyles.title}>Professor responsável</Text>
                  <Text
                    style={globalStyles.regularText}
                  >{`${creator?.firstName} ${creator?.lastName}`}</Text>
                </View>
                <View>
                  <Text style={localStyles.title}>Descrição</Text>
                  <Text style={globalStyles.regularText}>{description}</Text>
                </View>
                {info.enquadramento && (
                  <View>
                    <Text style={localStyles.title}>Enquadramento</Text>
                    <Text style={globalStyles.regularText}>
                      {info.enquadramento}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={localStyles.title}>Objetivos</Text>
                  <Text style={globalStyles.regularText}>{info.objetivos}</Text>
                </View>
                {info.atividades && (
                  <View>
                    <Text style={localStyles.title}>Atividades</Text>
                    <Text>{info.atividades}</Text>
                  </View>
                )}
                {info.info_solicitada && (
                  <View>
                    <Text style={localStyles.title}>
                      Informações solicitadas
                    </Text>
                    <Text style={globalStyles.regularText}>
                      {info.info_solicitada}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={localStyles.title}>Prazos</Text>
                  <Text style={globalStyles.regularText}>{info.prazos}</Text>
                </View>
                <View>
                  <Text style={localStyles.title}>Critério de avaliação</Text>
                  <Text style={globalStyles.regularText}>
                    {info.criterio_de_avaliacao}
                  </Text>
                </View>
                <View>
                  <Text style={localStyles.title}>Júri</Text>
                  {info.juri ? (
                    info.juri.map((nome, index) => (
                      <Text key={index}>{nome}</Text>
                    ))
                  ) : (
                    <Text>Nenhum júri definido</Text>
                  )}
                </View>
                {info.premios_mencoes_honrosas && (
                  <View style={{ paddingBottom: 24 }}>
                    <Text style={localStyles.title}>
                      Prémios e menções honrosas
                    </Text>
                    <Text style={globalStyles.regularText}>
                      {info.premios_mencoes_honrosas}
                    </Text>
                  </View>
                )}
                <Divider></Divider>
                {isValidatedToActivity === true && (
                  <View style={{ display: "flex", gap: 8 }}>
                    <ImagePickerMultiple
                      images={selectedActivityImages}
                      onImagesChange={setSelectedActivityImages}
                      maxImages={7}
                      title="Adicionar imagens da atividade"
                    />
                    <Button
                      title="Finalizar atividade"
                      icon="cloud-upload-outline"
                      isLoading={isLoadingButton}
                      onPress={() => {
                        if (selectedActivityImages.length === 0) {
                          Toast.show({
                            type: "error",
                            text1:
                              "Por favor, adicione imagens antes de submeter",
                            position: "top",
                            visibilityTime: 3000,
                          });
                          return;
                        }
                        setModalVisibleAddImages(true);
                      }}
                    />
                  </View>
                )}
                <View>
                  <Text style={[localStyles.title, { paddingTop: 24 }]}>
                    Membros
                  </Text>
                </View>
                {members?.length == 0 ? (
                  <View>
                    <Text>Não há inscritos</Text>
                  </View>
                ) : undefined}
              </View>
            </View>
            <CustomModal
              visible={modalVisibleSubs}
              title="Inscrever-se à atividade"
              confirmText="Confirmar"
              cancelText="Cancelar"
              onClose={() => setModalVisibleSubs(false)}
              onConfirm={() => {
                registerToActivity(_id, userId, creatorId);
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

                setModalVisibleSubs(false);
              }}
              onCancel={() => {
                console.log("Utilizador não saiu");
                setModalVisibleSubs(false);
              }}
            >
              <Text>Tens a certeza de que queres inscrever-te em {title}?</Text>
            </CustomModal>
            <CustomModal
              visible={modalVisibleDeleteActivity}
              title="Eliminar atividade"
              confirmText="Confirmar"
              cancelText="Cancelar"
              onClose={() => setModalVisibleDeleteActivity(false)}
              onConfirm={() => {
                console.log()
                deleteActivity(_id).then(() => {
                  Toast.show({
                    type: "success",
                    text1: "Atividade eliminada com sucesso! 😊",
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
                });
                setModalVisibleDeleteActivity(false);
              }}
              onCancel={() => {
                console.log("Utilizador não saiu");
                setModalVisibleDeleteActivity(false);
              }}
            >
              <Text>
                Tens a certeza de que queres apagar a atividade {title}?
              </Text>
            </CustomModal>
            <CustomModal
              visible={modalVisibleDeleteRegistration}
              title="Eliminar inscrição"
              confirmText="Confirmar"
              cancelText="Cancelar"
              onClose={() => setModalVisibleDeleteRegistration(false)}
              onConfirm={async () => {
                if (userInformation && activityId) {
                  await deleteRegistration(userInformation, activityId);
                  Toast.show({
                    type: "success",
                    text1: "Inscrição eliminada com sucesso! 😊",
                    position: "top",
                    visibilityTime: 3000,
                  });
                  await refetch();
                  setRegistrationUpdated((prev) => !prev);
                  setModalVisibleDeleteRegistration(false);
                  setValidationUpdated((prev) => !prev);
                }
              }}
              onCancel={() => {
                console.log("Utilizador não saiu");
                setModalVisibleDeleteRegistration(false);
              }}
            >
              <Text>Tem certeza que deseja eliminar a inscrição?</Text>
            </CustomModal>
            <CustomModal
              visible={modalVisibleAddImages}
              title="Adicionar Imagens"
              confirmText="Confirmar"
              cancelText="Cancelar"
              onClose={() => setModalVisibleAddImages(false)}
              onConfirm={async () => {
                setIsLoadingButton(true);
                console.log(userInformation);
                console.log(activityId);
                addImagesToRegistration(
                  _id,
                  userInfo?.data.id,
                  selectedActivityImages
                ).then(() => {
                  setIsLoadingButton(false);
                });
                Toast.show({
                  type: "success",
                  text1: "Imagens adicionadas com sucesso! 😊",
                  position: "top",
                  visibilityTime: 3000,
                });
                refetch();
                setRegistrationUpdated((prev) => !prev);
                setModalVisibleAddImages(false);
                setValidationUpdated((prev) => !prev);
              }}
              onCancel={() => {
                console.log("Utilizador não saiu");
                setModalVisibleAddImages(false);
              }}
            >
              <Text>
                Tem certeza que deseja adicionar as imagens? Estas serão
                visíveis para todos os membros da atividade e substituirão as
                imagens existentes.
              </Text>
            </CustomModal>
          </View>
        )}
        onPress={(item) => {
          const user = item as User;
        }}
      />
      <BackArrow background={true} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: Platform.OS == "web" ? 32 : 24,
    paddingBottom: 8,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    paddingHorizontal: Platform.OS == "web" ? "25%" : 8,
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
