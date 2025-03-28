import React from "react";
import Sidebar from "./_components/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <section className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="overflow-auto flex-1">{children}</div>
    </section>
  );
};

export default Layout;
