"use client"

import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/studio';
import { getAllBookings, formatDate, formatTime } from '@/utils/bookingUtils';

// Booking Details Modal Component
const BookingDetailsModal: React.FC<{
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Booking Information */}
          <div className="space-y-6">
            {/* Studio Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">{booking.studioName}</h3>
              <p className="text-sm text-blue-700">{booking.studioType}</p>
              <p className="text-sm text-blue-600">
                {booking.studioLocation?.address}, {booking.studioLocation?.area}, {booking.studioLocation?.city}
              </p>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Name:</span> {booking.userName}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {booking.userEmail}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(booking.date)}</p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {formatTime(booking.timeSlot)} - {formatTime(
                    `${parseInt(booking.timeSlot.split(':')[0]) + 1}:${booking.timeSlot.split(':')[1]}`
                  )}
                </p>
                <p className="text-sm"><span className="font-medium">Duration:</span> 1 hour</p>
                <p className="text-sm"><span className="font-medium">Total Price:</span> <span className="text-green-600 font-semibold">৳{booking.totalPrice}</span></p>
              </div>
            </div>

            {/* System Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Booking ID:</span> <span className="font-mono">{booking.id}</span></p>
                <p className="text-sm"><span className="font-medium">Booking Created:</span> {new Date(booking.bookingTime).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      try {
        const allBookings = getAllBookings();
        // Sort by booking date and time (most recent first)
        const sortedBookings = allBookings.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.timeSlot}`);
          const dateB = new Date(`${b.date} ${b.timeSlot}`);
          return dateB.getTime() - dateA.getTime();
        });
        setBookings(sortedBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Filter bookings based on selected filter and search term
  const filteredBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.date} ${booking.timeSlot}`);
    const now = new Date();
    
    // Apply date filter
    let matchesFilter = true;
    if (filter === 'upcoming') {
      matchesFilter = bookingDateTime >= now;
    } else if (filter === 'past') {
      matchesFilter = bookingDateTime < now;
    }

    // Apply search filter
    const matchesSearch = !searchTerm || 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.studioName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getBookingStatus = (booking: Booking): { status: string; color: string } => {
    const bookingDateTime = new Date(`${booking.date} ${booking.timeSlot}`);
    const now = new Date();
    
    if (bookingDateTime < now) {
      return { status: 'Completed', color: 'text-gray-600 bg-gray-100' };
    } else if (bookingDateTime.toDateString() === now.toDateString()) {
      return { status: 'Today', color: 'text-orange-600 bg-orange-100' };
    } else {
      return { status: 'Upcoming', color: 'text-green-600 bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Studio Bookings</h1>
          <p className="text-gray-600">Manage and view all studio bookings</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'upcoming', 'past'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    filter === filterOption
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or studio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                  <p className="text-2xl font-semibold text-blue-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Upcoming</p>
                  <p className="text-2xl font-semibold text-green-900">
                    {bookings.filter(b => new Date(`${b.date} ${b.timeSlot}`) >= new Date()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {bookings.filter(b => new Date(`${b.date} ${b.timeSlot}`) < new Date()).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "No bookings match your search criteria."
                : filter === 'upcoming'
                ? "No upcoming bookings at the moment."
                : filter === 'past'
                ? "No past bookings to display."
                : "No bookings have been made yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const { status, color } = getBookingStatus(booking);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {booking.studioName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            {status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* User Info */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                            <p className="text-sm text-gray-900 font-medium">{booking.userName}</p>
                            <p className="text-sm text-gray-600">{booking.userEmail}</p>
                          </div>

                          {/* Studio Type and Location */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Studio & Location</h4>
                            <p className="text-sm text-gray-900 font-medium">{booking.studioType || 'Recording Studio'}</p>
                            <p className="text-sm text-gray-600">
                              {booking.studioLocation?.city || 'Dhaka'}, {booking.studioLocation?.area || 'N/A'}
                            </p>
                          </div>

                          {/* Date & Time */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h4>
                            <p className="text-sm text-gray-900 font-medium">{formatDate(booking.date)}</p>
                            <p className="text-sm text-gray-600">
                              {formatTime(booking.timeSlot)} - {formatTime(
                                `${parseInt(booking.timeSlot.split(':')[0]) + 1}:${booking.timeSlot.split(':')[1]}`
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Bottom row with price and booking details */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-lg font-semibold text-green-600">৳{booking.totalPrice}</p>
                            <p className="text-xs text-gray-500">Total Amount</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">ID: {booking.id.slice(-8)}</p>
                            <p className="text-xs text-gray-500">
                              Booked: {new Date(booking.bookingTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 ml-4">
                        <button 
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show results count */}
        {filteredBookings.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        )}

        {/* Booking Details Modal */}
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      </div>
    </div>
  );
};

export default BookingsPage;
