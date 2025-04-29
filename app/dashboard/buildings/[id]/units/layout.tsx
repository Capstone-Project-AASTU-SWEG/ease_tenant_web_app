"use client";

import type React from "react";
import { CreateUnitProvider } from "./new/_contexts";

export default function CreateUnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreateUnitProvider>{children}</CreateUnitProvider>;
}
