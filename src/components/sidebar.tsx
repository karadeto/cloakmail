"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Inbox, Star, Trash2 } from "lucide-react";
import { ViewType } from "./mail";
import { Nav } from "./nav";

interface SidebarProps {
  isCollapsed: boolean;
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  onViewChange: (view: ViewType) => void;
  currentView: ViewType;
}

export function Sidebar({
  isCollapsed,
  onViewChange,
  currentView,
}: SidebarProps) {
  const { user } = useUser();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-start px-4 pt-4">
        <a href="/dashboard">
          <img src="/cloakmail.png" alt="logo" width={120} height={120} />
        </a>
      </div>
      <Nav
        currentView={currentView}
        isCollapsed={isCollapsed}
        links={[
          {
            title: "All Items",
            label: "",
            icon: Inbox,
            variant: currentView === "all" ? "default" : "ghost",
            onClick: () => onViewChange("all"),
          },
          {
            title: "Favorites",
            label: "",
            icon: Star,
            variant: currentView === "favorites" ? "default" : "ghost",
            onClick: () => onViewChange("favorites"),
          },
          {
            title: "Trash",
            label: "",
            icon: Trash2,
            variant: currentView === "trash" ? "default" : "ghost",
            onClick: () => onViewChange("trash"),
          },
        ]}
      />
      <div className="mt-auto border-t">
        <div className="flex items-center justify-start p-4 gap-4">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
          <div>
            {user && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.emailAddresses[0].emailAddress}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
