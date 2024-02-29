import { atom, useAtom, useSetAtom } from "jotai";

// import { Client } from "@jamphlet/database";

// type Config = {
//   selected: Client["id"];
// };

const clientAtom = atom(0);

export function useClientAtom() {
  return useAtom(clientAtom);
}

export function useSetClientAtom() {
  return useSetAtom(clientAtom);
}
