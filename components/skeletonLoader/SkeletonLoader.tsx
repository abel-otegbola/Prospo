interface SkeletonLoaderProps {
  count?: number;
}

export default function SkeletonLoader({ count = 5 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-background border border-gray/[0.2] rounded-xl overflow-hidden animate-pulse"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Avatar skeleton */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                
                <div className="flex-1 space-y-3">
                  {/* Company name and score */}
                  <div className="flex items-center gap-3">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-6 bg-gray-200 rounded-full w-12" />
                  </div>
                  
                  {/* Industry */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-28" />
                  </div>
                </div>
                
                {/* Bookmark skeleton */}
                <div className="w-5 h-5 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Service Needs skeleton */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-32" />
                <div className="h-6 bg-gray-200 rounded-full w-28" />
                <div className="h-6 bg-gray-200 rounded-full w-24" />
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="h-3 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
