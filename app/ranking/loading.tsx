import Navbar from "@/components/Navbar";
import { RankingTableSkeleton, SenadorCardSkeleton } from "@/components/skeletons/Skeleton";
import { Pulse } from "@/components/skeletons/Skeleton";

export default function LoadingRanking() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <Pulse className="h-10 w-64" />
            <Pulse className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Pulse className="h-10 w-24 rounded-lg" />
            <Pulse className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-slate-100 rounded-xl w-fit">
          {[80, 90, 90, 90].map((w, i) => (
            <Pulse key={i} className="h-9 rounded-lg" style={{ width: w }} />
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <Pulse className="h-6 w-60" />
          <Pulse className="h-5 w-24 rounded-full" />
        </div>

        <RankingTableSkeleton />

        {/* Senadores section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Pulse className="h-6 w-56" />
            <Pulse className="h-5 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SenadorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
