import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    roleID: null,
    token: '',
    expire: 0, // Set default expire to 0 to avoid potential errors
  });

  const navigate = useNavigate();
  // const { REACT_APP_AXIOS_URL: url } = process.env;
  const url = process.env.REACT_APP_AXIOS_URL;


  useEffect(() => {
    refreshToken();
  }, []);

  // refresh
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      const decoded = jwtDecode(accessToken);

      setUserInfo({
        firstName: decoded.fName,
        roleID: decoded.roleID,
        token: accessToken,
        expire: decoded.exp,
      });
    } catch (error) {
      if (error.response) {
        navigate('/', { replace: true });
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (userInfo.expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;

      config.headers.Authorization = `Bearer ${accessToken}`;
      setUserInfo((prevState) => ({
        ...prevState,
        token: accessToken,
        expire: jwtDecode(accessToken).exp,
      }));
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const storeUserInSessionStorage = () => {
    sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
  };

  useEffect(() => {
    storeUserInSessionStorage();
  }, [userInfo]); // Update session storage only when userInfo changes

  const dashboardLinks = [
    { title: 'Create Workplan', url: 'create-workplan', icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: 'State Workplan', url: 'state-workplan', icon: <i className="fa-solid fa-rectangle-list"></i> },
    { title: 'Workplan Status', url: 'workplan-status', icon: <i className="fa-solid fa-clock-rotate-left"></i> },
    { title: 'Approve Request', url: 'approve-request', icon: <i className="fa-solid fa-hourglass-half"></i> },
    { title: 'Collate Workplan', url: 'collate-workplan', icon: <i className="fa-solid fa-people-group"></i> },
    { title: 'Assign Vehicle', url: 'assign-vehicle', icon: <i className="fa-solid fa-car-side"></i> },
    { title: 'Upload Report', url: 'upload-report', icon: <i className="fa-solid fa-cloud-arrow-up"></i> },
    { title: 'Report History', url: 'report-history', icon: <i className="fa-solid fa-landmark"></i> },
    { title: 'Visit Summary', url: 'visit-summary', icon: <i className="fa-solid fa-minimize"></i> },
    { title: 'Manage Users', url: 'manage-users', icon: <i className="fa-solid fa-users"></i> },
    { title: 'Account Settings', url: 'settings', icon: <i className="fa-solid fa-gear"></i> },
  ];

  return (
    <div id="dashboard-container">
      <Navbar firstName={userInfo.firstName} />
      <div className="flex flex-col justify-center items-center mb-5">
        <div className='container'>
          <h2 className='text-red-900 text-center mb-3 capitalize align-center'>caritas workplan management system</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {dashboardLinks.map((link, index) => (
              // Conditionally render the "Manage Users" link based on roleID
              userInfo.roleID !== 1 && link.title === "manage users" ? null : (
                <Link key={index} to={`../${link.url}`} className="text-center align-center py-4 px-0 ease-in duration-500 bg-slate-300 shadow rounded no-underline hover:bg-gray-400 hover:text-white">
                  {link.icon && React.cloneElement(link.icon, { style: { color: '#912222', fontSize: 70 } })}
                  <h3 className="text-xl my-2 mx-0 pb-0 font-semibold capitalize text-dark">{link.title}</h3>
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
