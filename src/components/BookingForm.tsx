import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar, User, Mail, Phone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Villa } from '../../prisma/data/villas';
import { 
  BookingDate, 
  Booking, 
  VillaAvailability, 
  initialAvailability,
  formatPrice,
  calculateTotalPrice,
  isDateRangeAvailable
} from '../../prisma/data/bookings';

interface BookingFormProps {
  villa: Villa;
  isOpen: boolean;
  onClose: () => void;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

export function BookingForm({ villa, isOpen, onClose, onBookingSubmit }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'dates' | 'details' | 'confirmation'>('dates');

  const villaAvailability = initialAvailability.find(a => a.villaId === villa.id);
  const totalPrice = villaAvailability && checkIn && checkOut 
    ? calculateTotalPrice(villaAvailability.dates, checkIn, checkOut)
    : 0;

  const isRangeAvailable = villaAvailability && checkIn && checkOut
    ? isDateRangeAvailable(villaAvailability.dates, checkIn, checkOut)
    : false;

  const numberOfNights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleDateSubmit = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (!isRangeAvailable) {
      toast.error("Selected dates are not available");
      return;
    }

    if (guests > villa.guests) {
      toast.error(`Maximum guests for this villa is ${villa.guests}`);
      return;
    }

    setStep('details');
  };

  const handleBookingSubmit = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const booking = {
      villaId: villa.id,
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
      // Call your API route here
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
        onBookingSubmit(newBooking); // Pass to parent component
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
    setStep('dates');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Generate available dates for next 3 months
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-yellow-800" />
            <span className="text-yellow-800">Book {villa.name}</span>
          </DialogTitle>
          <DialogDescription>
            {step === 'dates' && 'Select your check-in and check-out dates to book this villa.'}
            {step === 'details' && 'Please provide your contact information to complete the booking.'}
            {step === 'confirmation' && 'Your booking request has been submitted successfully.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'dates' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date</label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date</label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || getMinDate()}
                  max={getMaxDate()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Guests</label>
              <Input
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 2)}
                min="1"
                max={villa.guests}
              />
              <p className="text-sm text-gray-600 mt-1">Maximum {villa.guests} guests</p>
            </div>

            {checkIn && checkOut && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className={isRangeAvailable ? 'text-green-600' : 'text-red-600'}>
                        {isRangeAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    {isRangeAvailable && (
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Price:</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDateSubmit} disabled={!isRangeAvailable} className="bg-yellow-800 text-white text-md px-6 py-3 rounded-lg hover:bg-yellow-900 transition-colors font-medium shadow-md font-serifDisplay">
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
                <div>Villa: {villa.name}</div>
                <div>Check-in: {new Date(checkIn).toLocaleDateString()}</div>
                <div>Check-out: {new Date(checkOut).toLocaleDateString()}</div>
                <div>Guests: {guests}</div>
                <div className="font-medium">Total: {formatPrice(totalPrice)}</div>
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
              <Button variant="outline" onClick={() => setStep('dates')}>
                Back
              </Button>
              <Button onClick={handleBookingSubmit} className="bg-yellow-800 text-white text-md px-6 py-3 rounded-lg hover:bg-yellow-900 transition-colors font-medium shadow-md font-serifDisplay">
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
                  <div>Villa: {villa.name}</div>
                  <div>Check-in: {new Date(checkIn).toLocaleDateString()}</div>
                  <div>Check-out: {new Date(checkOut).toLocaleDateString()}</div>
                  <div>Guests: {guests}</div>
                  <div className="font-medium">Total: {formatPrice(totalPrice)}</div>
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