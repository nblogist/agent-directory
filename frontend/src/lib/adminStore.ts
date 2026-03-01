import { create } from 'zustand';

interface AdminState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
