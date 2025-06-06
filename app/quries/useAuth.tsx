import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  Application,
  BuildingFromAPI,
  MaintenanceRequest,
  Manager,
  Tenant,
  Unit,
  User,
  USER_TYPE,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UserDetail = {
  user: User & { id: string; role: USER_TYPE };
} & {
  unit: Unit | null;
  tenant: Tenant | null;
  building: BuildingFromAPI | null;
  manager: Manager | null;
  application: Application | null;
  maintenanceRequests: MaintenanceRequest[];
};

export function useVerifyUserQuery() {
  return useQuery({
    queryKey: ["verifyUser"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<UserDetail>>("/users/verify");
        const data = response.data.data;

        if (!data) {
          throw new Error("Getting user data failed");
        }

        if (data.user.role.toLowerCase() === USER_TYPE.TENANT.toLowerCase()) {
          data.user.role = USER_TYPE.TENANT;
        }
        if (data.user.role.toLowerCase() === USER_TYPE.MANAGER.toLowerCase()) {
          data.user.role = USER_TYPE.MANAGER;
        }

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
    refetchOnWindowFocus: true,
  });
}

export const useAuth = () => {
  const verifyUserQuery = useVerifyUserQuery();
  const isTenant =
    verifyUserQuery.data?.user.role.toLocaleLowerCase() ===
    USER_TYPE.TENANT.toLocaleLowerCase();
  const isManager =
    verifyUserQuery.data?.user.role.toLocaleLowerCase() ===
    USER_TYPE.MANAGER.toLocaleLowerCase();
  const isOwner =
    verifyUserQuery.data?.user.role.toLocaleLowerCase() ===
    USER_TYPE.OWNER.toLowerCase();
  const isMaintenance =
    verifyUserQuery.data?.user.role === USER_TYPE.MAINTENANCE;
  const isServiceProvider =
    verifyUserQuery.data?.user.role === USER_TYPE.SERVICE_PROVIDER;

  return {
    verifyUserQuery,
    isTenant,
    isManager,
    isOwner,
    isMaintenance,
    isServiceProvider,

    data: verifyUserQuery.data,
    isLoading: verifyUserQuery.isLoading,
    isError: verifyUserQuery.isError,
    isFetched: verifyUserQuery.isFetched,
    isSuccess: verifyUserQuery.isSuccess,
    errorMessage:
      verifyUserQuery.error?.message ||
      "Error occured while verifing user info.",
  };
};
