"use client";
import { Building } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type BuildingState = {
  buildings: Building[];
  selectedBuilding?: Building;
};

type BuildingActions = {
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  setSelectedBuilding: (buildingId: string) => void;
  resetBuildings: () => void;
};

const initialState: BuildingState = {
  buildings: [],
  selectedBuilding: undefined,
};

export const useBuildingStore = create<BuildingState & BuildingActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      addBuilding: (building) =>
        set((state) => {
          state.buildings.push(building);
        }),

      updateBuilding: (id, updates) =>
        set((state) => {
          const index = state.buildings.findIndex((b) => b.id === id);
          if (index !== -1) {
            state.buildings[index] = {
              ...state.buildings[index],
              ...updates,
              updatedAt: new Date(),
            };
          }
        }),

      removeBuilding: (id) =>
        set((state) => {
          state.buildings = state.buildings.filter((b) => b.id !== id);
        }),

      setSelectedBuilding: (id) => {
        const building = get().buildings.find((b) => b.id === id);
        set((state) => {
          state.selectedBuilding = building;
        });
      },

      resetBuildings: () =>
        set(() => ({
          buildings: [],
          selectedBuilding: undefined,
        })),
    })),
    { name: "BuildingStore" },
  ),
);

// Utility exports
export const getBuildings = () => useBuildingStore.getState().buildings;
export const getSelectedBuilding = () =>
  useBuildingStore.getState().selectedBuilding;

export const getBuildingByID = (ID: string) => {
  return useBuildingStore
    .getState()
    .buildings.find((building) => building.id === ID);
};

export const addBuilding = (building: Building) =>
  useBuildingStore.getState().addBuilding(building);
