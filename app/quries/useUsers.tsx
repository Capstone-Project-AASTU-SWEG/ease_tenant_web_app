"use client";

import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  CommonUserData,
  MaintenanceWorker,
  Manager,
  ServiceProvider,
  Tenant,
  UserDetail,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const useGetAllTenants = () => {
  return useQuery({
    queryKey: ["getAllTenants"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<(UserDetail & Tenant)[]>>(
            "/tenants",
          );
        const data = response.data;

        const refinedData =
          data.data?.map((tenant) => ({
            ...tenant,
            ...tenant.userId,
          })) || [];

        console.log({ refinedData });

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
          APIResponse<(UserDetail & Tenant)[]>
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
          await axiosClient.get<
            APIResponse<(UserDetail & Manager & { user: CommonUserData })[]>
          >("/managers");
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

export const useGetManagerByIdQuery = (mId?: string) => {
  const query = useQuery({
    queryKey: ["getManager"],
    queryFn: async () => {
      if (!mId) {
        return;
      }

      try {
        const response = await axiosClient.get<
          APIResponse<UserDetail & Manager & { user: CommonUserData }>
        >(`/managers/${mId}`);
        const data = response.data;

        const refineData = {
          ...data.data,
          ...data.data?.user,
        };

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

  useEffect(() => {
    if (mId) {
      query.refetch();
    }
  }, [mId, query]);

  return query;
};

export const useManagerProfileUpdateMutation = () => {
  return useMutation({
    mutationKey: ["manageProfileUpdateMutation"],
    mutationFn: async ({ manager }: { manager: Manager }) => {
      try {
        const response = await axiosClient.put<
          APIResponse<{ user: Manager }[]>
        >(`/managers/${manager.id}`, manager);
        const data = response.data;

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while updating manager profile",
          );
        }
        throw new Error(
          "An unexpected error occurred while updating manager profile",
        );
      }
    },
  });
};

export const useTenantProfileUpdateMutation = () => {
  return useMutation({
    mutationKey: ["tenantProfileUpdateMutation"],
    mutationFn: async ({ tenant }: { tenant: Tenant }) => {
      try {
        const response = await axiosClient.put<APIResponse<{ user: Tenant }[]>>(
          `/tenants/${tenant.id}`,
          tenant,
        );
        const data = response.data;

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while updating tenant profile",
          );
        }
        throw new Error(
          "An unexpected error occurred while updating tenant profile",
        );
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
          await axiosClient.get<APIResponse<(UserDetail & ServiceProvider)[]>>(
            "/service-providers",
          );
        const data = response.data;

        const refineData = data.data?.map((d) => ({
          ...d,
          ...d.userId,
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
export const useGetAllMaintenances = () => {
  return useQuery({
    queryKey: ["getAllMaintenances"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<(UserDetail & MaintenanceWorker)[]>
        >("/maintenances/personals");
        const data = response.data;

        const refineData = data.data?.map((d) => ({
          ...d,
          ...d.userId,
        }));

        return refineData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while getting mainteners.",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting mainteners.",
        );
      }
    },
  });
};
