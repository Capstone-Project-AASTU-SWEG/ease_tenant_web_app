"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, Contact, Message } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const useGetContactsQuery = (userId?: string) => {
  const query = useQuery({
    queryKey: ["getContacts"],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        const response = await axiosClient.get<APIResponse<Contact[]>>(
          `/chats/contacts?userId=${userId}`,
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

  useEffect(() => {
    if (userId) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return query;
};
export const useGetMessagesBetweenUsersQuery = ({
  senderId,
  receiverId,
}: {
  senderId?: string;
  receiverId?: string;
}) => {
  const query = useQuery({
    queryKey: ["getMessages", senderId, receiverId],
    queryFn: async () => {
      if (!senderId || !receiverId) {
        return [];
      }

      try {
        const response = await axiosClient.get<APIResponse<Message[]>>(
          `/chats/messages?senderId=${senderId}&receiverId=${receiverId}`,
        );
        const data = response.data;

        return data.data;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage ||
              "An error occurred while getting messages between users",
          );
        }
        throw new Error(
          "An unexpected error occurred while getting messages between users.",
        );
      }
    },
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (receiverId && senderId) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId, senderId]);

  return query;
};
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (payload: {
      senderId: string;
      receiverId: string;
      message: string;
    }) => {
      try {
        const response = await axiosClient.post("/chats/send", payload);
        const data = response.data;

        queryClient.invalidateQueries({
          queryKey: ["getMessages", payload.senderId, payload.receiverId],
        });
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

  return mutation;
};
