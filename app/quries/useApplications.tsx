"use client";

import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  Application,
  APPLICATION_STATUS,
  Tenant,
  WithTimestampsStr,
} from "@/types";
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
          APIResponse<
            (ApplicationWithId & {
              submittedBy: Tenant;
            } & WithTimestampsStr)[]
          >
        >(`/applications`);
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

export const useGetApplicationByIdQuery = (applicationId?: string) => {
  const query = useQuery({
    queryKey: ["getApplicationById"],
    queryFn: async () => {
      try {
        if (!applicationId) {
          throw new Error("Application ID not provided.");
        }
        const response = await axiosClient.get<
          APIResponse<
            ApplicationWithId & {
              submittedBy: Tenant;
            } & WithTimestampsStr
          >
        >(`/applications/${applicationId}`);
        const application = response.data.data;

        return application;
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
    if (applicationId) {
      query.refetch();
    }
  }, [applicationId, query]);

  return query;
};

export const useCreateRentalApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTenantMutation"],
    mutationFn: async (payload: FormData) => {
      try {
        await axiosClient.post("/applications/rent", payload, {
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

export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateApplicationStatus"],
    mutationFn: async ({
      appId,
      status,
    }: {
      appId: string;
      status: APPLICATION_STATUS;
    }) => {
      try {
        await axiosClient.patch(`/applications/${appId}/status`, { status });

        await queryClient.invalidateQueries({
          queryKey: ["getApplicationsOfBuilding"],
        });
        return null;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while updating application status",
          );
        }
        throw new Error(
          "An unexpected error occurred while updating application status.",
        );
      }
    },
  });
};
export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteApplication"],
    mutationFn: async ({ appId }: { appId: string }) => {
      try {
        await axiosClient.delete(`/applications/${appId}`);

        await queryClient.invalidateQueries({
          queryKey: ["getApplicationsOfBuilding"],
        });
        return null;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while deleting application",
          );
        }
        throw new Error(
          "An unexpected error occurred while deleting application",
        );
      }
    },
  });
};
