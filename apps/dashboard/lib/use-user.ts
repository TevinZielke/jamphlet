import { atom, useAtom, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

// import { Client } from "@jamphlet/database";

// type Config = {
//   selected: Client["id"];
// };

const configAtom = atom(0);
useHydrateAtoms([[configAtom, 0]]);

export function useUser() {
  return useAtom(configAtom);
}

export function useSetUser() {
  return useSetAtom(configAtom);
}
