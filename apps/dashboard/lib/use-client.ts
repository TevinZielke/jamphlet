import { atom, useAtom, useSetAtom } from "jotai";

// import { Client } from "@jamphlet/database";

// type Config = {
//   selected: Client["id"];
// };

const configAtom = atom(0);

export function useClient() {
  return useAtom(configAtom);
}

export function useSetClient() {
  return useSetAtom(configAtom);
}
