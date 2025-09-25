import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Activities from './Activities';
import Schedule from './Schedule';
import Contact from './Contact';
import Community from './Community';
import Map from './Map';
import Auth from './Auth';
import Help from './Help';
import DownloadApp from './DownloadApp';
import Website from './Website';
import Radio from './Radio';
import NotFound from './NotFound';
import { AdminComponents } from '@/components/AdminComponents';
import Announcements from './Announcements';

const Index = () => {
  const { user, signOut } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/community" element={<Community />} />
      <Route path="/map" element={<Map />} />
      <Route path="/radio" element={<Radio />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/help" element={<Help />} />
      <Route path="/download" element={<DownloadApp />} />
      <Route path="/website" element={<Website />} />
      <Route path="/admin" element={<AdminComponents />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;