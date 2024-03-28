import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import caritaslogo from '../../assets/images/caritas-logo3.png';
import axios from 'axios';


import jwtDecode from "jwt-decode";


const Sidebar = ({ sidebarOpen, setSidebarOpen, user = {} }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

  // State to track user activity
  const [lastActivity, setLastActivity] = useState(new Date());

  // Logout the user after 30 minutes of inactivity
  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      confirmLogout();
      // handleUserLogout();
      
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    return () => clearTimeout(logoutTimer);
  }, [lastActivity]);




  const [showLogoutBtn, setShowLogoutBtn] = useState("");

  const [roleID, setRoleID] = useState();
  const [token, setToken] = useState('');

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;

      setToken(accessToken);

      const decoded = jwtDecode(accessToken);
      setRoleID(decoded.roleID)

      // console.log(decoded);

    } catch (error) {
      if (error.response) {
        navigate('/', { replace: true });
      }
    }
  };




  // Logout user and navigate to login page
  const handleUserLogout = async () => {


    setShowModal(true);
    setShowLogoutBtn('d-none');

  };

  const [showModal, setShowModal] = useState(false);


  const confirmLogout = async () => {
    // Perform logout action here
    // For example, call the logout function from props
    // After logout, you can redirect the user or perform any other necessary actions

    try {
      await axios.delete(`${url}/logout`);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
    setShowLogoutBtn('');
  };

  // Update last activity time on user interaction
  const handleActivity = () => {
    setLastActivity(new Date());
  };

  // Add event listeners to detect user activity
  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };



  // Define the array of links
  const links = [


    { path: '/manage-users', text: 'Manage User' },
    { path: '/create-workplan', text: 'Create Workplan' },
    { path: '/state-workplan', text: 'State Workplan' },
    { path: '/workplan-status', text: 'Workplan Status' },
    { path: '/upload-report', text: 'Upload Report' },
    { path: '/report-history', text: 'Report History' },
    { path: '/visit-summary', text: 'Visit Summary' },
    { path: '/settings', text: 'Account Settings' }
  ];

  return (
    <aside className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-slate-400 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 z-10' : '-translate-x-full z-10'}`}>
      <div className="d-flex items-center justify-between justify-content-lg-center">
        <NavLink to="/dashboard" className="no-underline text-red-900 p-2">
          <h2>caritas</h2>
        </NavLink>
        <button onClick={toggleSidebar} className="btn btn-sm btn-danger mx-2 lg:hidden d-lg-none">x</button>
      </div>

      {/* User information */}
      {user ? (
        <div className='text-center py-2 lg:m-4 bg-slate-300 rounded'>
          <img src={caritaslogo} className='w-25 rounded-full mx-auto' alt='profile' />
          <h4 className="text-xl font-semibold mt-2">{`${user.fName} ${user.lName}`}</h4>
          <h6 className="text-sm text-gray-500">{user.email}</h6>
        </div>
      ) : (
        <div className='d-none text-center py-2 lg:m-4 bg-slate-300'>
          <p>User not logged in</p>
        </div>
      )}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-5 py-3 px-0 lg:mt-3 lg:px-6">
          <ul className="space-y-2 space-x-0 px-5 text-center">
            {links.map((link, index) => (

              roleID !== 1 && link.path === "/manage-users" ? null : (
                <li key={index}>
                  <NavLink to={link.path} className={`block py-2 px-3 hover:bg-gray-400 rounded no-underline ${location.pathname === link.path ? 'bg-red-900 hover:bg-red-900 text-white' : ''}`}>
                    {link.text}
                  </NavLink>
                </li>
              )

            ))}
          </ul>
        </nav>
      </div>

      {/* Logout button */}
      <div className={`d-flex my-3 items-center justify-between justify-content-lg-center ${showLogoutBtn}`}>
        <button className="no-underline inline-block px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-900 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-gray focus:border-gray-900 active:bg-gray-900" onClick={handleUserLogout}>
          Logout
        </button>
      </div>

      {/* Modal dialog for logout confirmation */}
      {showModal && (
        <div className="inset-0 m-3">

          <div className="bg-slate-300 rounded-md text-center fixed-bottom m-3">
            <p className='fw-bold'>want to logout?</p>

            <div className="my-2 flex justify-around py-2">
              <button className="btn btn-sm btn-danger" onClick={confirmLogout}>
                Logout
              </button>
              <button className="btn btn-sm btn-dark" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}






    </aside>
  );
};

export default Sidebar;
