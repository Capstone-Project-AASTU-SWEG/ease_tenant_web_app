"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export type MaintenanceRequest = {
  _id: string;
  tenantId: string;
  unitNumber: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Closed";
  assignedTo?: string;
  preferredDate?: string;
  preferredTime?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceWithDetails = MaintenanceRequest & {
  tenant: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
};

export const useGetAllMaintenanceRequestsQuery = (filters?: {
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ["getAllMaintenanceRequests", filters],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<APIResponse<MaintenanceWithDetails[]>>(
          "/maintenance",
          { params: filters }
        );
        return response.data.data;
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

export const useGetMaintenanceRequestQuery = (id?: string) => {
  const query = useQuery({
    queryKey: ["getMaintenanceRequest", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error("Maintenance request ID is required");
        }
        const response = await axiosClient.get<APIResponse<MaintenanceWithDetails>>(
          `/maintenance/${id}`
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
        const response = await axiosClient.post<APIResponse<MaintenanceRequest>>(
          "/maintenance",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const request = response.data.data;
        await queryClient.invalidateQueries({ 
          queryKey: ["getAllMaintenanceRequests"] 
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
        const response = await axiosClient.patch<APIResponse<MaintenanceRequest>>(
          `/maintenance/${data.id}`,
          data.updates
        );
        const request = response.data.data;
        await queryClient.invalidateQueries({ 
          queryKey: ["getAllMaintenanceRequests"] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ["getMaintenanceRequest", data.id] 
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
          queryKey: ["getAllMaintenanceRequests"] 
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

export const useUpdateMaintenanceStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMaintenanceStatus"],
    mutationFn: async (data: {
      id: string;
      status: "Open" | "In Progress" | "Closed";
    }) => {
      try {
        const response = await axiosClient.patch<APIResponse<MaintenanceRequest>>(
          `/maintenance/${data.id}/status`,
          { status: data.status }
        );
        const request = response.data.data;
        await queryClient.invalidateQueries({ 
          queryKey: ["getAllMaintenanceRequests"] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ["getMaintenanceRequest", data.id] 
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
    mutationFn: async (data: {
      id: string;
      assignedTo: string;
    }) => {
      try {
        const response = await axiosClient.patch<APIResponse<MaintenanceRequest>>(
          `/maintenance/${data.id}/assign`,
          { assignedTo: data.assignedTo }
        );
        const request = response.data.data;
        await queryClient.invalidateQueries({ 
          queryKey: ["getAllMaintenanceRequests"] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ["getMaintenanceRequest", data.id] 
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