"use client"

import React, { useState, useEffect } from 'react';
import { Studio, BookingFormData, Booking, TimeSlot } from '@/types/studio';
import {
  getAvailableTimeSlots,
  saveBooking,
  generateBookingId,
  formatDate,
  formatTime,
  isValidEmail,
  getMinDate,
  getMaxDate
} from '@/utils/bookingUtils';

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ studio, isOpen, onClose }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    timeSlot: '',
    userName: '',
    userEmail: ''
  });

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: '',
        timeSlot: '',
        userName: '',
        userEmail: ''
      });
      setErrors({});
      setShowConfirmation(false);
      setBookingDetails(null);
    }
  }, [isOpen]);

  // Update available slots when date changes
  useEffect(() => {
    if (formData.date) {
      const slots = getAvailableTimeSlots(studio, formData.date);
      setAvailableSlots(slots);
      
      // Reset time slot if currently selected slot is not available
      if (formData.timeSlot) {
        // Check if time is within studio operating hours
        const [selectedHour, selectedMinute] = formData.timeSlot.split(':').map(Number);
        const [openHour, openMinute] = studio.Availability.Open.split(':').map(Number);
        const [closeHour, closeMinute] = studio.Availability.Close.split(':').map(Number);
        
        const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;
        
        if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
          setFormData(prev => ({ ...prev, timeSlot: '' }));
          setErrors(prev => ({ 
            ...prev, 
            timeSlot: 'The selected time is outside studio operating hours'
          }));
        } else {
          // Check if this specific time slot is already booked
          const isTimeBooked = slots.some(slot => slot.time === formData.timeSlot && !slot.available);
          
          if (isTimeBooked) {
            setFormData(prev => ({ ...prev, timeSlot: '' }));
            setErrors(prev => ({ 
              ...prev, 
              timeSlot: 'The selected time slot is not available. Please choose another time'
            }));
          }
        }
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date, studio]);

  // Refresh availability every 30 seconds if modal is open and date is selected
  useEffect(() => {
    if (!isOpen || !formData.date) return;

    const refreshInterval = setInterval(() => {
      const slots = getAvailableTimeSlots(studio, formData.date);
      setAvailableSlots(slots);
      
      // Check if selected slot is still available
      if (formData.timeSlot) {
        // Check if time is within studio operating hours
        const [selectedHour, selectedMinute] = formData.timeSlot.split(':').map(Number);
        const [openHour, openMinute] = studio.Availability.Open.split(':').map(Number);
        const [closeHour, closeMinute] = studio.Availability.Close.split(':').map(Number);
        
        const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;
        
        if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
          setFormData(prev => ({ ...prev, timeSlot: '' }));
          setErrors(prev => ({ 
            ...prev, 
            timeSlot: 'The selected time is outside studio operating hours'
          }));
        } else {
          // Check if this specific time slot is already booked
          const isTimeBooked = slots.some(slot => slot.time === formData.timeSlot && !slot.available);
          
          if (isTimeBooked) {
            setFormData(prev => ({ ...prev, timeSlot: '' }));
            setErrors(prev => ({ 
              ...prev, 
              timeSlot: 'The selected time slot is not available. Please choose another time'
            }));
          }
        }
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isOpen, formData.date, formData.timeSlot, studio]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    } else {
      // Check if time is within studio operating hours
      const [selectedHour, selectedMinute] = formData.timeSlot.split(':').map(Number);
      const [openHour, openMinute] = studio.Availability.Open.split(':').map(Number);
      const [closeHour, closeMinute] = studio.Availability.Close.split(':').map(Number);
      
      const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
      const openTimeInMinutes = openHour * 60 + openMinute;
      const closeTimeInMinutes = closeHour * 60 + closeMinute;
      
      if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
        newErrors.timeSlot = 'The selected time is outside studio operating hours';
      } else {
        // Check if this specific time slot is already booked
        const slots = getAvailableTimeSlots(studio, formData.date);
        const isTimeBooked = slots.some(slot => slot.time === formData.timeSlot && !slot.available);
        
        if (isTimeBooked) {
          newErrors.timeSlot = 'The selected time slot is not available. Please choose another time';
        }
      }
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Please enter your name';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'Name must be at least 2 characters long';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Please enter your email';
    } else if (!isValidEmail(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Check availability one more time before booking
    const [selectedHour, selectedMinute] = formData.timeSlot.split(':').map(Number);
    const [openHour, openMinute] = studio.Availability.Open.split(':').map(Number);
    const [closeHour, closeMinute] = studio.Availability.Close.split(':').map(Number);
    
    const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;
    
    if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
      setErrors({ timeSlot: 'The selected time is outside studio operating hours' });
      setIsLoading(false);
      return;
    }
    
    // Check if this specific time slot is already booked
    const slots = getAvailableTimeSlots(studio, formData.date);
    const isTimeBooked = slots.some(slot => slot.time === formData.timeSlot && !slot.available);
    
    if (isTimeBooked) {
      setErrors({ timeSlot: 'The selected time slot is not available. Please choose another time' });
      setIsLoading(false);
      return;
    }

    // Create booking
    const booking: Booking = {
      id: generateBookingId(),
      studioId: studio.Id,
      studioName: studio.Name,
      studioType: studio.Type,
      studioLocation: {
        city: studio.Location.City,
        area: studio.Location.Area,
        address: studio.Location.Address,
      },
      date: formData.date,
      timeSlot: formData.timeSlot,
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      bookingTime: new Date().toISOString(),
      totalPrice: studio.PricePerHour
    };

    // Save to localStorage
    const success = saveBooking(booking);
    
    if (success) {
      setBookingDetails(booking);
      setShowConfirmation(true);
    } else {
      setErrors({ submit: 'Failed to save booking. Please try again.' });
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  // Confirmation screen
  if (showConfirmation && bookingDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Booking Confirmed!</h3>
              <p className="text-sm text-gray-500 mt-1">Your studio has been successfully booked.</p>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-medium">{bookingDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Studio:</span>
                  <span className="font-medium">{bookingDetails.studioName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(bookingDetails.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">
                    {formatTime(bookingDetails.timeSlot)} - {formatTime(
                      `${parseInt(bookingDetails.timeSlot.split(':')[0]) + 1}:${bookingDetails.timeSlot.split(':')[1]}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Price:</span>
                  <span className="font-medium text-green-600">৳{bookingDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-medium">{bookingDetails.userName}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirmationClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main booking form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Book Studio</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label="Close booking modal"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Studio Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900">{studio.Name}</h3>
            <p className="text-sm text-gray-500">{studio.Location.Area}, {studio.Location.City}</p>
            <p className="text-sm text-green-600 font-medium">৳{studio.PricePerHour}/hour</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Operating Hours: {formatTime(studio.Availability.Open)} - {formatTime(studio.Availability.Close)}
              {formData.date && (
                <span className="ml-2 text-blue-600">
                  • {availableSlots.filter(slot => slot.available).length} slots available on {formatDate(formData.date)}
                </span>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                aria-label="Select booking date"
                title="Select booking date"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time Slot *
              </label>
              <input
                type="time"
                value={formData.timeSlot}
                onChange={(e) => {
                  const selectedTime = e.target.value;
                  setFormData(prev => ({ ...prev, timeSlot: selectedTime }));
                  
                  // Clear previous errors
                  setErrors(prev => ({ ...prev, timeSlot: '' }));
                  
                  // Check availability if date is selected
                  if (formData.date && selectedTime) {
                    // Check if time is within studio operating hours
                    const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
                    const [openHour, openMinute] = studio.Availability.Open.split(':').map(Number);
                    const [closeHour, closeMinute] = studio.Availability.Close.split(':').map(Number);
                    
                    const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
                    const openTimeInMinutes = openHour * 60 + openMinute;
                    const closeTimeInMinutes = closeHour * 60 + closeMinute;
                    
                    if (selectedTimeInMinutes < openTimeInMinutes || selectedTimeInMinutes >= closeTimeInMinutes) {
                      setErrors(prev => ({ 
                        ...prev, 
                        timeSlot: 'The selected time is outside studio operating hours'
                      }));
                    } else {
                      // Check if this specific time slot is already booked
                      const slots = getAvailableTimeSlots(studio, formData.date);
                      const isTimeBooked = slots.some(slot => slot.time === selectedTime && !slot.available);
                      
                      if (isTimeBooked) {
                        setErrors(prev => ({ 
                          ...prev, 
                          timeSlot: 'The selected time slot is not available. Please choose another time'
                        }));
                      }
                    }
                  }
                }}
                min={studio.Availability.Open}
                max={studio.Availability.Close}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading || !formData.date}
                placeholder="Select time"
                aria-label="Select time slot"
                title="Select your preferred time slot"
              />
              {!formData.date && (
                <p className="text-sm text-gray-500 mt-1">Please select a date first</p>
              )}
              {errors.timeSlot && (
                <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>
              )}
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="Enter your full name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.userName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="Enter your email address"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.userEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.userEmail && <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
