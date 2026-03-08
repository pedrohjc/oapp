import Navbar from "@/components/Navbar";
import { Pulse } from "@/components/skeletons/Skeleton";

export default function LoadingBuscar() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Pulse className="h-14 w-full rounded-xl mb-10" />
        <Pulse className="h-4 w-40 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl">
              <Pulse className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Pulse className="h-4 w-48 mb-2" />
                <Pulse className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
