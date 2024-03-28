import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

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
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
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
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setFirstName(decoded.fName);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getUsers = async () => {
    const response = await axiosJWT.get(`${url}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
  };

  return (
    <div id="dashboard-container">
  <h2>Welcome back, {firstName}</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Grid layout with 1 column on small screens and 3 columns on medium screens and larger */}
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-2">Create Workplan</h3>
      {/* Add any additional content for this card */}
    </div>

    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-2">Settings</h3>
      {/* Add any additional content for this card */}
    </div>

    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-2">View Workplan</h3>
      {/* Add any additional content for this card */}
    </div>
  </div>

  <table id="dashboard-table">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr key={user.userID}>
          <td>{index + 1}</td>
          <td>{user.fName}</td>
          <td>{user.lName}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}

export default Dashboard;


import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ firstName }) => {
  const navigate = useNavigate();

  const { REACT_APP_AXIOS_URL: url } = process.env;

  const handleUserLogout = async () => {
    try {
      await axios.delete(`${url}/logout`);
      navigate('/', { replace: true });
    } catch (error) {
      if (error) console.log(error.response.data);
    }
  };

  return (
    <div className="bg-gray-800 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <h3 className="text-white text-xl font-bold capitalize">dashboard</h3>

        <h3 className='text-white text-xl font-bold capitalize'>welcome back, {firstName}</h3>
        {/* Navigation Links */}
        <nav>
          <button className="text-lg cursor-pointer btn btn-danger btn-outline-light" onClick={handleUserLogout}>Log Out</button>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;





import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-96 rounded-lg p-6">
        <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <p><strong>User ID:</strong> {user.user_id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Unit ID:</strong> {user.unit_id}</p>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
};

export default UserDetailsModal;
