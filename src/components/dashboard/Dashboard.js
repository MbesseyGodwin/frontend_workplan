import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Link } from 'react-router-dom';



const Dashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      setToken(accessToken);
      const decoded = jwtDecode(accessToken);
      setFirstName(decoded.fName);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/', { replace: true });
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      config.headers.Authorization = `Bearer ${accessToken}`;
      setToken(accessToken);
      const decoded = jwtDecode(accessToken);
      setFirstName(decoded.fName);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const dashboardLinks = [
    { title: "Create Workplan", url: "create-workplan", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "State Workplan", url: "state-workplan", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "Workplan Status", url: "workplan-status", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "Upload Report", url: "upload-report", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "Report History", url: "report-history", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "Visit Summary", url: "visit-summary", icon: <i className="fa-solid fa-folder-plus"></i> },
    { title: "manage users", url: "manage-users", icon: <i className="fa-solid fa-folder-plus"></i>}
  ];

  return (
      <div id="dashboard-container">
      <Navbar firstName={firstName} />

      <div className="flex flex-col justify-center items-center">
        <div className='container'>
          <h1 className='text-red-900 text-center mb-4 capitalize align-center'>workplan management system</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dashboardLinks.map((link, index) => (

            <Link key={index} to={`../${link.url}`} className="text-center align-center p-4 ease-in-out duration-300 bg-slate-300 shadow-md rounded-md no-underline hover:bg-gray-400 hover:text-white">
            {link.icon && React.cloneElement(link.icon, { style: { color: '#912222', fontSize: 70 } })}
            <h3 className="text-xl font-semibold mb-2 capitalize text-dark">{link.title}</h3>
            </Link>


            ))}
          </div>
        </div>
      </div>

    </div>
    
  );
}

export default Dashboard;
