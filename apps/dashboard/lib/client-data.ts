import { ColumnSort, SortingState } from "@tanstack/react-table";
import { type ClientWithPamphlet } from "@jamphlet/database";

export type ClientApiResponse = {
  data: ClientWithPamphlet[];
  meta: {
    totalRowCount: number;
  };
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};
