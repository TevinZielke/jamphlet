import { atom, useAtom, useSetAtom } from "jotai";

const menuAtom = atom("clients");

export function useMenuAtom() {
  return useAtom(menuAtom);
}

export function useSetMenuAtom() {
  return useSetAtom(menuAtom);
}
