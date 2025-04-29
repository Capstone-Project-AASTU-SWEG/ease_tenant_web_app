"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

export enum TAB_TYPES {
  BASIC = "Basic Info",
  DETAILS = "Unit Details",
  FEATURES = "Features",
  MEDIA = "Media",
}

export const TAB_TYPES_LIST = [
  TAB_TYPES.BASIC,
  TAB_TYPES.FEATURES,
];

type CreateUnitContextType = {
  activeTab: TAB_TYPES;
  onTabChange: (tab: TAB_TYPES) => void;
};

const CreateUnitContext = createContext<CreateUnitContextType>({
  activeTab: TAB_TYPES.BASIC,
  onTabChange: () => {},
});

export const CreateUnitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<TAB_TYPES>(TAB_TYPES.BASIC);

  const onTabChange = (tab: TAB_TYPES) => {
    setActiveTab(tab);
  };

  return (
    <CreateUnitContext.Provider value={{ activeTab, onTabChange }}>
      {children}
    </CreateUnitContext.Provider>
  );
};

export const useCreateUnitContext = () => useContext(CreateUnitContext);
