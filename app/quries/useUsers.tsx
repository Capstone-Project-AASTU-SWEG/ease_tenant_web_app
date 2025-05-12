"use client";

import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  CommonUserData,
  MaintenanceWorker,
  Manager,
  ServiceProvider,
  Tenant,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const useGetAllTenants = () => {
  return useQuery({
    queryKey: ["getAllTenants"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<
            APIResponse<(Tenant & { userId: CommonUserData })[]>
          >("/tenants");
        const data = response.data;
        const refinedData = data.data?.map((tenant) => ({
          ...tenant,
          ...tenant.userId,
        }));
        return refinedData;
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

export const useGetAllTenantsOfBuilding = (buildingId: string) => {
  const query = useQuery({
    queryKey: ["getAllTenantsOfBuilding", buildingId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<(Tenant & { userId: CommonUserData })[]>
        >(`/tenants/buildings/${buildingId}`);
        const data = response.data;
        const refinedData = data.data?.map((tenant) => ({
          ...tenant,
          ...tenant.userId,
        }));
        return refinedData;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while getting building tenants",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting building tenants",
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

export const useGetAllManagers = () => {
  return useQuery({
    queryKey: ["getAllManagers"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<{ user: Manager }[]>>("/managers");
        const data = response.data;

        const refineData = data.data?.map((manager) => ({
          ...manager,
          ...manager.user,
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
