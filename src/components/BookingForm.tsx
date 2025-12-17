"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar, User, Mail, Phone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from './DatePicker';

interface Villa {
  id: number;
  name: string;
  guests: number;
}

interface BookingFormProps {
  villa?: Villa;
  isOpen: boolean;
  onClose: () => void;
  onBookingSubmit?: (booking: any) => void;
}

export function BookingForm({ villa: initialVilla, isOpen, onClose, onBookingSubmit }: BookingFormProps) {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(initialVilla || null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'villa' | 'dates' | 'details' | 'confirmation'>(!initialVilla ? 'villa' : 'dates');
  const [showCalendar, setShowCalendar] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch villas if not provided
  useEffect(() => {
    if (!initialVilla) {
      async function fetchVillas() {
        try {
          const res = await fetch('/api/villas');
          const data = await res.json();
          setVillas(data);
          if (data.length > 0) {
            setSelectedVilla(data[0]);
          }
        } catch (error) {
          console.error('Error fetching villas:', error);
        }
      }
      fetchVillas();
    }
  }, [initialVilla]);

  // Calculate total price based on nights and a base rate
  const calculatePrice = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    // Base rate: $200 per night (you can adjust this or fetch from backend)
    return nights * 200;
  };

  useEffect(() => {
    setTotalPrice(calculatePrice());
  }, [checkIn, checkOut]);

  const handleDateSelect = (startDate: string, endDate: string) => {
    setCheckIn(startDate);
    setCheckOut(endDate);
    setShowCalendar(false);
  };

  const numberOfNights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleVillaSubmit = () => {
    if (!selectedVilla) {
      toast.error("Please select a villa");
      return;
    }
    setStep('dates');
  };

  const handleDateSubmit = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (guests > (selectedVilla?.guests || 10)) {
      toast.error(`Maximum guests for this villa is ${selectedVilla?.guests}`);
      return;
    }

    setStep('details');
  };

  const handleBookingSubmit = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedVilla) {
      toast.error("Please select a villa");
      return;
    }

    const booking = {
      villaId: selectedVilla.id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'PENDING',
      notes: notes || null
    };

    try {
      const response = await fetch('/api/VillaBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        const newBooking = await response.json();
        toast.success("Booking submitted successfully!");
        if (onBookingSubmit) {
          onBookingSubmit(newBooking);
        }
        setStep('confirmation');
      } else {
        toast.error("Failed to submit booking");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  const resetForm = () => {
    setCheckIn('');
    setCheckOut('');
    setGuests(2);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setNotes('');
    setStep(!initialVilla ? 'villa' : 'dates');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl rounded-[1px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-yellow-800" />
            <span className="text-yellow-800">Book Your Stay</span>
          </DialogTitle>
          <DialogDescription>
            {step === 'villa' && 'Select a villa to get started.'}
            {step === 'dates' && 'Select your check-in and check-out dates.'}
            {step === 'details' && 'Please provide your contact information to complete the booking.'}
            {step === 'confirmation' && 'Your booking request has been submitted successfully.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'villa' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Select Villa</label>
              <select
                value={selectedVilla?.id || ''}
                onChange={(e) => {
                  const villa = villas.find(v => v.id === parseInt(e.target.value));
                  setSelectedVilla(villa || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-800"
              >
                <option value="">Choose a villa...</option>
                {villas.map((villa) => (
                  <option key={villa.id} value={villa.id}>
                    {villa.name} (up to {villa.guests} guests)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} className="px-4 py-1 rounded-[2px]">
                Cancel
              </Button>
              <Button
                onClick={handleVillaSubmit}
                disabled={!selectedVilla}
                className="bg-yellow-800 opacity-80 text-white text-md px-6 py-1 rounded-[2px] hover:opacity-100 transition-opacity font-medium shadow-xl disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'dates' && selectedVilla && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Selected Villa: <span className="text-yellow-800">{selectedVilla.name}</span></p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">Select Dates</label>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-xs text-yellow-800 hover:underline"
                >
                  {showCalendar ? 'Hide' : 'Show'} Calendar
                </button>
              </div>

              {!showCalendar && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      {checkIn ? new Date(checkIn).toLocaleDateString() : 'Select date'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      {checkOut ? new Date(checkOut).toLocaleDateString() : 'Select date'}
                    </div>
                  </div>
                </div>
              )}

              {showCalendar && (
                <DatePicker
                  villaId={selectedVilla.id}
                  onDateSelect={handleDateSelect}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Guests</label>
              <Input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={selectedVilla.guests}
              />
              <p className="text-sm text-gray-600 mt-1">Maximum {selectedVilla.guests} guests</p>
            </div>

            {checkIn && checkOut && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Estimated Total:</span>
                      <span className="text-yellow-800">${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep('villa')} className="px-4 py-1 rounded-[2px]">
                Back
              </Button>
              <Button
                onClick={handleDateSubmit}
                disabled={!checkIn || !checkOut}
                className="bg-yellow-800 opacity-80 text-white text-md px-6 py-1 rounded-[2px] hover:opacity-100 transition-opacity font-medium shadow-xl disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="text-sm space-y-1">
                <div>Villa: {selectedVilla?.name}</div>
                <div>Check-in: {new Date(checkIn).toLocaleDateString()}</div>
                <div>Check-out: {new Date(checkOut).toLocaleDateString()}</div>
                <div>Guests: {guests}</div>
                <div className="font-medium">Total: ${totalPrice}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('dates')} className="px-4 py-1 rounded-[2px]">
                Back
              </Button>
              <Button onClick={handleBookingSubmit} className="bg-yellow-800 text-white text-md px-4 py-1 rounded-[2px] hover:bg-yellow-900 transition-colors font-medium shadow-md">
                <CreditCard className="w-4 h-4 mr-2" />
                Submit Booking Request
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Booking Request Submitted!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for your booking request. We'll review it and get back to you within 24 hours.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <div className="text-sm space-y-1">
                  <div>Guest: {guestName}</div>
                  <div>Villa: {selectedVilla?.name}</div>
                  <div>Check-in: {new Date(checkIn).toLocaleDateString()}</div>
                  <div>Check-out: {new Date(checkOut).toLocaleDateString()}</div>
                  <div>Guests: {guests}</div>
                  <div className="font-medium">Total: ${totalPrice}</div>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}