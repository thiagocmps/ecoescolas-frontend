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
    });
    return null;
  }
};

export const createActivity = async (
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
) => {
  try {
    await api.post("/activities/add", {
      title: titulo,
      description: descricao,
      date: new Date(),
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
    });
    console.error("Erro ao buscar atividades do usuário:", error);
    return [];
  }
};

export const getAllMembers = async (activityId: string) => {
  try {
    const response = await api.get(`/activities/members/${activityId}`);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar membros, tente novamente",
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
    });
    return response;
  } catch (error) {
    console.error("Erro ao validar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao validar atividade, tente novamente",
    });
  }
}

export async function deleteActivity(activityId: string) {
  try {
    const response = await api.delete(`/activities/delete/${activityId}`);
    Toast.show({
      type: "success",
      text1: "Atividade deletada!",
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar atividade, tente novamente",
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
    });
  } catch (error) {
    console.error("Erro ao deletar ocorrência:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar ocorrência, tente novamente",
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
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Erro ao tentar criar ocorrênicia",
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
      });
      return true;
    }
  } catch (error) {
    console.error("Erro ao atualizar status da ocorrência: ", error);
    Toast.show({
      type: "error",
      text1: "Erro ao atualizar status da ocorrência, tente novamente",
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
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao atualizar atividade, tente novamente",
    });
  }
}

export async function patchAccount(userId: string, status: string, role: string) {
  try {
    if (role === "") {
      const response = await api.patch(`/users/patch/${userId}`, {
        status: status,
      });
    } else {
      const response = await api.patch(`/users/patch/${userId}`, {
        status: status,
        role: role,
      });
    }
    Toast.show({
      type: "success",
      text1: "Conta validada com sucesso!",
    });
  } catch (error) {}
}

export async function deleteAccount(userId: string) {
  try {
    const response = await api.delete(`/users/delete/${userId}`);
    Toast.show({
      type: "success",
      text1: "Conta deletada com sucesso!",
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao deletar conta, tente novamente",
    });
  }
}