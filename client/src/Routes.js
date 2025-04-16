import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ResultChart from './components/ResultBar';
import Transaction from './components/Transactions';

const AppRoutes = () => {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/:username" element={<Dashboard />} />
        <Route path="/edit-profile/:username" element={<EditProfile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/all-transactions/:username" element={<Transaction />} />
        <Route path="/monthly-visual/:username" element={<ResultChart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

  );
};

export default AppRoutes;