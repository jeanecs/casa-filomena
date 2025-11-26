import { VillaShowcase } from "@/components/VillaShowcase";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function VillasPage() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
        <VillaShowcase />
        <Footer />
    </div>
  );
}