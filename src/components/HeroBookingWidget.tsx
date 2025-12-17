"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "./DatePicker";
import { Button } from "./ui/button";
import { Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface Villa {
  id: number;
  name: string;
  guests: number;
}

export function HeroBookingWidget() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVillas() {
      try {
        const res = await fetch("/api/villas");
        const data = await res.json();
        setVillas(data);
        if (data.length > 0) {
          setSelectedVilla(data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching villas:", error);
        setLoading(false);
      }
    }

    fetchVillas();
  }, []);

  const handleDateSelect = (startDate: string, endDate: string) => {
    setCheckIn(startDate);
    setCheckOut(endDate);
  };

  const handleSearch = () => {
    if (!selectedVilla) {
      toast.error("Please select a villa");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const numberOfNights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Redirect to booking or open booking form
    window.location.href = `/villas?villa=${selectedVilla.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${numberOfNights}`;
  };

  const numberOfNights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return <div className="text-white text-center py-3">Loading...</div>;
  }

  return (
    <>
      <div className="w-full bg-white/80 backdrop-blur shadow-xl p-2 md:p-3">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-end">
          {/* Villa Selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Villa
            </label>
            <select
              value={selectedVilla?.id || ""}
              onChange={(e) => {
                const villa = villas.find(v => v.id === parseInt(e.target.value));
                setSelectedVilla(villa || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white"
            >
              {villas.map((villa) => (
                <option key={villa.id} value={villa.id}>
                  {villa.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check-in Date */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              <Calendar className="w-3 h-3 inline mr-1" />
              Check-in
            </label>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white text-left hover:bg-gray-50"
            >
              {checkIn ? new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date"}
            </button>
          </div>

          {/* Number of Nights */}
          {checkIn && checkOut && (
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Duration
              </label>
              <div className="px-3 py-2 border border-gray-300 text-sm bg-gray-50 text-gray-700 font-medium">
                {numberOfNights} night{numberOfNights !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Check-out Date */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Check-out
            </label>
            <div className="px-3 py-2 border border-gray-300 text-sm bg-gray-50 text-gray-700">
              {checkOut ? new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date"}
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              <Users className="w-3 h-3 inline mr-1" />
              Guests
            </label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={selectedVilla?.guests || 10}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!checkIn || !checkOut || !selectedVilla}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded text-sm transition-colors disabled:opacity-50 h-10"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Calendar Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Your Dates</DialogTitle>
            <DialogDescription>
              Click on your check-in date, then click on your check-out date.
            </DialogDescription>
          </DialogHeader>
          {selectedVilla && (
            <DatePicker
              villaId={selectedVilla.id}
              onDateSelect={(startDate, endDate) => {
                setCheckIn(startDate);
                setCheckOut(endDate);
                setIsDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
