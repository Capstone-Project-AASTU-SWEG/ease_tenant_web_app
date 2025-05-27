"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, CommonUserData, Tenant } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUserSignInMutation = () => {
  return useMutation({
    mutationKey: ["userSignIn"],
    mutationFn: async (payload: { email: string; password: string }) => {
      try {
        const response = await axiosClient.post<
          APIResponse<{ token: string; user: CommonUserData }>
        >("/users/sign-in", payload);

        const data = response.data.data;
        if (!data) {
          throw new Error("User data not found.");
        }

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while signing in a user.",
          );
        }
        throw new Error(
          "An unexpected error occurred while signing in a user.",
        );
      }
    },
  });
};

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
      payload: Omit<CommonUserData, "id" | "role"> & {
        assignedBuilding?: string;
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

export const useMaintainerSignUpMutation = () => {
  return useMutation({
    mutationKey: ["maintainerSignUp"],
    mutationFn: async (payload: Omit<CommonUserData, "id" | "role"> & {}) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/maintenances/sign-up",
          payload,
        );

        const data = response.data;
        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while maintenance signup",
          );
        }
        throw new Error(
          "An unexpected error occurred while maintenance signup",
        );
      }
    },
  });
};
