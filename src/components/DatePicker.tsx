"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface DatePickerProps {
  onDateSelect: (checkIn: string, checkOut: string) => void;
  villaId: number;
  minNights?: number;
}

export function DatePicker({
  onDateSelect,
  villaId,
  minNights = 1,
}: DatePickerProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch unavailable dates
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/availability/${villaId}`);
        const data = await res.json();
        setUnavailableDates(data.unavailableDates || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [villaId]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateUnavailable = (dateStr: string) => {
    return unavailableDates.includes(dateStr);
  };

  const isDateInRange = (dateStr: string) => {
    if (!checkIn || !checkOut) return false;
    const date = new Date(dateStr);
    const ciDate = new Date(checkIn);
    const coDate = new Date(checkOut);
    return date >= ciDate && date < coDate;
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    if (isDateUnavailable(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Select check-in
      setCheckIn(dateStr);
      setCheckOut("");
    } else if (new Date(dateStr) <= new Date(checkIn)) {
      // If clicking before check-in, set as new check-in
      setCheckIn(dateStr);
      setCheckOut("");
    } else {
      // Select check-out
      setCheckOut(dateStr);
      onDateSelect(checkIn, dateStr);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 bg-gray-50"></div>
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${month}-${dayStr}`;
      const isUnavailable = isDateUnavailable(dateStr);
      const isInRange = isDateInRange(dateStr);
      const isCheckIn = dateStr === checkIn;
      const isCheckOut = dateStr === checkOut;
      const isToday = dateStr === new Date().toISOString().split("T")[0];
      const isPast = new Date(dateStr) < new Date();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isUnavailable || isPast}
          className={`h-10 text-sm flex items-center justify-center rounded transition-colors ${
            isCheckIn
              ? "bg-yellow-800 text-white font-bold"
              : isCheckOut
                ? "bg-yellow-600 text-white font-bold"
                : isInRange
                  ? "bg-yellow-200 text-gray-900"
                  : isUnavailable
                    ? "bg-red-100 text-red-400 cursor-not-allowed"
                    : isPast
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isToday
                        ? "border-2 border-yellow-800 text-gray-900"
                        : "hover:bg-yellow-50 text-gray-900"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading availability...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-center flex-1">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      {/* Legend */}
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-800 rounded"></div>
          <span>Check-in/Check-out</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>Selected dates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded border border-red-400"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {checkIn && checkOut && (
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <p className="font-medium">Selected dates:</p>
          <p className="text-gray-700">
            {new Date(checkIn).toLocaleDateString()} to{" "}
            {new Date(checkOut).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
