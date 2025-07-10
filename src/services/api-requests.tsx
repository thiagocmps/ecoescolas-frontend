import api from "./base-api-url";
import { Activity, Registration, User } from "../utilities/types";
import { useGetDecodedToken } from "../utilities/jwtoken-utilities";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const registerToActivity = async (
  activityId: String,
  userId: String | undefined,
  creatorId: string | undefined
) => {
  try {
    await api.post("/activities/registrations/add", {
      activityId: activityId,
      userId: userId,
      creatorId: creatorId,
      status: "pending",
    });
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao registrar atividade, tente novamente",
      visibilityTime: 3000,
    });
    return null;
  }
};

export const createActivity = async (
  titulo: string,
  type: string,
  descricao: string,
  enquadramento: string,
  objetivos: string,
  atividades: string,
  prazos: string,
  criterios: string,
  informacoes: string,
  premios: string,
  juris: string[],
  base64Image: string | null
) => {
  console.log(type)
  try {
    await api.post("/activities/add", {
      title: titulo,
      description: descricao,
      date: new Date(),
      type: type,
      info: {
        objetivos: objetivos,
        enquadramento: enquadramento,
        atividades: atividades,
        prazos: prazos,
        criterio_de_avaliacao: criterios,
        juri: juris,
        info_solicitada: informacoes,
        premios_mencoes_honrosas: premios,
        cover: base64Image,
      },
    });
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao criar atividade, tente novamente",
      visibilityTime: 3000,
    });
    return null;
  }
};

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const response = await api.get("/activities");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar atividades, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
};

