import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  createUser: (data: {
    email: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/users/me");
          if (response.status === 404) {
            // User doesn't exist, create them
            const userResponse = await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: "temp@example.com", // You should get this from Clerk
              }),
            });
            if (!userResponse.ok) throw new Error("Failed to create user");
            const userData = await userResponse.json();
            set({ user: userData, isLoading: false });
            return;
          }

          if (!response.ok) throw new Error("Failed to fetch user");
          const userData = await response.json();
          set({ user: userData, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch user",
            isLoading: false,
          });
        }
      },

      createUser: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Failed to create user");
          const userData = await response.json();
          set({ user: userData, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create user",
            isLoading: false,
          });
        }
      },

      setUser: (user) => set({ user }),

      updateUser: async (data) => {
        const { user } = useUserStore.getState();
        if (!user) {
          set({ error: "No user found" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/users/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Failed to update user");
          const updatedUser = await response.json();
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update user",
            isLoading: false,
          });
        }
      },

      clearUser: () => set({ user: null, error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
