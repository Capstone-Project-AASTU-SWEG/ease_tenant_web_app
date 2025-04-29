"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export enum TAB_TYPES {
  BASIC = "Basic Info",
  ADDRESS = "Address",
  DETAILS = "Details",
  LEASE_TERMS = "Lease Terms",
}

export const TAB_TYPES_LIST: TAB_TYPES[] = [
  TAB_TYPES.BASIC,
  TAB_TYPES.ADDRESS,
  TAB_TYPES.DETAILS,
  TAB_TYPES.LEASE_TERMS,
];

type State = {
  activeTab: TAB_TYPES;
};

type Actions = {
  onTabChange: (tab: TAB_TYPES) => void;
};

const init: State & Actions = {
  activeTab: TAB_TYPES.BASIC,
  onTabChange: () => {},
};

const CreateBuilldingContext = createContext(init);

type ContextProviderProps = {
  children: ReactNode;
};

export const CreateBuilldingContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [activeTab, setActiveTab] = useState<TAB_TYPES>(TAB_TYPES.BASIC);
  const onTabChange = (tab: TAB_TYPES) => {
    setActiveTab(tab);
  };
  return (
    <CreateBuilldingContext.Provider
      value={{
        activeTab,
        onTabChange,
      }}
    >
      {children}
    </CreateBuilldingContext.Provider>
  );
};

export const useCreateBuildingContext = () => {
  const context = useContext(CreateBuilldingContext);
  if (!context)
    throw new Error(
      "useCreateBuildingContext must be used with CreateBuildingContext",
    );

  return context;
};
