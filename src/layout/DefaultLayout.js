
import React, { useState, useEffect } from 'react';
import Header from '../components/Header/index';

const DefaultLayout = ({ children, pageTitle }) => {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for controlling sidebar visibility
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  // console.log(loggedInUser);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark flex h-screen overflow-hidden">
      {/* Render sidebar component */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} /> */}
      {/* Main content area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Render header component */}
        <Header sidebarOpen={sidebarOpen} loggedInUser={loggedInUser} setSidebarOpen={setSidebarOpen} pageTitle={pageTitle} />
        {/* Render child components */}
        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;