
import React, { useState, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DefaultLayout = ({ children, pageTitle }) => {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for controlling sidebar visibility
  const [token, setToken] = useState(''); // State for storing JWT token
  const [expire, setExpire] = useState(''); // State for storing token expiry
  const [user, setUser] = useState(null); // State for storing user information
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { REACT_APP_AXIOS_URL: url } = process.env; // Base URL for Axios requests

  // Effect hook to refresh token on component mount
  useEffect(() => {
    refreshToken();
  }, []);

  // Function to refresh JWT token
  const refreshToken = async () => {
    try {
      // Request new token from server
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      // Decode token to extract user information
      const decoded = jwtDecode(accessToken);
      // Update state variables
      setToken(accessToken);
      setExpire(decoded.exp);
      setUser(decoded); // Set user information

      // console.log("User information after setting state:", decoded);
      
    } catch (error) {
      if (error.response) {
        console.error('Error refreshing token:', error);
        navigate('/', { replace: true });
      }
    }
  };
  

  // Axios interceptor to refresh token before each request
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    // Check if token has expired
    if (expire * 1000 < currentDate.getTime()) {
      try {
        // Request new token from server
        const response = await axios.get(`${url}/token`);
        const { accessToken } = response.data;
        // Update token and expiry in state
        const decoded = jwtDecode(accessToken);
        setToken(accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        console.error('Error refreshing token:', error);
        navigate('/', { replace: true }); // Redirect to login page if token refresh fails
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  sessionStorage.setItem('loggedInUser', JSON.stringify(user));
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