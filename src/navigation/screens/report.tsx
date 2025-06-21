import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useCallback } from "react";
import { getAllReports, getReportsByUser } from "../../services/api-requests";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import ListCard from "../../components/list-card/list-card";
import Button from "../../components/button/button";
import { Platform } from "react-native";
import { deleteReport } from "../../services/api-requests";
import { Report } from "../../utilities/types";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes";
import { ActivityIndicator } from "react-native";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { globalStyles } from "../../utilities/styles";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ReportScreen() {
  const userInfo = useGetDecodedToken();
  const navigation =
    useNavigation<
      import("@react-navigation/native").NavigationProp<RootStackParamList>
    >();
  const fetchReports = useCallback(() => {
    if (!userInfo) return Promise.resolve([]);

    return userInfo.data.role === "worker"
      ? getAllReports()
      : getReportsByUser();
  }, [userInfo]);

  const {
    data: reports,
    loading: isLoading,
    refetch,
  } = useFetchOnFocus(fetchReports, {
    delay: 200,
  });

  return (
    <View style={localStyles.screenContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : !reports || reports.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ marginTop: 20 }}>
            Todas as suas ocorrências aparecerão aqui!
          </Text>
        </View>
      ) : (
        <ListCard
          variant="report"
          data={reports ?? []}
          listHeaderComponent={() => (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 16,
                paddingVertical: 20,
                marginTop: 32,
                marginBottom: 16,
                backgroundColor: "#ffffff",
                /* elevation: 5, */
                borderRadius: 20,
                borderColor: "tomato",
                borderWidth: 2,
              }}
            >
              <View
                style={{
                  padding: 8,
                  backgroundColor: "tomato",
                  borderRadius: 100,
                  position: "absolute",
                  top: 16,
                  right: 16,
                }}
              >
                <Ionicons name="bulb" size={16} color="white" />
              </View>
              <View style={{ width: "80%" }}>
                <Text
                  style={[
                    globalStyles.regularText,
                    {
                      /* paddingBottom: 16 */
                      color: "tomato",
                      fontWeight: "500",
                    },
                  ]}
                >
                  Suas inscrições em atividades ficarão aqui,{" "}
                  {userInfo?.data.firstName}{" "}
                </Text>
              </View>
            </View>
          )}
          onPress={(item) => {
            const report = item as Report;
            console.warn(report);
            navigation.navigate("ReportInfoScreen", {
              _id: report._id,
              userId: report.userId,
              workerId: report.workerId,
              status: report.status,
              category: report.category,
              local: report.local,
              description: report.description,
              image: report.image,
              createdAt: report.createdAt,
            });
          }}
          onPressClose={(item) => {
            const report = item as Report;
            console.log("Id da ocorrencia:", report._id);
            deleteReport(report._id).then(() => {
              refetch();
            });
          }}
          onPressAdd={(item) => {
            /* nao faz nada  */
          }}
        />
      )}
      {userInfo?.data.role !== "worker" ? (
        <Button
          title="Criar ocorrência"
          icon="add"
          variant="primary"
          style={{
            width: Platform.OS === "web" ? 200 : "60%",
            position: "absolute",
            bottom: 30,
          }}
          onPress={() => {
            navigation.navigate("AddReport");
          }}
        />
      ) : undefined}
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
