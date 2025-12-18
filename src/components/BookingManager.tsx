"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  DollarSign,
  Ban,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

// Types
type Booking = {
  id: number;
  villaId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  notes?: string | null;
  villa?: { name: string };
};

type BookingDate = {
  date: string;
  price: number;
  available: boolean;
  isBlocked: boolean;
  reason?: string;
};

type VillaAvailability = {
  villaId: number;
  dates: BookingDate[];
};

// Utility
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function BookingManager() {
  const [availability, setAvailability] = useState<VillaAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [villas, setVillas] = useState<any[]>([]);
  const [selectedVilla, setSelectedVilla] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Booking["status"]>("ALL");
  const [dateFilter, setDateFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  const currentVillaAvailability = availability.find(
    (a) => a.villaId === selectedVilla
  );
  
  // Filter bookings based on selected villa, search, status, and date
  const filteredBookings = bookings
    .filter((b) => b.villaId === selectedVilla)
    .filter((b) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          b.guestName.toLowerCase().includes(query) ||
          b.guestEmail.toLowerCase().includes(query) ||
          b.guestPhone.includes(query)
        );
      }
      return true;
    })
    .filter((b) => {
      // Status filter
      if (statusFilter === "ALL") return true;
      return b.status === statusFilter;
    })
    .filter((b) => {
      // Date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(b.checkIn);
      
      if (dateFilter === "UPCOMING") {
        return checkIn >= today;
      } else if (dateFilter === "PAST") {
        return checkIn < today;
      }
      return true;
    });

  const villaBookings = filteredBookings;

  // 🔹 Fetch bookings + availability
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [bookingsRes, availabilityRes, villasRes] = await Promise.all([
          fetch("/api/VillaBooking"),
          fetch("/api/availability"), // you'll need to implement this route
          fetch("/api/villas"),
        ]);

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        if (!availabilityRes.ok) throw new Error("Failed to fetch availability");
        if (!villasRes.ok) throw new Error("Failed to fetch villas");

        const bookingsData = await bookingsRes.json();
        const availabilityData = await availabilityRes.json();
        const villasData = await villasRes.json();

        setBookings(bookingsData);
        setAvailability(availabilityData);
        setVillas(villasData);
        
        // Set first villa as selected if available
        if (villasData.length > 0) {
          setSelectedVilla(villasData[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateBookingStatus = async (
    bookingId: number,
    status: Booking["status"]
  ) => {
    try {
      const res = await fetch(`/api/VillaBooking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      toast.success(`Booking ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating booking");
    }
  };

  // Calendar logic
  const navigateMonth = (direction: 1 | -1) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <Ban className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = currentVillaAvailability?.dates.find(
        (d) => d.date === dateStr
      );
      const booking = villaBookings.find((b) => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        return date >= checkIn && date < checkOut;
      });

      days.push({
        day,
        date: dateStr,
        dateInfo,
        booking,
        isToday: dateStr === new Date().toISOString().split("T")[0],
        isSelected: selectedDates.includes(dateStr),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Booking Management
          </h3>
          <p className="text-gray-600">
            Manage villa bookings, availability, and pricing
          </p>
        </div>

        <Select
          value={selectedVilla.toString()}
          onValueChange={(value) => setSelectedVilla(parseInt(value))}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {villas.map((villa) => (
              <SelectItem key={villa.id} value={villa.id.toString()}>
                {villa.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          {/* calendar rendering kept same as yours */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-medium text-gray-600 bg-gray-50 rounded-lg"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => (
                  <div key={idx} className="min-h-24">
                    {day && (
                      <div
                        className={`p-2 border-2 rounded-lg transition-all ${
                          day.isToday
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        } ${
                          day.dateInfo?.isBlocked
                            ? "bg-red-50 border-red-300"
                            : ""
                        } ${
                          day.booking ? "bg-green-50 border-green-300" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">
                            {day.day}
                          </span>
                        </div>

                        {day.booking ? (
                          <Badge
                            className={`text-xs px-1 py-0 ${getStatusColor(
                              day.booking.status
                            )}`}
                          >
                            {day.booking.status}
                          </Badge>
                        ) : day.dateInfo ? (
                          <span className="text-xs font-medium text-green-600">
                            {formatPrice(day.dateInfo.price)}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          {/* Search and Filter Bar */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div>
                  <Select
                    value={dateFilter}
                    onValueChange={(value) => setDateFilter(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Dates</SelectItem>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="PAST">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL") && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Showing {villaBookings.length} of {bookings.filter(b => b.villaId === selectedVilla).length} bookings
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                      setDateFilter("ALL");
                    }}
                    className="ml-auto text-xs"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bookings List */}
          {villaBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">{booking.guestName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{booking.guestEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{booking.guestPhone}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Check-in</div>
                    <div className="font-medium">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Check-out</div>
                    <div className="font-medium">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Guests</div>
                    <div className="font-medium">{booking.guests} guests</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="font-medium">
                      {formatPrice(booking.totalPrice)}
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Notes</div>
                    <div className="text-sm bg-gray-50 p-2 rounded">
                      {booking.notes}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {booking.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateBookingStatus(booking.id, "CONFIRMED")
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateBookingStatus(booking.id, "CANCELLED")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        updateBookingStatus(booking.id, "CANCELLED")
                      }
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {villaBookings.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL" 
                    ? "No bookings match your filters"
                    : "No bookings yet"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL"
                    ? "Try adjusting your search or filter criteria."
                    : "Bookings for this villa will appear here."}
                </p>
                {(searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                      setDateFilter("ALL");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Pricing Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Pricing bulk update tools go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
