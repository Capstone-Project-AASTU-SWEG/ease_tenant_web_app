import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { useGetAllTenantsOfBuilding } from "@/app/quries/useUsers";
import { getBuildingIdFromStore } from "@/utils";
import { useSearchParams } from "next/navigation";

export const useGetBuilding = () => {
  const searchParams = useSearchParams();
  let buildingId = searchParams.get("buildingId") as string;

  if (!buildingId) {
    buildingId = getBuildingIdFromStore();
  }

  const getBuildingQuery = useGetBuildingQuery(buildingId);

  return { getBuildingQuery, buildingId, isBuildingIdFound: !!buildingId };
};

export const useGetBuildingTenants = () => {
  const searchParams = useSearchParams();
  let buildingId = searchParams.get("buildingId") as string;

  if (!buildingId) {
    buildingId = getBuildingIdFromStore();
  }

  const getBuildingTenantsQuery = useGetAllTenantsOfBuilding(buildingId);

  return {
    getBuildingTenantsQuery,
    buildingId,
    isBuildingIdFound: !!buildingId,
  };
};
