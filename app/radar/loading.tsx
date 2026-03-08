import Navbar from "@/components/Navbar";

export default function RadarLoading() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-96 bg-slate-100 rounded animate-pulse" />
          <div className="flex gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 w-40 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
              <div className="w-6 h-4 bg-slate-100 rounded animate-pulse" />
              <div className="w-1 h-10 bg-slate-100 rounded-full animate-pulse" />
              <div className="size-10 rounded-full bg-slate-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="size-12 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
