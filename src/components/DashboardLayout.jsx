import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReminderNotification from './ReminderNotification';

export const DashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="layout-root">
      <Navbar
        onToggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="layout-body">
        <Sidebar isExpanded={isSidebarExpanded} />
        <main className={`layout-content ${isSidebarExpanded ? 'content-margin-expanded' : 'content-margin-collapsed'}`}>
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>

      {/* Global Live Reminder Alert Listener */}
      <ReminderNotification />
    </div>
  );
};

export default DashboardLayout;
