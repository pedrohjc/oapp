import Navbar from "@/components/Navbar";
import { PerfilSkeleton } from "@/components/skeletons/Skeleton";

export default function LoadingPerfil() {
  return (
    <>
      <Navbar />
      <PerfilSkeleton />
    </>
  );
}