export const getActivitiesByCreator = async (
  userId: string | undefined
): Promise<Activity[]> => {
  try {
    const response = await api.get(`/activities/?creatorId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar atividades, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
};

export const getRegistrationsByUser = async () => {
  try {
    const response = await api.get(`/activities/registrations/user`);
    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Erro ao buscar atividades",
      visibilityTime: 3000,
    });
    console.error("Erro ao buscar atividades do usuário:", error);
    return [];
  }
};

export const getAllMembers = async (
  activityId: string
) /* : Promise<User[]> */ => {
  try {
    const response = await api.get(`/activities/members/${activityId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar membros, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
};

export const deleteRegistration = async (
  userId: string,
  activityId: String
) => {
  try {
    const response = await api.delete(
      `activities/registrations/delete?userId=${userId}&activityId=${activityId}`
    );
    Toast.show({
      type: "success",
      text1: "Membro removido!",
      visibilityTime: 3000,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

export const getCreatorById = async (creatorId: string | undefined) => {
  try {
    const response = await api.get(`/users/${creatorId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o criador:", error);
  }
};

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: any;
};

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  deps: any[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}

export async function validateToActivity(
  activityId: string,
  userId: string | undefined
) {
  try {
    const response = await api.put(`/activities/registrations/update`, {
      userId: userId,
      activityId: activityId,
      status: "validated",
    });
    Toast.show({
      type: "success",
      text1: "Membro validado!",
      visibilityTime: 3000,
    });
    return response;
  } catch (error) {
    console.error("Erro ao validar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao validar atividade, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function deleteActivity(activityId: string) {
  try {
    const response = await api.delete(`/activities/delete/${activityId}`);
    Toast.show({
      type: "success",
      text1: "Atividade deletada!",
      visibilityTime: 3000,
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar atividade, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function getReportsByUser(): Promise<any[]> {
  try {
    const response = await api.get(`/reports/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ocorrências do utilizador:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar ocorrências, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  try {
    await api.delete(`/reports/delete/${reportId}`);
    Toast.show({
      type: "success",
      text1: "Ocorrência deletada com sucesso!",
      visibilityTime: 3000,
    });
  } catch (error) {
    console.error("Erro ao deletar ocorrência:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar ocorrência, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function createReport(
  userId?: string,
  category?: string,
  bloco?: string,
  sala?: string,
  description?: string,
  image?: String[]
) {
  try {
    const response = await api.post(`/reports/create`, {
      userId: userId,
      category: category,
      local: {
        bloco: bloco,
        sala: sala,
      },
      description: description,
      image: image,
    });
    if (response.status === 200 || response.status === 201) {
      Toast.show({
        type: "success",
        text1: "Ocorrência criada com sucesso!",
        visibilityTime: 3000,
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Erro ao tentar criar ocorrênicia",
      visibilityTime: 3000,
    });
  }
}

export async function getAllReports(): Promise<any[]> {
  try {
    const response = await api.get(`/reports/all`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ocorrências do utilizador:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar ocorrências, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
}

export async function updateReportStatus(reportId: string, status: string) {
  try {
    const response = await api.patch(`/reports/update/${reportId}`, {
      status: status,
    });
    if (response.status === 200 || response.status === 201) {
      Toast.show({
        type: "success",
        text1: "Status atualizado com sucesso!",
        visibilityTime: 3000,
      });
      return true;
    }
  } catch (error) {
    console.error("Erro ao atualizar status da ocorrência: ", error);
    Toast.show({
      type: "error",
      text1: "Erro ao atualizar status da ocorrência, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    console.warn("Chegou aqui");
    const response = await api.get(`/users/`);
    console.warn(response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar utilizadores, tente novamente",
      visibilityTime: 3000,
    });
    return [];
  }
}

export async function patchActivity(
  activityId: string,
  titulo: string,
  descricao: string,
  enquadramento: string,
  objetivos: string,
  atividades: string,
  prazos: string,
  criterios: string,
  informacoes: string,
  premios: string,
  juris: string[],
  base64Image: string | null
) {
  try {
    const response = await api.patch(`/activities/update/${activityId}`, {
      title: titulo,
      description: descricao,
      info: {
        enquadramento: enquadramento,
        objetivos: objetivos,
        atividades: atividades,
        prazos: prazos,
        criterio_de_avaliacao: criterios,
        info_solicitada: informacoes,
        premios_mencoes_honrosas: premios,
        juri: juris,
        cover: base64Image,
      },
    });
    Toast.show({
      type: "success",
      text1: "Atividade atualizada!",
      visibilityTime: 3000,
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao atualizar atividade, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function patchAccount(
  userId: string,
  status: string,
  role: string
) {
  try {
    if (role === "" || role === undefined || role === "manter") {
      await api.patch(`/users/patch/${userId}`, {
        status: status,
      });
    } else {
      await api.patch(`/users/patch/${userId}`, {
        status: status,
        role: role,
      });
    }
    Toast.show({
      type: "success",
      text1: "Conta validada com sucesso!",
      visibilityTime: 3000,
    });
  } catch (error) {}
}

export async function deleteAccount(userId: string) {
  try {
    const response = await api.delete(`/users/delete/${userId}`);
    Toast.show({
      type: "success",
      text1: "Conta deletada com sucesso!",
      visibilityTime: 3000,
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar conta, tente novamente",
      visibilityTime: 3000,
    });
  }
}

export async function processingIsValidatedToActivity(
  activityId: string
): Promise<boolean> {
  try {
    const response = await api.get(
      `/activities/registrations/checkStatus/${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar registro do utilizador:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao verificar registro do utilizador, tente novamente",
      visibilityTime: 3000,
    });
    return false;
  }
}

export function useIsValidatedToActivity(
  activityId: string,
  updateFlag?: boolean // <- parâmetro opcional para forçar atualização
) {
  const [isValidated, setIsValidated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const result = await processingIsValidatedToActivity(activityId);
      setIsValidated(result);
    };

    checkStatus();
  }, [activityId, updateFlag]); // <- updateFlag como dependência

  return isValidated;
}

export async function addImagesToRegistration(
  activityId: string,
  userId: string | undefined,
  images: string[]
) {
  try {
    const response = await api.put(`/activities/registrations/update`, {
      userId: userId,
      activityId: activityId,
      images: images,
    });
    Toast.show({
      type: "success",
      text1: "Imagem adicionada!",
      visibilityTime: 3000,
    });
    return response;
  } catch (error) {
    console.error("Erro ao adicionar imagem:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao adicionar imagem, tente novamente",
      visibilityTime: 3000,
    });
  }
}

type ActivityMessage = {
  createdAt: string;
  messageInfo: string;
};

export async function patchActivityMessages(
  message: ActivityMessage[],
  activityId: string
) {
  try {
    const response = await api.patch(`/activities/update/${activityId}`, {
      message,
    });

    Toast.show({
      type: "success",
      text1: "Mensagens atualizadas!",
      visibilityTime: 3000,
    });

    return response;
  } catch (error: any) {
    console.error("Erro ao atualizar atividade:", error?.response?.data || error);
    Toast.show({
      type: "error",
      text1: "Erro ao atualizar mensagens, tente novamente",
      visibilityTime: 3000,
    });
  }
}