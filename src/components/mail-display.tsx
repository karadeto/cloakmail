import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEmailAliasStore } from "@/store/useEmailAliasStore";
import { format } from "date-fns";
import { Copy, Edit, Star, Trash } from "lucide-react";
import { useState } from "react";
import { EmailAliasDetailsSkeleton } from "./email-alias-details-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function EmailAliasDisplay() {
  const {
    emailAliases,
    selectedAliasId,
    isLoading,
    setSelectedAliasId,
    setIsEditDialogOpen,
  } = useEmailAliasStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return <EmailAliasDetailsSkeleton />;
  }

  const selectedAlias = emailAliases.find(
    (alias) => alias.id === selectedAliasId
  );

  if (!selectedAlias) {
    return (
      <div className="p-8 text-center text-muted-foreground flex justify-center items-center h-full">
        No email alias selected
      </div>
    );
  }

  const toggleFavorite = useEmailAliasStore.getState().toggleFavorite;
  const markAsDeleted = useEmailAliasStore.getState().markAsDeleted;
  const permanentlyDelete = useEmailAliasStore.getState().permanentlyDelete;

  const handleMarkAsDeleted = async () => {
    if (selectedAlias.isDeleted) {
      await permanentlyDelete(selectedAlias.id);
    } else {
      await markAsDeleted(selectedAlias.id);
    }
    setSelectedAliasId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    if (selectedAliasId) {
      setIsEditDialogOpen(true);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied to your clipboard`,
      variant: "default",
      className: "bg-green-50 border-green-200",
      duration: 2000,
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2 border-b h-14">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-yellow-500 h-8 w-8"
                onClick={() => toggleFavorite(selectedAlias.id)}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    selectedAlias.isFavorite &&
                      "text-yellow-500 fill-yellow-500"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {selectedAlias.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-500 h-8 w-8"
                onClick={handleDeleteClick}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete alias</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit alias</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage alt={selectedAlias.aliasEmail} />
              <AvatarFallback className="w-10 h-10 p-4 border">
                {selectedAlias.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">
              {selectedAlias.title || selectedAlias.aliasEmail}
            </h2>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  selectedAlias.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedAlias.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 flex-1">
                  {selectedAlias.aliasEmail}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(selectedAlias.aliasEmail, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {selectedAlias.url && (
              <div>
                <h3 className="font-semibold mb-2">URL</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600 flex-1">
                    {selectedAlias.url}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(selectedAlias.url, "URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {selectedAlias.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedAlias.notes}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Created</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(selectedAlias.createdAt), "PPpp")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(selectedAlias.updatedAt), "PPpp")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAlias.isDeleted ? "Permanently Delete" : "Delete"} Email
              Alias
            </DialogTitle>
            <DialogDescription>
              {selectedAlias.isDeleted
                ? `Are you sure you want to permanently delete "${selectedAlias.title}"? This action cannot be undone.`
                : `Are you sure you want to move "${selectedAlias.title}" to trash?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMarkAsDeleted}>
              {selectedAlias.isDeleted ? "Delete" : "Move to Trash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
