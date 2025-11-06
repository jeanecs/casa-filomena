import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { VillaShowcase } from "@/components/VillaShowcase";
import { BulletinBoard } from "@/components/BulletinBoard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <VillaShowcase />
      <BulletinBoard isAdmin={false} />
      <Footer />
    </div>
  );
}