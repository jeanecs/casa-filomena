import { Suspense } from "react";
import { VillaShowcase } from "@/components/VillaShowcase";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function VillasPage() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <VillaShowcase />
        </Suspense>
        <Footer />
    </div>
  );
}