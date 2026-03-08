import { LiveFeedSkeleton } from "@/components/skeletons/Skeleton";
import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      {/* Hero placeholder */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded-2xl w-3/4 mx-auto" />
            <div className="h-6 bg-slate-200 rounded-lg w-1/2 mx-auto" />
            <div className="h-14 bg-slate-200 rounded-xl max-w-2xl mx-auto" />
          </div>
        </div>
      </section>
      {/* Cards placeholder */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-lg mb-4" />
              <div className="h-5 bg-slate-200 rounded mb-2 w-2/3" />
              <div className="h-3 bg-slate-200 rounded mb-1" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </section>
      <LiveFeedSkeleton />
    </>
  );
}
