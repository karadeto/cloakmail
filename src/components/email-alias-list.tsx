"use client";

import { cn } from "@/lib/utils";
import { EmailAlias } from "@/models/email_aliases";
import { useEmailAliasStore } from "@/store/useEmailAliasStore";
import { Avatar } from "@radix-ui/react-avatar";
import { StarIcon } from "lucide-react";
import { EmailAliasSkeleton } from "./email-alias-skeleton";
import { ViewType } from "./mail";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

interface EmailAliasListProps {
  currentView: ViewType;
  searchQuery: string;
}

export function EmailAliasList({
  currentView,
  searchQuery,
}: EmailAliasListProps) {
  const {
    emailAliases = [],
    selectedAliasId,
    setSelectedAliasId,
    isLoading,
  } = useEmailAliasStore();

  // Filter aliases based on search query and current view
  const filteredAliases = emailAliases.filter((alias) => {
    const matchesSearch = searchQuery
      ? alias.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alias.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alias.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alias.aliasEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Apply view filters
    switch (currentView) {
      case "favorites":
        return matchesSearch && alias.isFavorite;
      case "trash":
        return matchesSearch && alias.isDeleted;
      default:
        return matchesSearch && !alias.isDeleted;
    }
  });

  if (isLoading) {
    return <EmailAliasSkeleton />;
  }

  if (!Array.isArray(filteredAliases)) {
    return <div>No email aliases found</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div
        className={cn(
          "flex flex-col gap-2 p-4",
          filteredAliases.length === 0 && "h-full"
        )}
      >
        {filteredAliases.length === 0 ? (
          <div className="flex h-full items-center justify-center ">
            <p className="text-sm text-muted-foreground">
              {currentView === "all" && "No email aliases found"}
              {currentView === "favorites" && "No favorite aliases"}
              {currentView === "trash" && "Trash is empty"}
            </p>
          </div>
        ) : (
          filteredAliases.map((item: EmailAlias) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedAliasId === item.id && "bg-muted"
              )}
              onClick={() => setSelectedAliasId(item.id)}
            >
              <div className="flex justify-center items-center gap-4 text-sm w-full">
                <div>
                  <Avatar className="">
                    <AvatarImage alt={item.id} />
                    <AvatarFallback className="w-10 h-10 p-4 border">
                      {item.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex w-full flex-col gap-1 ">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.title}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.aliasEmail}</div>
                </div>
                <div>
                  {item.isFavorite && (
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
