import axiosClient from "@/lib/axios-client";
import {
  APIResponse,
  Lease,
  RentalApplication,
  Tenant,
  Unit,
  WithTimestampsStr,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export type LeaseTemplate = {
  id: string;
  name: string;
  isDefault: boolean;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
};

export const useCreateLeaseTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createLeaseTemplateMutation"],
    mutationFn: async (payload: Omit<LeaseTemplate, "id">) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/leases/templates",
          payload,
        );

        const data = response.data.data;

        queryClient.invalidateQueries({
          queryKey: ["getLeaseTemplatesQuery"],
        });

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while creating a least template",
          );
        }
        throw new Error(
          "An unexpected error occurred while creating a lease template",
        );
      }
    },
  });
};

export const useGetAllLeaseQuery = () => {
  return useQuery({
    queryKey: ["getAllLeaseQuery"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<
          APIResponse<
            (Lease & {
              tenant: Tenant;
              unit: Unit;
              application: RentalApplication;
              leaseTemplate: LeaseTemplate;
            })[]
          >
        >("/leases");
        const data = response.data.data || [];

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while getting all leases",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting all leases",
        );
      }
    },
  });
};
export const useGetLeaseQuery = (leaseId: string) => {
  const query = useQuery({
    queryKey: ["getLeaseQuery"],
    queryFn: async () => {
      if (!leaseId) {
        throw new Error("Lease ID is required.");
      }
      try {
        const response = await axiosClient.get<
          APIResponse<
            Lease & {
              tenant: Tenant;
              unit: Unit;
              application: RentalApplication;
            }
          >
        >(`/leases/${leaseId}`);
        const data = response.data.data || [];

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while getting lease",
          );
        }
        throw new Error("An unexpected error occurred while getting lease");
      }
    },
  });

  useEffect(() => {
    if (leaseId) {
      query.refetch();
    }
  }, [leaseId, query]);

  return query;
};
export const useCreateLeaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createLeaseMutation"],
    mutationFn: async (
      payload: Pick<Lease, "unitId" | "tenantId" | "status"> & {
        applicationId: string;
        contractFile: Blob;
        templateId: string;
      },
    ) => {
      const formData = new FormData();
      formData.append("applicationId", payload.applicationId);
      formData.append("unitId", payload.unitId);
      formData.append("tenantId", payload.tenantId);
      formData.append("templateId", payload.templateId);
      formData.append("status", payload.status);
      formData.append("contractFile", payload.contractFile);

      try {
        const response = await axiosClient.post<APIResponse<null>>(
          "/leases",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const data = response.data.data;

        queryClient.invalidateQueries({
          queryKey: ["getLeaseQuery", "getAllLeaseQuery"],
        });

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while creating a least",
          );
        }
        throw new Error("An unexpected error occurred while creating a lease");
      }
    },
  });
};

export const useLeaseTemplatePutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["putLeaseTemplateMutation"],
    mutationFn: async (payload: LeaseTemplate) => {
      try {
        const response = await axiosClient.post<APIResponse<null>>(
          `/leases/templates/${payload.id}`,
          payload,
        );

        const data = response.data.data;

        queryClient.invalidateQueries({
          queryKey: ["getLeaseTemplatesQuery"],
        });

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while updating least template with put.",
          );
        }
        throw new Error(
          "An unexpected error occurred while updating lease template with put.",
        );
      }
    },
  });
};
export const useDeleteLeaseTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteLeaseTemplateMutation"],
    mutationFn: async (templateId: string) => {
      try {
        const response = await axiosClient.delete<APIResponse<null>>(
          `/leases/templates/${templateId}`,
        );

        const data = response.data.data;

        queryClient.invalidateQueries({
          queryKey: ["getLeaseTemplatesQuery"],
        });

        return data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while deleting least template",
          );
        }
        throw new Error(
          "An unexpected error occurred while deleting lease template",
        );
      }
    },
  });
};

export const useGetLeaseTemplatesQuery = () => {
  return useQuery({
    queryKey: ["getLeaseTemplatesQuery"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<
            APIResponse<(LeaseTemplate & WithTimestampsStr)[]>
          >("/leases/templates");

        const data = response.data.data;
        const refinedData =
          data?.map((data) => ({
            ...data,
            isDefault: false,
          })) || [];
        return refinedData;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while retriving least templates",
          );
        }
        throw new Error(
          "An unexpected error occurred while retriving least templates",
        );
      }
    },
  });
};
