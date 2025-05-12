export interface Activity {
  _id: string;
  title: string;
  description: string;
  creatorId: string;
  date: String;
  visible: boolean;
  info: {
    objetivos: string;
    enquadramento: string;
    atividade: string;
    info_solicitada: string;
    prazos: string;
    criterio_de_avaliacao: string;
    juri: Array<string>;
    premios_mencoes_honrosas: string;
    cover: string;
  };
}

export interface Registration {
  _id: string;
  activityId: string;
  userId: string;
  status: string; 
}