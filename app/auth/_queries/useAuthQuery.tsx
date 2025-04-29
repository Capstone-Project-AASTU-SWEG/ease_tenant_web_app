"use client";
import { handleSignUp } from "@/lib/auth";
import { AuthPayload } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  return useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (userInfo: AuthPayload) => {
      await handleSignUp(userInfo);
    },
  });
};
