import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "../../config/mmkv";
import { UserRole } from "../utils/role";

type AuthState = {
  userRole: UserRole;
  isAuthenticated: boolean;

  loginAsAdmin: () => void;
  loginAsUser: () => void;
  logout: () => void;

  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userRole: UserRole.GUEST,
      isAuthenticated: false,

      loginAsAdmin: () => set({ userRole: UserRole.ADMIN, isAuthenticated: true }),
      loginAsUser: () => set({ userRole: UserRole.USER, isAuthenticated: true }),
      logout: () => set({ userRole: UserRole.GUEST, isAuthenticated: false }),

      isAdmin: () => get().userRole === UserRole.ADMIN,
      isUser: () => get().userRole === UserRole.USER,
      isGuest: () => get().userRole === UserRole.GUEST,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
