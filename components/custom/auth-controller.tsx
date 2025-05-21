"use client";
import { useAuth } from "@/app/quries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, Suspense } from "react";

const ADMIN_ONLY = [
  "/dashboard",
  "/dashboard/applications",
  "/dashboard/leases",
  "/dashboard/tenants",
];

const AuthController = ({ children }: PropsWithChildren) => {
  const { isTenant } = useAuth();
  const pathname = usePathname();

  const router = useRouter();

  if (ADMIN_ONLY.includes(pathname)) {
    if (isTenant) {
      router.replace("/dashboard/tenant");
    }
  }

  return <Suspense fallback="">{children}</Suspense>;
};

export default AuthController;
