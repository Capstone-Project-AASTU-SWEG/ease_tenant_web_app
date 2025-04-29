import { getSession } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  const {
    data: session,
    isFetched,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => await getSession(),
  });

  return {
    session,
    isFetched,
    isLoading,
    isError,
    error,
  };
};
