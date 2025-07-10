export interface Activity {
  _id: string;
  title: string;
  type: string;
  description: string;
  creatorId: string;
  date: String;
  visible: boolean;
  message: Array<string>;
  info: {
    objetivos: string;
    enquadramento: string;
    atividades: string;
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

export type RegistrationWithActivity = {
  _id: string;
  activityId: string;
  userId: string;
  status: string;
  activity: Activity;
};

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  numMecanografico: string;
  registrationData: {
    status: string;
    createdAt: string;
    images: [string];
  };
}

export interface Report {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  workerId?: string;
  status: string;
  category: string;
  local: {
    bloco: string;
    sala: string;
  };
  description: string;
  image: string;
  createdAt: Date;
}
