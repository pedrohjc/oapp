import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AlertCards from "@/components/AlertCards";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AlertCards />
      <LiveFeed />
      <Footer />
    </>
  );
}
