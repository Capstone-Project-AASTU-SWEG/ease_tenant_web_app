"use client";

import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  MaintenanceWorker,
  Manager,
  ServiceProvider,
  Tenant,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllTenants = () => {
  return useQuery({
    queryKey: ["getAllTenants"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<Tenant[]>>("/tenants");
        const data = response.data;
        return data.data;
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

export const useGetAllManagers = () => {
  return useQuery({
    queryKey: ["getAllManagers"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<
            APIResponse<{ _id: string; userId: Manager }[]>
          >("/managers");
        const data = response.data;

        const refineData = data.data?.map((item) => ({
          id: item._id,
          ...item.userId,
        }));

        return refineData;
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

export const useGetAllServiceProviders = () => {
  return useQuery({
    queryKey: ["getAllServiceProviders"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<ServiceProvider[]>>(
            "/service-providers",
          );
        const data = response.data;
        return data.data;
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
export const useGetAllMaintenanceWorkers = () => {
  return useQuery({
    queryKey: ["getAllMaintenanceWorkers"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<MaintenanceWorker[]>
        >("/maintenance-workers");
        const data = response.data;
        return data.data;
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
