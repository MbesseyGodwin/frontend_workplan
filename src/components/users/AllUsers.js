import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import jwtDecode from "jwt-decode";
import EditUserModal from './EditUserModal';
import UserDetailsModal from './UserDetailsModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "./users.css"

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // New state variable to store original unfiltered user data
  const [msg, setMsg] = useState('');
  const { REACT_APP_AXIOS_URL: url } = process.env;
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [detailUserModalOpen, setDetailUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for editing

  const accessToken = localStorage.getItem('accessToken'); // Assuming access token is stored in local storage


  useEffect(() => {
    // Fetch user data and store it in both users and originalUsers state variables
    const fetchData = async () => {
      try {
        // const accessToken = localStorage.getItem('accessToken'); // Assuming access token is stored in local storage

        const response = await axios.get('http://0.0.0.0:8000/api/v1/users/?skip=0&limit=100', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUsers(response.data);
        setOriginalUsers(response.data); // Store original unfiltered user data
      } catch (error) {
        console.error('Error fetching user data. Please log out and log in again.:', error);
        setMsg(error.response?.data?.msg || 'Error fetching user data. Please log out and log in again.');
        toast.error("user data not feyched");
      }
    };
    fetchData();
  }, []);



  const getAccessToken = async () => {
    let token = localStorage.getItem('accessToken');
    if (!token || isTokenExpired(token)) {
      token = await refreshToken();
    }
    return token;
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const columns = [

    { Header: 'user id (dev)', accessor: 'id' },
    { Header: 'username', accessor: 'username' },
    // { Header: 'firstName', accessor: 'first_name' },
    // { Header: 'lastName', accessor: 'last_name' },
    { Header: 'email', accessor: 'email' },
    { Header: 'is_active', accessor: 'is_active' },
    // { Header: 'unit_id', accessor: 'unit_id' },
    { Header: 'unit', accessor: 'unit' },
    {
      Header: 'Actions',
      Cell: ({ original }) => (
        <div className='flex justify-evenly'>
          <button className="btn m-0 p-1 py-0 btn-sm btn-dark" onClick={() => handleViewDetails(original)}><i className="fa-regular fa-eye"></i></button>
          <button className="btn m-0 p-1 py-0 btn-sm btn-primary" onClick={() => handleEdit(original)}><i className="fa-solid fa-pencil"></i></button>
          <button className="btn m-0 p-1 py-0 btn-sm btn-danger" onClick={() => handleDelete(original)}><i className="fa-regular fa-trash-can"></i></button>
        </div>
      ),
      sortable: false
    }
  ];
  

  

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUserModalOpen(true);
  };

  const handleEditConfirmation = async (updatedUserData) => {
    try {
      const response = await axios.put(`http://0.0.0.0:8000/api/v1/users/${selectedUser.id}`, updatedUserData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('User updated successfully:', response.data);
      // Optionally, you can handle the response data here if needed
      // Refresh user data after successful edit
      // window.location.reload();
      toast.toast("User data edited");
    } catch (error) {
      console.error('Error editing user:', error);
      // Handle error here, such as displaying an error message to the user
      toast.error("Error editing user data. Please try again.");
    }
    // Close the edit modal and reset selected user
    setEditUserModalOpen(false);
    setSelectedUser(null);
  };
  



  const handleDelete = async (user) => {
    try {
      // Send a DELETE request to your backend API to delete the user
      await axios.delete(`http://0.0.0.0:8000/api/v1/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: '*/*'
        }
      });
      // If successful, remove the deleted user from the UI
      setUsers(users.filter(u => u.id !== user.id));
      console.log('User deleted successfully.');
      toast.success('User deleted successfully.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('User not found:', error.response.data.detail);
        toast.error("User not found");
      } else {
        console.error('Error deleting user:', error);
        toast.error("Error deleting user");
      }
    }
  };
  


const handleViewDetails = async (user) => {
  setSelectedUser(user);
  setDetailUserModalOpen(true);

  try {
    const response = await axios.get(`http://0.0.0.0:8000/api/v1/users/${user.id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Assuming accessToken is stored in a variable
      }
    });
    console.log(response.data); // Output the response data to console
    // Update state or perform further operations with the response data as needed
  } catch (error) {
    console.error('Error fetching user data:', error);
    setMsg(error.response?.data?.msg || 'Error fetching user data. Please try again.');
  }
};





  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();

    // If the search query is empty, revert to displaying the original unfiltered user data
    if (searchQuery === '') {
      setUsers(originalUsers); // Revert to original unfiltered user data
      return;
    }

    // Filter the users based on the search query
    const filteredData = originalUsers.filter(user =>
      user.username.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery)
    );

    // Update the state with the filtered data
    setUsers(filteredData);
  };

  return (
    <div className="col-12 p-0 m-0">
       <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />


      {/* Render search inputs and table only if editUserModalOpen is false */}
      {!editUserModalOpen && !detailUserModalOpen && (
        <form className="flex justify-between mb-3">
          <input type="text" placeholder="Search Users" className="form-control border border-dark shadow-none" onChange={handleSearch} />
        </form>
      )}

      {/* Render EditUserModal if editUserModalOpen is true */}
      {editUserModalOpen && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setEditUserModalOpen(false)} onConfirm={handleEditConfirmation} />
      )}

      {detailUserModalOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setDetailUserModalOpen(false)} />
      )}

      {/* Render message and ReactTable */}


      <div>
        {msg === "" ? <p className='alert alert-danger mt-3 text-center d-none'></p> : <p className='alert alert-danger  font-bold mt-3 text-center'>{msg}</p>}
      </div>
      
      
      {!editUserModalOpen && !detailUserModalOpen && (
        <ReactTable data={users} columns={columns} defaultPageSize={10} className="table-hover text-sm mb-5 -highlight" />
      )}
    </div>

  );

}

export default AllUsers;
