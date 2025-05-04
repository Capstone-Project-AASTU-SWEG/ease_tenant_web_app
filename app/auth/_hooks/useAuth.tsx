"use client";

import { create } from "zustand";
import { TenantFormValues } from "../_validations";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CommonUserData, USER_TYPE } from "@/types";

export type Tenant = TenantFormValues;

export type User =
  | (Omit<Tenant, "confirmPassword" | "termsAccepted"> & {
      id: string;
    })
  | CommonUserData;

export type AuthState = {
  user: User | null;
  userType: USER_TYPE | undefined;
};

export type AuthActions = {
  signUp: (user: User, userType: USER_TYPE) => void;
  signIn: (user: { email: string; password: string }) => void;
  signOut: () => void;
};

const initialState: AuthState = {
  user: {
    id: "1",
    businessName: "Nesru.Inc",
    businessType: "LLC",
    businessWebsite: "https://nesru.com",
    businessRegistrationNumber: "123456789",
    email: "nesrugetahun@gmail.com",
    password: "nesru123",
    firstName: "Nesru",
    lastName: "Getahun",
    phone: "+251911111111",
    taxId: "1234567890",
    occupation: "Developer",
  },
  userType: USER_TYPE.OWNER,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      signUp(user, userType) {
        set((prev) => {
          prev.user = user;
          prev.userType = userType;
        });
      },
      signIn(user) {
        console.log({ user });
      },
      signOut() {},
    })),
    {
      name: "Auth Store",
    },
  ),
);

//  Uitility exports
export const authUser = () => useAuthStore.getState().user;
export const authUserType = () => useAuthStore.getState().userType;
export const signUp = (user: User, userType: USER_TYPE) =>
  useAuthStore.getState().signUp(user, userType);
export const signIn = () => useAuthStore.getState().signIn;
export const signOut = () => useAuthStore.getState().signOut;
