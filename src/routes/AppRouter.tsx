import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Home } from '../pages/event/Home';
import { EventDetail } from '../pages/event/EventDetail';
import { CreateEvent } from '../pages/event/CreateEvent';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Transactions } from '../pages/order/Transactions';
import { Profile } from '../pages/profile/Profile';

export const AppRouter: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (All Logged In Users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Routes (Organizer Only) */}
          <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};
