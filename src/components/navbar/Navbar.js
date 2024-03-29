import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import caritaslogo from '../../assets/images/caritas-logo4.png';
    // import useMediaQuery from '@material-ui/core/useMediaQuery'; // Import useMediaQuery from Material-UI
    

const Navbar = ({ firstName }) => {
  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

  // State to track user activity
  const [lastActivity, setLastActivity] = useState(new Date());

  // Logout the user after 20 minutes of inactivity
  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      handleUserLogout();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    return () => clearTimeout(logoutTimer);
  }, [lastActivity]);

  const handleUserLogout = async () => {
    try {
      await axios.delete(`${url}/logout`);
      navigate('/', { replace: true });

      sessionStorage.setItem('loggedInUser', '');
    } catch (error) {
      if (error) console.log(error.response.data);
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


  // const isDesktop = useMediaQuery('(min-width:600px)'); // Check if it's desktop (screen width > 600px)

  return (

        <div className="mb-4">
          <nav className="bg-gray-300 border-slate-900 dark:bg-gray-900">
            <div className="flex flex-wrap justify-between items-center py-3 mx-2">
              {/* Conditionally render the Dashboard button based on screen size */}
                <Link to="#" className="btn btn-dark badge text-sm small btn-sm flex justify-start uppercase">caritas</Link>
              {/* <Link to="#" className="btn btn-danger badge text-sm small btn-sm justify-end uppercase" onClick={handleUserLogout}>Logout {firstName}</Link> */}
              <Link to="#" className="btn btn-danger badge text-sm small btn-sm justify-end uppercase" onClick={handleUserLogout}>Logout</Link>
            </div>
          </nav>
        </div>
        
      );

}

export default Navbar;
