export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">
        Loading tasks…
      </p>
    </div>
  );
}
