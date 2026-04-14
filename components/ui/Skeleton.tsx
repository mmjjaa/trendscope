export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 animate-pulse">
      <div className="h-40 w-full rounded-xl bg-gray-100" />
      <div className="h-4 w-full rounded-full bg-gray-100" />
      <div className="h-4 w-3/4 rounded-full bg-gray-100" />
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-3 w-20 rounded-full bg-gray-100" />
        <div className="h-3 w-16 rounded-full bg-gray-100" />
      </div>
    </div>
  );
}
