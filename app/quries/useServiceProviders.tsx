"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useCreateServiceProvidersMutation = () => {
  return useMutation({
    mutationKey: ["createServiceProviders"],
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/service-providers",
          formData,
        );
        const data = response.data.data;

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while signing service providers.",
          );
        }
        throw new Error(
          "An unexpected error occurred while signing service providers.",
        );
      }
    },
  });
};
