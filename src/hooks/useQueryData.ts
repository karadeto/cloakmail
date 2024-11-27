import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled?: boolean
) => {
  const { data, isLoading, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
  });

  return { data, isLoading, isFetched, refetch, isFetching };
};
