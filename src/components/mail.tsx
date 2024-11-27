"use client";

import { Plus } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { EmailAlias } from "@/models/email_aliases";
import { useEmailAliasStore } from "@/store/useEmailAliasStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EmailAliasList } from "./email-alias-list";
import { EmailAliasDisplay } from "./mail-display";
import { Sidebar } from "./sidebar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Textarea } from "./ui/textarea";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: EmailAlias[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

// Create a schema for the form
const aliasFormSchema = z.object({
  url: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  notes: z.string().optional(),
});

type AliasFormValues = z.infer<typeof aliasFormSchema>;

// Add this type at the top level
export type ViewType = "all" | "favorites" | "trash";

export function Mail({ accounts, defaultLayout = [265, 440, 655] }: MailProps) {
  const [currentView, setCurrentView] = useState<ViewType>("all");
  const {
    createEmailAlias,
    updateEmailAlias,
    isLoading,
    error,
    selectedAliasId,
    setSelectedAliasId,
    emailAliases,
  } = useEmailAliasStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setIsEditDialogOpen, isEditDialogOpen } = useEmailAliasStore();
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<AliasFormValues>({
    resolver: zodResolver(aliasFormSchema),
    defaultValues: {
      url: "",
      title: "",
      notes: "",
    },
  });

  const editForm = useForm<AliasFormValues>({
    resolver: zodResolver(aliasFormSchema),
    defaultValues: {
      url: "",
      title: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isEditDialogOpen) {
      const selectedAlias = emailAliases.find(
        (alias) => alias.id === selectedAliasId
      );
      if (selectedAlias) {
        editForm.reset({
          title: selectedAlias.title,
          url: selectedAlias.url || "",
          notes: selectedAlias.notes || "",
        });
      }
    }
  }, [isEditDialogOpen, selectedAliasId, emailAliases]);

  const onSubmit = async (values: AliasFormValues) => {
    try {
      await createEmailAlias({
        url: values.url || "",
        notes: values.notes || "",
        title: values.title,
      });

      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create email alias:", error);
    }
  };

  const onEditSubmit = async (values: AliasFormValues) => {
    try {
      if (!selectedAliasId) return;

      await updateEmailAlias(selectedAliasId, {
        url: values.url || "",
        notes: values.notes || "",
        title: values.title,
      });

      editForm.reset();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update email alias:", error);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedAliasId(null);
    useEmailAliasStore.getState().fetchEmailAliases(view === "trash");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen flex border"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          minSize={15}
          maxSize={20}
          className="min-w-[200px]"
        >
          <div className="flex h-full flex-col">
            <Sidebar
              isCollapsed={false}
              accounts={accounts}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 p-2 border-b h-14">
              <Input
                placeholder="Search aliases..."
                className="h-9"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Email Alias</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      {/* Title Field */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add a Title for this alias"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Url Field */}
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Url (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Notes Field */}
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add a notes for this alias"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || !form.formState.isValid}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Alias"
                          )}
                        </Button>
                      </DialogFooter>

                      {error && (
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                      )}
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 overflow-hidden">
              <EmailAliasList
                currentView={currentView}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultLayout[2]}>
          <EmailAliasDisplay />
        </ResizablePanel>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Email Alias</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                {/* Title Field */}
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add a Title for this alias"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Url Field */}
                <FormField
                  control={editForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Url (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add a Url for this alias"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes Field */}
                <FormField
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes for this alias"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !editForm.formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Alias"
                    )}
                  </Button>
                </DialogFooter>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
