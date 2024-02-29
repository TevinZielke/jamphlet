import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const sectionAtom = atom('');

export function useSectionAtom() {
  return useAtom(sectionAtom);
}

export function useSetSectionAtom() {
  return useSetAtom(sectionAtom);
}

export function useSectionAtomValue() {
  return useAtomValue(sectionAtom);
}
