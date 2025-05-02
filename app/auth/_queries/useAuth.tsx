"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, CommonUserData, Tenant } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useTenantSignUp = () => {
  return useMutation({
    mutationKey: ["tenantSignUp"],
    mutationFn: async (payload: Omit<Tenant, "">) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/tenants",
          payload,
        );

        const data = response.data;
        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data as APIResponse<null>;
          throw new Error(apiError.error || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
export const useManagerSignUp = () => {
  return useMutation({
    mutationKey: ["managerSignUp"],
    mutationFn: async (
      payload: Omit<CommonUserData, ""> & {
        assignedBuildingId?: string;
        employmentDate?: Date;
        salary?: number;
      },
    ) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/managers",
          payload,
        );

        const data = response.data;
        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data as APIResponse<null>;
          throw new Error(apiError.error || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
