import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import caritaslogo from '../../assets/images/caritas-logo4.png';
// import useMediaQuery from '@material-ui/core/useMediaQuery'; // Import useMediaQuery from Material-UI

import Moment from 'react-moment';

const Navbar = () => {
  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

  // State to track user activity
  const [lastActivity, setLastActivity] = useState(new Date());

  // Logout the user after 20 minutes of inactivity
  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      handleUserLogout();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearTimeout(logoutTimer);
  }, [lastActivity]);

  const handleUserLogout = async () => {
    try {
      // Clear access token and refresh token from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('loggedInUser');
      
      // Redirect to login page
      window.location.href = './'; // Assign the new URL as a string
    } catch (error) {
      console.error('Error occurred during logout:', error);
      // Handle any logout error, such as displaying an error message to the user
    }
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

  function getWeekAndQuarter(date) {
    // Get the current date if not provided
    if (!date) {
      date = new Date();
    }

    // Define the start month of the year for your NGO (October)
    const startMonthOfYear = 9; // 0-indexed (January is 0)

    // Calculate the year and month of the date
    const year = date.getFullYear();
    const month = date.getMonth();

    // Calculate the week of the year
    const startOfYear = new Date(year, startMonthOfYear, 1);
    const diff = date - startOfYear;
    const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7;
    let week = Math.floor(diff / oneWeekInMilliseconds) + 1;

    // If the calculated week is negative, adjust it to be within the range of 1 to 52
    if (week < 1) {
      week += 52;
    }

    // Calculate the quarter of the year
    let quarter;
    if (month >= startMonthOfYear) {
      // Quarter starts from October
      quarter = Math.floor((month - startMonthOfYear) / 3) + 1;
    } else {
      // Quarter starts from the previous year's October
      quarter = Math.floor((month + 12 - startMonthOfYear) / 3) + 1;
    }

    return { week, quarter };
  }

  // Example usage:
  const today = new Date(); // You can pass any date or omit to use the current date
  const { week, quarter } = getWeekAndQuarter(today);


  // const isDesktop = useMediaQuery('(min-width:600px)'); // Check if it's desktop (screen width > 600px)

  // decodedToken)

  localStorage.setItem('weekAndQuarter', JSON.stringify({"week": week, "quarter": quarter, "today": today}));
  

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  return (
    <div className="mb-4">
      <nav className="bg-slate-500 border-slate-900 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center py-2 mx-2">
          {/* Conditionally render the Dashboard button based on screen size */}
          <Link to="#" className="badge text-decoration-none m-0 ">
            <p className='m-0 capitalize'><span>{loggedInUser?.first_name ?? ""}</span> <span>{loggedInUser?.last_name ?? ""}</span></p>
            <p className='m-0'>{loggedInUser?.email ?? ""}</p>
          </Link>
          {/* <Link to="#" className="btn btn-danger badge text-sm small btn-sm justify-end uppercase" onClick={handleUserLogout}>Logout {firstName}</Link> */}
          <Link to="#" className="btn btn-danger badge text-sm small btn-sm justify-end uppercase" onClick={handleUserLogout}>
            <p className='p-0 m-0'>logout</p>
          </Link>
        </div>
      </nav>
    </div>
  );
  

}

export default Navbar;
