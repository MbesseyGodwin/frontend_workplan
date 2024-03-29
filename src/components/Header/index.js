// Header.js
import React from 'react';
import { Link } from 'react-router-dom';


import caritaslogo from '../../assets/images/caritas-logo3.png';

const Header = ({ sidebarOpen, setSidebarOpen, pageTitle, loggedInUser }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  // console.log('====================================');
  // console.log(loggedInUser);
  // console.log('====================================');

  //   {
  //     "userID": 20,
  //     "fName": "GODWIN",
  //     "lName": "MBESSEY",
  //     "email": "MAondohemba@ccfng.org",
  //     "roleID": 2,
  //     "iat": 1711281376,
  //     "exp": 1711281391
  // }

  if (!loggedInUser) {
    return null; // Return null if loggedInUser is null
  }


  return (
    <header className="sticky top-0 z-0 flex w-full bg-slate-500 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="container-fluid flex items-center justify-between pt-2 mb-0 pb-0">
  
        {/* Logo and Brand */}
        <div className='text-center flex flex-col items-center pb-0 mb-0'>
          <Link className="text-center text-decoration-none" to="/dashboard" title="Home">
            <img src={caritaslogo} className='w-6 lg:w-10 rounded-full border border-danger m-auto' alt='profile' />
            <p className="text-xs lg:text-lg uppercase text-white">caritas nigeria</p>
          </Link>
        </div>
  
        {/* Page Title */}
        <div className="hidden md:block text-center pb-0 mb-0"> {/* Hide on small screens */}
          <p className="text-lg font-bold text-white m-0 p-0 uppercase">{pageTitle}</p>
        </div>
  
        {/* User Information */}
        <div className='text-center pb-0 mb-0'>
          <Link className="text-center text-white text-decoration-none hover:text-red-900" to="/settings" title="Account">
          <h1 className='text-xs lg:text-lg p-0 m-0'>{`${loggedInUser.fName} ${loggedInUser.lName}`}</h1>
          <p className='text-xs lg:text-lg p-0 m-0'>{`${loggedInUser.email}`}</p>
          </Link>
        </div>
  
      </div>
    </header>
  );

};

export default Header;
