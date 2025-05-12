import api from "./base-api-url";
import { Activity, Registration } from "../utilities/types";
import { useGetDecodedToken } from "../utilities/jwtoken-utilities";
import React from "react";
import { useEffect, useState } from "react";

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
