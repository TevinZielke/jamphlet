import { atom, useAtom, useSetAtom } from "jotai";

const itemAtom = atom(0);

export function useItemAtom() {
  return useAtom(itemAtom);
}

export function useSetItemAtom() {
  return useSetAtom(itemAtom);
}
