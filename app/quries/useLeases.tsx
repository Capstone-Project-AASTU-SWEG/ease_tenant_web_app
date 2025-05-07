import axiosClient from "@/lib/axios-client";
import { APIResponse, WithTimestampsStr } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
