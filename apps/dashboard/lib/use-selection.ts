import { atom, useAtom, useSetAtom } from "jotai";

const selectionAtom = atom<number[]>([1, 2, 3]);

export function useSelectionAtom() {
  return useAtom(selectionAtom);
}

export function useSetSelectionAtom() {
  return useSetAtom(selectionAtom);
}
