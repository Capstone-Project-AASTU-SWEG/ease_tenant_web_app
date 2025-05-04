import axiosClient from "@/lib/axios-client";
import { APIResponse, Tenant, Unit, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UserDetail = { user: User & { id: string } } & {
  unit: Unit | null;
  tenant: Tenant | null;
};

export const useVerifyUserQuery = () => {
  return useQuery({
    queryKey: ["verifyUser"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<UserDetail>>("/users/verify");
        const user = response.data.data;

        if (!user) {
          throw new Error("Getting user data failed");
        }

        return user;
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
