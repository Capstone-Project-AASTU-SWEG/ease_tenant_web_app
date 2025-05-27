"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, MaintenanceRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const useGetAllMaintenanceRequestsQuery = (filters?: {
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ["getAllMaintenanceRequests", filters],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<MaintenanceRequest[]>
        >("/maintenances", { params: filters });
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while getting all maintenace requestes",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting all maintenace requestes",
        );
      }
    },
  });
};

export const useGetMaintenanceRequestQuery = (id?: string) => {
  const query = useQuery({
    queryKey: ["getMaintenanceRequest", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error("Maintenance request ID is required");
        }
        const response = await axiosClient.get<APIResponse<MaintenanceRequest>>(
          `/maintenance/${id}`,
        );
        const request = response.data.data;
        if (!request) {
          throw new Error("Maintenance request not found");
        }
        return request;
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
  useEffect(() => {
    if (id) {
      query.refetch();
    }
  }, [id, query]);
  return query;
};

export const useCreateMaintenanceRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createMaintenanceRequest"],
    mutationFn: async (data: FormData) => {
      try {
        const response = await axiosClient.post<
          APIResponse<MaintenanceRequest>
        >("/maintenances", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const request = response.data.data;
        await queryClient.invalidateQueries({
          queryKey: ["getAllMaintenanceRequests"],
        });
        return request;
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

export const useUpdateMaintenanceRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMaintenanceRequest"],
    mutationFn: async (data: {
      id: string;
      updates: Partial<MaintenanceRequest>;
    }) => {
      try {
        const response = await axiosClient.patch<
          APIResponse<MaintenanceRequest>
        >(`/maintenance/${data.id}`, data.updates);
        const request = response.data.data;
        await queryClient.invalidateQueries({
          queryKey: ["getAllMaintenanceRequests"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getMaintenanceRequest", data.id],
        });
        return request;
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

export const useDeleteMaintenanceRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMaintenanceRequest"],
    mutationFn: async (id: string) => {
      try {
        await axiosClient.delete(`/maintenance/${id}`);
        await queryClient.invalidateQueries({
          queryKey: ["getAllMaintenanceRequests"],
        });
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

export type MaintenanceStatus =
  | "Open"
  | "In Progress"
  | "Canceled"
  | "Completed";

export const useUpdateMaintenanceStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMaintenanceStatus"],
    mutationFn: async (data: { id: string; status: MaintenanceStatus }) => {
      try {
        const response = await axiosClient.patch<
          APIResponse<MaintenanceRequest>
        >(`/maintenances/${data.id}/status`, { status: data.status });
        const request = response.data.data;
        await queryClient.invalidateQueries({
          queryKey: ["getAllMaintenanceRequests"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getMaintenanceRequest", data.id],
        });
        return request;
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

export const useAssignMaintenanceRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["assignMaintenanceRequest"],
    mutationFn: async (data: { id: string; assignedTo: string }) => {
      try {
        const response = await axiosClient.patch<
          APIResponse<MaintenanceRequest>
        >(`/maintenance/${data.id}/assign`, { assignedTo: data.assignedTo });
        const request = response.data.data;
        await queryClient.invalidateQueries({
          queryKey: ["getAllMaintenanceRequests"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getMaintenanceRequest", data.id],
        });
        return request;
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
