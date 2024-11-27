import { Skeleton } from "@/components/ui/skeleton";

export function EmailAliasDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <Skeleton className="h-px w-full my-4" />
        <div className="grid gap-4">
          <div>
            <Skeleton className="h-5 w-[100px] mb-2" />
            <Skeleton className="h-6 w-[80px]" />
          </div>
          <div>
            <Skeleton className="h-5 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div>
            <Skeleton className="h-5 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
