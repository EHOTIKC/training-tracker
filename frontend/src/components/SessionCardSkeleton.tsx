export default function SessionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs animate-pulse flex flex-col justify-between h-[210px] transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-3/5"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        </div>

        <div className="flex gap-1.5 mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-14"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-16"></div>
        </div>

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-28"></div>
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}