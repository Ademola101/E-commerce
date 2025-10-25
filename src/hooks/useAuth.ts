import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "../../config/mmkv";

type UserRole = "admin" | "user" | "guest";

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
      userRole: "guest",
      isAuthenticated: false,

      loginAsAdmin: () => set({ userRole: "admin", isAuthenticated: true }),
      loginAsUser: () => set({ userRole: "user", isAuthenticated: true }),
      logout: () => set({ userRole: "guest", isAuthenticated: false }),

      isAdmin: () => get().userRole === "admin",
      isUser: () => get().userRole === "user",
      isGuest: () => get().userRole === "guest",
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
