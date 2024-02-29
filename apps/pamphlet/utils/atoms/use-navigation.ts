import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const navigationAtom = atom(false);

export function useNavigationAtom() {
  return useAtom(navigationAtom);
}

export function useSetNavigationAtom() {
  return useSetAtom(navigationAtom);
}

export function useNavigationAtomValue() {
  return useAtomValue(navigationAtom);
}
