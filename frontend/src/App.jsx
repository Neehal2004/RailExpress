import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import PaymentModal from './components/PaymentModal';
import TicketView from './components/TicketView';

import Home from './pages/Home';
import TrainSearch from './pages/TrainSearch';
import MyBookings from './pages/MyBookings';
import PnrStatus from './pages/PnrStatus';
import AdminDashboard from './pages/AdminDashboard';

function MainApp() {
  const { user } = useContext(AuthContext);
  const [activePage, setActivePage] = useState('home');
  const [notification, setNotification] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  // Modals
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [bookingModalData, setBookingModalData] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [ticketModalData, setTicketModalData] = useState(null);

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const showNotification = (notif) => {
    setNotification(notif);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSearchTrigger = (params) => {
    setSearchParams(params);
    setActivePage('search');
  };

  const handleSelectBookingClass = (train, selectedClass, travelDate) => {
    if (!user) {
      showNotification({ type: 'info', message: 'Please log in or register to book train tickets.' });
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setBookingModalData({ train, selectedClass, travelDate: travelDate || new Date().toISOString().split('T')[0] });
  };

  const handleProceedToPayment = (bookingPayload) => {
    setBookingModalData(null);
    setPaymentModalData(bookingPayload);
  };

  const handleConfirmPayment = async (paymentMethod) => {
    if (!user || !user.token) return;
    setPaymentProcessing(true);

    try {
      const payload = {
        trainId: paymentModalData.trainId,
        travelDate: paymentModalData.travelDate,
        classType: paymentModalData.classType,
        passengers: paymentModalData.passengers,
        paymentMethod
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking payment failed');
      }

      setPaymentModalData(null);
      showNotification({
        type: 'success',
        message: `Ticket Booked! PNR: ${data.booking.pnr}`
      });

      // Display the printable ticket immediately
      setTicketModalData({ booking: data.booking, payment: data.payment });
    } catch (err) {
      showNotification({ type: 'error', message: err.message });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Notification notification={notification} onClose={() => setNotification(null)} />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        openAuthModal={(mode) => setAuthModal({ open: true, mode })}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home
            onSearch={handleSearchTrigger}
            onSelectBookingClass={handleSelectBookingClass}
          />
        )}

        {activePage === 'search' && (
          <TrainSearch
            initialSearch={searchParams}
            onSelectBookingClass={handleSelectBookingClass}
          />
        )}

        {activePage === 'my-bookings' && (
          <MyBookings onNotification={showNotification} />
        )}

        {activePage === 'pnr' && <PnrStatus />}

        {activePage === 'admin' && (
          <AdminDashboard onNotification={showNotification} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'rgba(7, 13, 29, 0.95)',
          borderTop: '1px solid var(--border-color)',
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginTop: '40px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>RailExpress SRS Implementation</strong> • Railway Ticket Booking System (MERN Stack)
          </div>
          <div>
            Built with React, Express.js & MongoDB Localhost
          </div>
        </div>
      </footer>

      {/* Modals */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onSuccessNotification={showNotification}
        />
      )}

      {bookingModalData && (
        <BookingModal
          train={bookingModalData.train}
          selectedClass={bookingModalData.selectedClass}
          travelDate={bookingModalData.travelDate}
          onClose={() => setBookingModalData(null)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {paymentModalData && (
        <PaymentModal
          bookingData={paymentModalData}
          onClose={() => setPaymentModalData(null)}
          onConfirmPayment={handleConfirmPayment}
          processing={paymentProcessing}
        />
      )}

      {ticketModalData && (
        <TicketView
          booking={ticketModalData.booking}
          payment={ticketModalData.payment}
          onClose={() => setTicketModalData(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
