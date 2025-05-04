"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, CommonUserData, Tenant } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useTenantSignUp = () => {
  return useMutation({
    mutationKey: ["tenantSignUp"],
    mutationFn: async (
      payload: Omit<Tenant, "id" | "fullname"> & {
        password: string;
      },
    ) => {
      try {
        const response = await axiosClient.post<APIResponse<{ token: string }>>(
          "/tenants",
          payload,
        );

        const data = response.data.data;
        if (!data) {
          throw new Error("Tenant data not found.");
        }

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while signing up a tenant.",
          );
        }
        throw new Error(
          "An unexpected error occurred while signing up a tenant.",
        );
      }
    },
  });
};
export const useManagerSignUp = () => {
  return useMutation({
    mutationKey: ["managerSignUp"],
    mutationFn: async (
      payload: Omit<CommonUserData, "id"> & {
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
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
