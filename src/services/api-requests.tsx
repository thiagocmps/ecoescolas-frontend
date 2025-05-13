import api from "./base-api-url";
import { Activity } from "../utilities/types";

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const response = await api.get("/activities");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

export const registerToActivity = async (
  activityId: String,
  userId: String | undefined
) => {
  try {
    await api.post("/activities/registrations/add", {
      activityId: activityId,
      userId: userId,
      status: "pending",
    });
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
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
    return null;
  }
};
