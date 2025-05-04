"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, Application } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export type ApplicationWithId = Application & {
  id: string;
};

export const useGetApplicationsOfBuildingQuery = (buildingId: string) => {
  const query = useQuery({
    queryKey: ["getApplicationsOfBuilding"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<ApplicationWithId[]>
        >(`/buildings/${buildingId}`);
        const applications = response.data.data;

        return applications;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while getting building application.",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting building application.",
        );
      }
    },
  });

  useEffect(() => {
    if (buildingId) {
      query.refetch();
    }
  }, [buildingId, query]);

  return query;
};

export const useCreateRentalApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTenantMutation"],
    mutationFn: async (payload: FormData) => {
      try {
        await axiosClient.post("/applications", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await queryClient.invalidateQueries({
          queryKey: ["getApplicationsOfBuilding"],
        });
        return null;
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
