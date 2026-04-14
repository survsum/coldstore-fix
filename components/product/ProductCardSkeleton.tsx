export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl skeleton mb-4" />
      <div className="px-1 space-y-2">
        <div className="h-4 rounded-full skeleton w-3/4" />
        <div className="h-5 rounded-full skeleton w-1/3" />
      </div>
    </div>
  );
}
