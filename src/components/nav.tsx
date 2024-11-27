"use client";

import { LucideIcon } from "lucide-react";

import { ViewType } from "./mail";
import { Button } from "./ui/button";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    onClick: () => void;
  }[];
  currentView: ViewType;
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div className="group flex flex-col gap-1 px-2 my-6">
      {links.map((link, index) => (
        <Button
          key={index}
          variant={link.variant}
          className="w-full justify-start"
          onClick={link.onClick}
        >
          <link.icon className="h-4 w-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">{link.title}</span>
              {link.label && (
                <span className="ml-auto text-xs">{link.label}</span>
              )}
            </>
          )}
        </Button>
      ))}
    </div>
  );
}
