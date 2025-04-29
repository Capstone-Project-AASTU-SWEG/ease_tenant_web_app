"use client";
import {
  Application,
  ApplicationStatus,
  ApplicationType,
  PriorityLevel,
} from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

function updateApplicationHelper<T extends Application>(
  original: T,
  updates: Partial<T>,
): T {
  return {
    ...original,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
}

type ApplicationState = {
  applications: Application[];
  selectedApplication?: Application;
  filters: {
    status?: ApplicationStatus[];
    type?: ApplicationType[];
    priority?: PriorityLevel[];
    assignedTo?: string[];
    buildingId?: string[];
  };
};

type ApplicationActions = {
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  setSelectedApplication: (applicationId: string) => void;
  setFilters: (filters: Partial<ApplicationState["filters"]>) => void;
  resetApplications: () => void;
};

const initialState: ApplicationState = {
  applications: [],
  selectedApplication: undefined,
  filters: {},
};

export const useApplicationStore = create<
  ApplicationState & ApplicationActions
>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      addApplication: (application) =>
        set((state) => {
          state.applications.push(application);
        }),

      updateApplication: (id, updates) =>
        set((state) => {
          const index = state.applications.findIndex((app) => app.id === id);
          const original = state.applications[index];
          if (index !== -1) {
            state.applications[index] = updateApplicationHelper(original, {
              ...updates,
              lastUpdated: new Date().toISOString(),
            });

            // If the updated application is the selected one, update it as well
            if (state.selectedApplication?.id === id) {
              state.selectedApplication = updateApplicationHelper(original, {
                ...updates,
                lastUpdated: new Date().toISOString(),
              });
            }
          }
        }),

      removeApplication: (id) =>
        set((state) => {
          state.applications = state.applications.filter(
            (app) => app.id !== id,
          );
          if (state.selectedApplication?.id === id) {
            state.selectedApplication = undefined;
          }
        }),

      setSelectedApplication: (id) => {
        const application = get().applications.find((app) => app.id === id);
        set((state) => {
          state.selectedApplication = application;
        });
      },

      setFilters: (filters) =>
        set((state) => {
          state.filters = {
            ...state.filters,
            ...filters,
          };
        }),

      resetApplications: () =>
        set(() => ({
          applications: [],
          selectedApplication: undefined,
          filters: {},
        })),
    })),
    { name: "ApplicationStore" },
  ),
);

// Utility exports
export const getApplications = () =>
  useApplicationStore.getState().applications;
export const getSelectedApplication = () =>
  useApplicationStore.getState().selectedApplication;
export const getApplicationFilters = () =>
  useApplicationStore.getState().filters;

export const getApplicationByID = (id: string) => {
  return useApplicationStore
    .getState()
    .applications.find((application) => application.id === id);
};

export const getApplicationsByBuilding = (buildingId: string) => {
  return useApplicationStore.getState().applications.filter((app) => {
    if (app.type === "rental" || app.type === "maintenance") {
      return app.unitDetails.buildingId === buildingId;
    }
    if (app.type === "service" && app.targetBuildings) {
      return app.targetBuildings.some((b) => b.id === buildingId);
    }
    return false;
  });
};

export const addApplication = (application: Application) =>
  useApplicationStore.getState().addApplication(application);

export const updateApplicationStatus = (
  id: string,
  status: ApplicationStatus,
) => useApplicationStore.getState().updateApplication(id, { status });

export const assignApplication = (
  id: string,
  assignedTo: { id: string; name: string; avatar?: string },
) => useApplicationStore.getState().updateApplication(id, { assignedTo });

export const removeApplication = (id: string) =>
  useApplicationStore.getState().removeApplication(id);
