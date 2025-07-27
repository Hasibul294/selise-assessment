import { Booking, TimeSlot, Studio } from '@/types/studio';

// Generate available time slots based on studio hours
export const generateTimeSlots = (openTime: string, closeTime: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  // Generate 1-hour slots
  for (let time = openTimeInMinutes; time < closeTimeInMinutes; time += 60) {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    slots.push({
      time: timeString,
      available: true
    });
  }
  
  return slots;
};

// Get all bookings from localStorage
export const getAllBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const bookings = localStorage.getItem('studioBookings');
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return [];
  }
};

// Save booking to localStorage
export const saveBooking = (booking: Booking): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingBookings = getAllBookings();
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem('studioBookings', JSON.stringify(updatedBookings));
    return true;
  } catch (error) {
    console.error('Error saving booking to localStorage:', error);
    return false;
  }
};

// Check if a time slot is available for a specific studio and date
export const isTimeSlotAvailable = (studioId: number, date: string, timeSlot: string): boolean => {
  const bookings = getAllBookings();
  return !bookings.some(
    booking => 
      booking.studioId === studioId && 
      booking.date === date && 
      booking.timeSlot === timeSlot
  );
};

// Get available time slots for a specific studio and date
export const getAvailableTimeSlots = (studio: Studio, date: string): TimeSlot[] => {
  const allSlots = generateTimeSlots(studio.Availability.Open, studio.Availability.Close);
  
  return allSlots.map(slot => ({
    ...slot,
    available: isTimeSlotAvailable(studio.Id, date, slot.time)
  }));
};

// Generate unique booking ID
export const generateBookingId = (): string => {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time for display (12-hour format)
export const formatTime = (timeString: string): string => {
  const [hour, minute] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get minimum date (today)
export const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get maximum date (30 days from now)
export const getMaxDate = (): string => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return maxDate.toISOString().split('T')[0];
};
