"use client";

import axiosClient from "@/lib/axios-client";
import { APIResponse, Building } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { UnitWithId } from "./useUnits";

type BuildingWithId = Building & {
  _id: string;
};

export type BuildingStat = {
  availableUnits: number;
  occupancy: number;
};

export type BuildingWithStat = BuildingWithId & BuildingStat;

export const useGetAllBuildingsQuery = () => {
  return useQuery({
    queryKey: ["getAllBuildings"],
    queryFn: async () => {
      try {
        const response =
          await axiosClient.get<APIResponse<BuildingWithStat[]>>("/buildings");
        const buildings = response.data.data;
        const refinedBuildings = buildings?.map((building) => ({
          ...building,
        }));
        return refinedBuildings;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useGetBuildingQuery = (id?: string) => {
  const query = useQuery({
    queryKey: ["getBuilding", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error("Building ID is required");
        }
        const response = await axiosClient.get<
          APIResponse<BuildingWithStat & { units: UnitWithId[] }>
        >(`/buildings/${id}`);
        const building = response.data.data;
        if (!building) {
          throw new Error("Building not found");
        }

        const refinedBuilding = {
          ...building,
          id: building?._id,
          units: building?.units.map((unit) => ({
            ...unit,
          })),
        };

        return refinedBuilding;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
  useEffect(() => {
    if (id) {
      query.refetch();
    }
  }, [id, query]);
  return query;
};

export const useCreateBuildingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createBuilding"],
    mutationFn: async (data: FormData) => {
      try {
        const response = await axiosClient.post<
          APIResponse<Building & { _id: string }>
        >("/buildings", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const building = response.data.data;
        await queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
        return building;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useDeleteBuildingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteBuilding"],
    mutationFn: async (buildingId: string) => {
      try {
        await axiosClient.delete(`/buildings/${buildingId}`);
        await queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(errorMessage || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
