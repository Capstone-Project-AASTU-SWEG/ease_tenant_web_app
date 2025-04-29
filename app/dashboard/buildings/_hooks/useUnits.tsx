"use client";
import { Unit } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type UnitState = {
  units: Unit[];
  selectedUnit?: Unit;
};

type UnitActions = {
  addUnit: (unit: Unit) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  removeUnit: (id: string) => void;
  setSelectedUnit: (unitId: string) => void;
  getUnitsByBuilding: (buildingId: string) => Unit[];
  resetUnits: () => void;
};

const initialState: UnitState = {
  units: [
    // {
    //   id: "1",
    //   buildingId: "1",
    //   floorNumber: 1,
    //   unitNumber: "101",
    //   sizeSqFt: 1200,
    //   type: UNIT_TYPE.OFFICE,
    //   status: UNIT_STATUS.AVAILABLE,
    //   monthlyRent: 3000,
    //   amenities: [
    //     UNIT_FEATURE.HVAC,
    //     UNIT_FEATURE.PARKING,
    //     UNIT_FEATURE.ADA_ACCESSIBLE,
    //   ],
    //   imageUrls: ["/office1.jpg", "/office2.jpg"],
    //   allowedUses: ["Professional Services", "Consulting"],
    //   zoningType: "Commercial",
    //   lastRenovationDate: new Date("2022-05-15"),
    //   notes: "Recently renovated with new flooring and paint",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
  ],
  selectedUnit: undefined,
};

export const useUnitStore = create<UnitState & UnitActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      addUnit: (unit) =>
        set((state) => {
          state.units.push(unit);
        }),

      updateUnit: (id, updates) =>
        set((state) => {
          const index = state.units.findIndex((u) => u.id === id);
          if (index !== -1) {
            state.units[index] = {
              ...state.units[index],
              ...updates,
              updatedAt: new Date(),
            };
          }
        }),

      removeUnit: (id) =>
        set((state) => {
          state.units = state.units.filter((u) => u.id !== id);
        }),

      setSelectedUnit: (id) => {
        const unit = get().units.find((u) => u.id === id);
        set((state) => {
          state.selectedUnit = unit;
        });
      },

      getUnitsByBuilding: (buildingId) => {
        return get().units.filter((u) => u.buildingId === buildingId);
      },

      resetUnits: () =>
        set(() => ({
          units: [],
          selectedUnit: undefined,
        })),
    })),
    { name: "UnitStore" },
  ),
);

// Utility exports
export const getUnits = () => useUnitStore.getState().units;
export const getSelectedUnit = () => useUnitStore.getState().selectedUnit;
export const getUnitById = (id: string) =>
  useUnitStore.getState().units.find((unit) => unit.id === id);
export const getUnitsByBuildingId = (buildingId: string) =>
  useUnitStore.getState().getUnitsByBuilding(buildingId);
export const addUnit = (unit: Unit) => useUnitStore.getState().addUnit(unit);
export const updateUnit = (id: string, updates: Partial<Unit>) =>
  useUnitStore.getState().updateUnit(id, updates);
export const removeUnit = (id: string) =>
  useUnitStore.getState().removeUnit(id);
