import { BuildingManager } from "@/types";

export const useGetBuildingManager = () => {
  //   const { data: buildingManager } = useQuery({
  //     queryKey: ["building-manager"],
  //     queryFn: () => getBuildingManager(),
  //   });

  //   return {
  //     buildingManager,
  //   };

  const buildingManager: BuildingManager & { id: string } = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "nesru@gmail.com",
    phone: "+251911111111",
    companyName: "Nesru.Inc",
    companyAddress: "Nesru.Inc",
    termsAccepted: true,
    licenseNumber: "1234567890",
  };

  return buildingManager;
};
