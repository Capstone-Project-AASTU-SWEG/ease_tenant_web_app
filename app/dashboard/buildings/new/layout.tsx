import type { Metadata } from "next";
import { CreateBuilldingContextProvider } from "./_contexts";

export const metadata: Metadata = {
  title: "Create new Building",
  description: "Create new Building",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CreateBuilldingContextProvider>
        {children}
      </CreateBuilldingContextProvider>
    </>
  );
}
