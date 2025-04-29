"use server";

import axiosClient from "@/lib/axios-client";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const registerAction = async (data: RegisterPayload) => {
  const response = await axiosClient.post<RegisterPayload>("/register", data);
  return response.data;
};


