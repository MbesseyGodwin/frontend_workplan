import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../navbar/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const hasAllowedRole = (allowedRoles) => {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (userData && userData.roles) {
      return userData.roles.some(role => allowedRoles.includes(role.name));
    }
    return false;
  };

  const dashboardLinks = [
    { title: "Create Workplan", url: "create-workplan", icon: <i className="fa-solid fa-folder-plus"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "State Workplan", url: "state-workplan", icon: <i className="fa-solid fa-rectangle-list"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "Workplan Status", url: "workplan-status", icon: <i className="fa-solid fa-clock-rotate-left"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "approve request", url: "approve-request", icon: <i className="fa-solid fa-hourglass-half"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "collate workplan", url: "collate-workplan", icon: <i className="fa-solid fa-people-group"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member", "collate"] },
    { title: "Assign Vehicle", url: "assign-vehicle", icon: <i className="fa-solid fa-car-side"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "Upload Report", url: "upload-report", icon: <i className="fa-solid fa-cloud-arrow-up"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "Report History", url: "report-history", icon: <i className="fa-solid fa-landmark"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "Visit Summary", url: "visit-summary", icon: <i className="fa-solid fa-minimize"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] },
    { title: "manage users", url: "manage-users", icon: <i className="fa-solid fa-users"></i>, allowedRoles: ["super_admin", "tenant_admin", "programs_lead", "technical_lead", "unit_member"] }, // Only programs_lead can see this
    { title: "manage users", url: "manage-users", icon: <i className="fa-solid fa-users"></i>, allowedRoles: [] },
    { title: "Account settings", url: "settings", icon: <i className="fa-solid fa-gear"></i>, allowedRoles: [] },
  ];

  // ["super_admin","tenant_admin","stl","technical_lead", "programs_lead","program_team", "admin_team", "admin_lead","unit_lead","unit_member","hq_staff"]

  return (
    <div id="dashboard-container">
      <Navbar />

      <div className="flex flex-col justify-center items-center mt-sm-0 mt-lg-4 mb-20">
        <div className='container mt-sm-0 mt-lg-4'>
          <div className='text-center'>
            <h2 className='text-red-900 m-0 text-center text-sm lg:text-2xl capitalize align-center'>caritas workplan management system</h2>
            <p className='capitalize'>for development mode. These are dashboard - modules. access to modules is based on user role</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {dashboardLinks.map((link, index) => (
              // Conditionally render the link based on user role
              hasAllowedRole(link.allowedRoles) ? (
                <Link key={index} to={`../${link.url}`} className="text-center text-white align-center py-4 px-0 ease-in duration-300 bg-slate-500 shadow rounded-lg no-underline hover:bg-gray-400 hover:text-black">
                  {link.icon && React.cloneElement(link.icon, { style: { color: '#912222', fontSize: 50 } })}
                  <h3 className="text-xs lg:text-xl my-2 mx-0 capitalize">{link.title}</h3>
                </Link>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
