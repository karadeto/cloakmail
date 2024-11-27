import { Skeleton } from "@/components/ui/skeleton";

export function EmailAliasSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-start gap-2 rounded-lg border p-3"
        >
          <div className="flex justify-center items-center gap-4 w-full">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
