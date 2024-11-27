import { EmailAlias } from "@/models/email_aliases";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

interface EmailAliasStore {
  emailAliases: EmailAlias[];
  selectedAliasId: string | null;
  isEditDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchEmailAliases: (includeDeleted?: boolean) => Promise<void>;
  createEmailAlias: (data: {
    title: string;
    notes: string;
    url: string;
  }) => Promise<void>;
  setSelectedAliasId: (id: string | null) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  toggleFavorite: (id: string) => Promise<void>;
  markAsDeleted: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  updateEmailAlias: (id: string, data: Partial<EmailAlias>) => Promise<void>;
}

export const useEmailAliasStore = create<EmailAliasStore>()((set, get) => ({
  emailAliases: [],
  selectedAliasId: null,
  isEditDialogOpen: false,
  isLoading: false,
  error: null,

  setIsEditDialogOpen: (open: boolean) => {
    console.log("Setting edit dialog to:", open);
    set((state) => {
      console.log("Previous state:", state.isEditDialogOpen);
      console.log("New state:", open);
      return { isEditDialogOpen: open };
    });
  },
  fetchEmailAliases: async (includeDeleted = false) => {
    const user = useUserStore.getState().user;
    if (!user) {
      set({ error: "No user found" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/email-aliases${includeDeleted ? "?includeDeleted=true" : ""}`
      );
      if (!response.ok) throw new Error("Failed to fetch email aliases");
      const data = await response.json();
      set({ emailAliases: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch email aliases",
        isLoading: false,
        emailAliases: [],
      });
    }
  },

  permanentlyDelete: async (id: string) => {
    try {
      const url = `/api/email-aliases/${id}`;
      console.log("Attempting to delete alias with URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Delete response error:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: response.url, // This will show the final URL that was called
        });
        throw new Error(
          errorData?.message || "Failed to permanently delete alias"
        );
      }

      set((state) => ({
        emailAliases: state.emailAliases.filter((a) => a.id !== id),
        error: null,
      }));
    } catch (error) {
      console.error("Delete error details:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Network error while deleting alias",
      });
      throw error;
    }
  },

  markAsDeleted: async (id: string) => {
    const { emailAliases } = get();
    const alias = emailAliases.find((a) => a.id === id);
    if (!alias) return;

    try {
      const response = await fetch(`/api/email-aliases/${id}/deleted`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to mark as deleted");
      set((state) => ({
        emailAliases: state.emailAliases.map((a) =>
          a.id === id ? { ...a, isDeleted: !a.isDeleted } : a
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to mark as deleted",
      });
    }
  },

  createEmailAlias: async (data: {
    title: string;
    notes: string;
    url: string;
  }) => {
    const user = useUserStore.getState().user;
    if (!user) {
      set({ error: "No user found" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/email-aliases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create email alias");
      const newAlias = await response.json();
      set((state) => ({
        emailAliases: [...state.emailAliases, newAlias],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create email alias",
        isLoading: false,
      });
    }
  },

  setSelectedAliasId: (id) => {
    if (id === get().selectedAliasId) {
      set({ selectedAliasId: null });
    } else {
      set({ selectedAliasId: id });
    }
  },

  toggleFavorite: async (id: string) => {
    const { emailAliases } = get();
    const alias = emailAliases.find((a) => a.id === id);
    if (!alias) return;

    try {
      const response = await fetch(`/api/email-aliases/${id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to toggle favorite status");

      const updatedAlias = await response.json();
      set((state) => ({
        emailAliases: state.emailAliases.map((a) =>
          a.id === id ? updatedAlias : a
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to toggle favorite",
      });
    }
  },

  updateEmailAlias: async (id: string, data: Partial<EmailAlias>) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => ({
        emailAliases: state.emailAliases.map((alias) =>
          alias.id === id ? { ...alias, ...data, updatedAt: new Date() } : alias
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update alias", isLoading: false });
      throw error;
    }
  },
}));
