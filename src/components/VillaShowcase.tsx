"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VillaCard } from "../components/VillaCard";
import { toast } from "sonner";

export function VillaShowcase() {
  const [villas, setVillas] = useState<any[]>([]);
  const [basePrices, setBasePrices] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Extract query parameters from URL
  const selectedVillaId = searchParams?.get("villa") ? parseInt(searchParams.get("villa")!) : null;
  const checkIn = searchParams?.get("checkIn") || null;
  const checkOut = searchParams?.get("checkOut") || null;
  const guests = searchParams?.get("guests") ? parseInt(searchParams.get("guests")!) : null;
  const nights = searchParams?.get("nights") ? parseInt(searchParams.get("nights")!) : null;

  useEffect(() => {
    async function loadVillas() {
      try {
        const [villasRes, availabilityRes] = await Promise.all([
          fetch("/api/villas"),
          fetch("/api/availability"),
        ]);

        const villasData = await villasRes.json();
        const availability = await availabilityRes.json();

        setVillas(Array.isArray(villasData) ? villasData : []);

        // Compute a base price per villa from availability (most common price per villa)
        const counts: Record<number, Record<number, number>> = {};
        if (Array.isArray(availability)) {
          for (const row of availability) {
            const vId: number | undefined = row.villaId ?? row.villa?.id;
            const price = Number(row.price);
            if (!vId || !Number.isFinite(price)) continue;
            counts[vId] = counts[vId] || {};
            counts[vId][price] = (counts[vId][price] || 0) + 1;
          }
        }

        const baseMap: Record<number, number> = {};
        Object.entries(counts).forEach(([vIdStr, priceCounts]) => {
          let bestPrice = 150;
          let bestCount = 0;
          Object.entries(priceCounts).forEach(([priceStr, count]) => {
            if (count > bestCount) {
              bestCount = count;
              bestPrice = Number(priceStr);
            }
          });
          baseMap[Number(vIdStr)] = bestPrice;
        });

        setBasePrices(baseMap);
      } catch (error) {
        console.error("Failed to load villas:", error);
        setVillas([]);
      } finally {
        setLoading(false);
      }
    }
    loadVillas();
  }, []);

  const handleBookingSubmit = async (bookingData: any) => {
    const res = await fetch("/api/VillaBooking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      toast.success("Booking submitted! We will contact you soon.");
    } else {
      toast.error("Failed to submit booking.");
    }
  };

  if (loading) return <p className="text-center py-20">Loading villas...</p>;

  return (
    <section id="villas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-yellow-800 text-4xl font-bold">Our Luxury Villas</h2>
          <p className="text-xl text-gray-600">
            Choose from our collection of premium villas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {villas.map((villa) => (
            <VillaCard
              key={villa.id}
              villa={villa}
              basePrice={basePrices[villa.id]}
              onBookingSubmit={handleBookingSubmit}
              preselectedDates={
                selectedVillaId === villa.id && checkIn && checkOut
                  ? { checkIn, checkOut, guests: guests || 2, nights: nights || 0 }
                  : undefined
              }
              autoOpenBooking={!!(selectedVillaId === villa.id && checkIn && checkOut)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
