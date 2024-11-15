import { useMemo } from "react";

import { api } from "~/utils/api";

export function useMaterialOptions() {
  const query = api.material.getAll.useQuery();

  const { data } = query;

  const materialOptions = useMemo(() => {
    return (
      data?.map((material) => ({
        label: material.name,
        value: material,
      })) ?? []
    );
  }, [data]);

  return { materialOptions, query };
}
