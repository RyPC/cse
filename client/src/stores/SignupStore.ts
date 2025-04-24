import { create } from "zustand";

interface SignupState {
  root: number;
  openRoot: boolean;
  setRoot: (root: number) => void;
  setOpenRoot: (openRoot: boolean) => void;
  clearStore: () => void;
}

const useSignupStore = create<SignupState>((set) => ({
  root: -1,
  openRoot: false,
  setRoot: (root: number) => set({ root }),
  setOpenRoot: (openRoot: boolean) => set({ openRoot }),
  clearStore: () =>
    set({
      root: -1,
      openRoot: false,
    }),
}));

export default useSignupStore;
