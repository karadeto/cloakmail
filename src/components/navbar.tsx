import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default async function Navbar() {
  return (
    <div className="border-b bg-background h-16 flex items-center p-4">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>
      <div className="flex w-full justify-end gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}
