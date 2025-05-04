import axiosClient from "@/lib/axios-client";
import { APIResponse, Building, Unit } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UnitWithId = Unit & {
  _id: string;
  id: string;
};

export type UnitWithBuilding = UnitWithId & { buildingId: Building };

export const useGetAllUnitsOfBuildingQuery = (buildingId?: string) => {
  return useQuery({
    queryKey: ["getAllUnitsOfBuilding"],
    queryFn: async () => {
      try {
        if (!buildingId) {
          throw new Error("Building ID is required");
        }
        const response = await axiosClient.get<APIResponse<UnitWithBuilding[]>>(
          `/units/${buildingId}`,
        );

        const units = response.data.data;

        const refinedUnits = units?.map((unit) => ({
          ...unit,
        }));

        return refinedUnits;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while getting units",
          );
        }
        throw new Error("An unexpected error occurred while getting units");
      }
    },
  });
};

export const useCreateUnitMutation = () => {
  return useMutation({
    mutationKey: ["createUnit"],
    mutationFn: async ({
      buildingId,
      unit,
    }: {
      buildingId: string;
      unit: Omit<Unit, "createdAt" | "updatedAt" | "id" | "images"> & {
        images: File[];
      };
    }) => {
      const formData = new FormData();
      formData.append("buildingId", buildingId);
      formData.append("floorNumber", unit.floorNumber.toString());
      formData.append("unitNumber", unit.unitNumber);
      formData.append("sizeSqFt", unit.sizeSqFt.toString());
      formData.append("type", unit.type);
      formData.append("status", unit.status);
      formData.append("monthlyRent", unit.monthlyRent.toString());
      formData.append("description", unit.description || "");
      formData.append(
        "lastRenovationDate",
        unit.lastRenovationDate?.toString() || "",
      );
      formData.append("amenities", JSON.stringify(unit.amenities));
      unit.images?.forEach((image) => {
        formData.append("images", image);
      });

      try {
        const response = await axiosClient.post<APIResponse<UnitWithId>>(
          `/units/${buildingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const unit = response.data.data;

        if (!unit) {
          throw new Error("Unit not found");
        }

        const refinedUnit = {
          ...unit,
          id: unit._id,
        };

        return refinedUnit;
      } catch (error) {
        console.log({ error });
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          throw new Error(
            errorMessage || "An error occurred while creating unit",
          );
        }
        throw new Error("An unexpected error occurred while creating unit");
      }
    },
  });
};
