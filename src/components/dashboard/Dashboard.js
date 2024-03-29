import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../navbar/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  const dashboardLinks = [
    { title: "Create Workplan", url: "create-workplan", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "State Workplan", url: "state-workplan", icon: <i className="fa-solid fa-rectangle-list"></i> },
    { title: "Workplan Status", url: "workplan-status", icon: <i className="fa-solid fa-clock-rotate-left"></i> },
    { title: "approve request", url: "approve-request", icon: <i className="fa-solid fa-hourglass-half"></i> },
    { title: "collate workplan", url: "collate-workplan", icon: <i className="fa-solid fa-people-group"></i> },
    { title: "Assign Vehicle", url: "assign-vehicle", icon: <i className="fa-solid fa-car-side"></i> },
    { title: "Upload Report", url: "upload-report", icon: <i className="fa-solid fa-cloud-arrow-up"></i>},
    { title: "Report History", url: "report-history", icon: <i className="fa-solid fa-landmark"></i> },
    { title: "Visit Summary", url: "visit-summary", icon: <i className="fa-solid fa-minimize"></i> },
    { title: "manage users", url: "manage-users", icon: <i className="fa-solid fa-users"></i> },
    { title: "Account settings", url: "settings", icon: <i className="fa-solid fa-gear"></i> },
  ];

return (
  <div id="dashboard-container">
    <Navbar firstName={loggedInUser.fName} />

    <div className="flex flex-col justify-center items-center mb-20">
      <div className='container'>
        <h2 className='text-red-900 text-center text-lg lg:text-3xl mb-3 capitalize align-center'>workplan management system</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {dashboardLinks.map((link, index) => (
            // Conditionally render the "Manage Users" link based on roleID
            loggedInUser.roleID !== 1 && link.title === "manage users" ? null : (
              <Link key={index} to={`../${link.url}`} className="text-center align-center py-4 px-0 ease-in duration-500 bg-slate-300 shadow rounded-lg no-underline hover:bg-gray-400 hover:text-white">
                {link.icon && React.cloneElement(link.icon, { style: { color: '#912222', fontSize: 45 } })}
                <h3 className="text-xs lg:text-xl my-2 mx-0 pb-0 font-semibold capitalize text-dark">{link.title}</h3>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  </div>
);


}

export default Dashboard;