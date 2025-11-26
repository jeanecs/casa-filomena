import { Hero } from "@/components/Hero";
import { BulletinBoard } from "@/components/BulletinBoard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {VillaPortal} from "@/components/VillaPortal";
import VillaTour from "@/components/VillaTour";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <VillaTour />
      <VillaPortal />
      <BulletinBoard isAdmin={false} />
      <Footer />
    </div>
  );
}