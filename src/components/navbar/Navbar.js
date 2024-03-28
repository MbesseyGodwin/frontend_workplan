import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import caritaslogo from '../../assets/images/caritas-logo4.png';

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

  return (
    <div className="mb-12">
      <nav className="bg-gray-300 border-slate-900 dark:bg-gray-900" >
        <div className="flex flex-wrap justify-between items-center px-1 py-4 mx-5">

          <Link to="#" className="flex items-center space-x-3 rtl:space-x-reverse no-underline">
            <span style={{ color: '#912222' }} className="self-center text-2xl uppercase font-semibold whitespace-nowrap dark:text-white">dashboard</span>
          </Link>

          <div className="flex justify-end items-center space-x-6 rtl:space-x-reverse">
            <Link to="#" className="uppercase no-underline inline-block px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-900 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-gray focus:border-gray-900 active:bg-gray-900" onClick={handleUserLogout}>
              Logout {firstName}
            </Link>
          </div>

        </div>
        <div>
          {/* <img className='caritaslogo-navbar' src={caritaslogo} alt='logo' /> */}
        </div>
      </nav>
    </div>
  );

}

export default Navbar;
