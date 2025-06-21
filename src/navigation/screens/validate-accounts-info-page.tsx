import { View, Text, Platform } from "react-native";
import { globalStyles } from "../../utilities/styles";
import { useFetchOnFocus } from "../../utilities/fetch-on-focus";
import { getAllUsers, patchAccount } from "../../services/api-requests";
import ListCard from "../../components/list-card/list-card";
import { useCallback } from "react";
import { useGetDecodedToken } from "../../utilities/jwtoken-utilities";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackArrow from "../../components/back-arrow/back-arrow";
import { StyleSheet } from "react-native";
import Tag from "../../components/tag/tag";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../../components/button/button";
import { useState } from "react";
import CustomModal from "../../components/modal/modal";
import { Modal } from "react-native-paper";
import DropdownSelect from "../../components/dropdown-select/dropdown-select";
import { DropdownOption } from "../../components/dropdown-select/dropdown-select";
import Toast from "react-native-toast-message";
import { deleteAccount } from "../../services/api-requests";

export default function ValidateAccountInfoPage() {
  const route = useRoute();
  const userInfo = useGetDecodedToken();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCancel, setModalVisibleCancel] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DropdownOption | null>(null);
  const {
    _id,
    email,
    firstName,
    lastName,
    role,
    createdAt,
    numMecanografico,
    registrationData,
  } = route.params as {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    numMecanografico: string;
    registrationData: {
      status: string;
      createdAt: string;
    };
  };

  return (
    <View
      style={[
        globalStyles.screenContainer,
        {
          paddingHorizontal: 16,
          alignItems: "center",
          paddingTop: Platform.OS === "web" ? "8%" : "22%",
          gap: 16,
          alignContent: "space-between",
        },
      ]}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          elevation: 10,
          zIndex: 10,
          top: 24,
          right: Platform.OS === "web" ? "30%" : 16,
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
          deleteAccount(_id);
        }}
      >
        <Ionicons name="trash" size={24} color="white" />
      </TouchableOpacity>
      <View
        style={{
          ...localStyles.infoContainer,
          width: Platform.OS === "web" ? "40%" : "100%",
        }}
      >
        <Text style={localStyles.text}>Email: {email}</Text>
        <Text style={localStyles.text}>Nome: {firstName}</Text>
        <Text style={localStyles.text}>Apelido: {lastName}</Text>
        <Text style={localStyles.text}>
          Criado em:{" "}
          {createdAt
            ? new Date(createdAt).toLocaleDateString()
            : "Data desconhecida"}
        </Text>
        {numMecanografico && (
          <Text style={localStyles.text}>
            Número Mecanográfico: {numMecanografico}
          </Text>
        )}
        <View style={{ flexDirection: "row" }}>
          <Text style={localStyles.text}>Status da Inscrição: </Text>

          {registrationData.status === "pending" ? (
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
              text="Validado"
              icon="ellipse"
              color="#8be0bc"
              iconColor="#01673d"
              textColor="#01673d"
              style={{ width: 100 }}
            />
          )}
        </View>
        {registrationData.status === "pending" && role !== "student" && _id !== userInfo?.data.id ? (
          <DropdownSelect
            label="Selecione o tipo de conta"
            subLabel="(Obrigatório)"
            options={[
              { label: "Professor", value: "professor" },
              { label: "Segurança", value: "worker" },
              { label: "Administrador", value: "admin" },
            ]}
            selected={selectedRole}
            onSelect={setSelectedRole}
            dropdownStyle={{ zIndex: Platform.OS === "web" ? 100 : undefined }}
          />
        ) : (
          <Text style={localStyles.text}>
            Tipo de conta:{" "}
            {role === "student"
              ? "Estudante"
              : role === "professor"
              ? "Professor"
              : role === "worker"
              ? "Segurança"
              : "Administrador"}
          </Text>
        )}
      </View>
      {registrationData.status === "pending" && _id !== userInfo?.data.id ? (
        <Button
          onPress={() => {
            setModalVisible(true);
          }}
          title="Validar conta"
          icon="person-add"
          variant="primary"
          style={{ width: Platform.OS === "web" ? 200 : "100%", zIndex: 0 }}
        ></Button>
      ) : (
        <Button
          onPress={() => {
            setModalVisibleCancel(true);
          }}
          title="Cancelar validação"
          variant="outlined"
          icon="person-remove"
          style={{ width: Platform.OS === "web" ? 200 : "100%", zIndex: 0 }}
        ></Button>
      )}
      <CustomModal
        visible={modalVisible}
        title="Validar conta"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          if (!selectedRole) {
            setModalVisible(false);
            Toast.show({
              type: "error",
              text1:
                "Por favor, selecione um tipo de conta antes de validar a conta!",
            });
            return;
          }
          patchAccount(_id, "validated", "").then(() => {
            navigation.goBack();
          });
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Text>Tem certeza que deseja validar essa conta?</Text>
      </CustomModal>
      <CustomModal
        visible={modalVisibleCancel}
        title="Cancelar validação"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onClose={() => setModalVisibleCancel(false)}
        onConfirm={() => {
          patchAccount(_id, "pending", selectedRole?.value ?? "").then(() => {
            navigation.goBack();
          });
          setModalVisibleCancel(false);
        }}
        onCancel={() => {
          setModalVisibleCancel(false);
        }}
      >
        <Text>Tem certeza que deseja cancelar a validação dessa conta?</Text>
      </CustomModal>
      <BackArrow background={true} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  infoContainer: {
    width: "100%",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderColor: "#dedede",
    borderWidth: 1,
  },
});
