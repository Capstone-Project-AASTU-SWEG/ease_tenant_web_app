"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type AppConfig = {
  isServiceProvidersSignUpOpen: boolean;
  isMaintenaceStaffSignUpOpen: boolean;
};

export const useGetAppConfig = () => {
  return useQuery({
    queryKey: ["getAppConfig"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<
            AppConfig & {
              id: string;
            }
          >
        >("/configs");
        const data = response.data;

        return data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateAppConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateAppConfig"],
    mutationFn: async (
      data: AppConfig & {
        id: string;
      },
    ) => {
      const { id, ...payload } = data;
      try {
        await axiosClient.put<APIResponse<AppConfig>>(
          `/configs/${id}`,
          payload,
        );

        queryClient.invalidateQueries({
          queryKey: ["getAppConfig"],
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
