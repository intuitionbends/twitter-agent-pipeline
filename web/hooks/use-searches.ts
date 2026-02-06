import useSWR from "swr";
import type { SearchConfig } from "@pipeline/types.js";

import { fetcher } from "@/lib/utils";

export function useSearches() {
  const { data, error, isLoading, mutate } = useSWR<{ searches: SearchConfig[] }>(
    "/api/searches",
    fetcher
  );

  return {
    searches: data?.searches ?? [],
    isLoading,
    error,
    mutate,
  };
}
