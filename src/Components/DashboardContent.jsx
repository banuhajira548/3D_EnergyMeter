import React from 'react';
import { Routes, Route } from 'react-router-dom';

const DashboardContent = () => {
//   const userRole = localStorage.getItem('userRole');

  return (
    <Routes>
      <Route path={`/dashboard`} element={<div>Machine 1 </div>} />
      <Route path={`/analytics`} element={<div>Machine 2 </div>} />
      <Route path={`/profile`} element={<div>Machine 3 </div>} />
      <Route path={`/settings`} element={<div>Machine 4 </div>} />
    </Routes>
  );
};

export default DashboardContent; 