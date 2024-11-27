import { User } from "./user";

export interface EmailAlias {
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  aliasEmail: string;
  title: string;
  url: string;
  isFavorite: boolean;
  notes: string | null;
  isActive: boolean;
  user: User;
  isDeleted: boolean;
}

export type ViewType = "all" | "favorites" | "trash";
