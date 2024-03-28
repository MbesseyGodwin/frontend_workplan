import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import jwtDecode from "jwt-decode";
import EditUserModal from './EditUserModal';
import UserDetailsModal from './UserDetailsModal';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // New state variable to store original unfiltered user data
  const [msg, setMsg] = useState('');
  const { REACT_APP_AXIOS_URL: url } = process.env;

  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  const [detailUserModalOpen, setDetailUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for editing


  useEffect(() => {
    // Fetch user data and store it in both users and originalUsers state variables
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`${url}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setOriginalUsers(response.data); // Store original unfiltered user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMsg(error.response?.data?.msg || 'Error fetching user data');
      }
    };
    fetchData();
  }, [url]);


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
    { Header: 'user_id', accessor: 'user_id' },
    { Header: 'username', accessor: 'username' },
    { Header: 'firstName', accessor: 'first_name' },
    { Header: 'lastName', accessor: 'last_name' },
    { Header: 'email', accessor: 'email' },
    { Header: 'unit_id', accessor: 'unit_id' },
    {
      Header: 'Actions',
      Cell: ({ original }) => (
        <div>
          <button className="btn btn-sm btn-dark mx-2" onClick={() => handleViewDetails(original)}><i className="fa-regular fa-eye"></i></button>
          <button className="btn btn-sm btn-dark mx-2" onClick={() => handleEdit(original)}><i className="fa-solid fa-pencil"></i></button>
          <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDelete(original)}><i className="fa-regular fa-trash-can"></i></button>
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
      await axios.put(`${url}/users/${selectedUser.user_id}`, updatedUserData);
      // Refresh user data after successful edit
      window.location.reload();
    } catch (error) {
      console.error('Error editing user:', error);
    }
    setEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (user) => {
    try {
      // Send a DELETE request to your backend API to delete the user
      await axios.delete(`${url}/users/${user.user_id}`);
      // If successful, remove the deleted user from the UI
      setUsers(users.filter(u => u.user_id !== user.user_id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setDetailUserModalOpen(true);

    try {
      const response = await axios.get(`${url}/userDetails/${user.user_id}`);
      // setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMsg(error.response?.data?.msg || 'Error fetching user data');
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
      user.username.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery) ||
      (user.unit_id !== null && user.unit_id.toString().includes(searchQuery)) ||
      (user.department_id !== null && user.department_id.toString().includes(searchQuery))
    );

    // Update the state with the filtered data
    setUsers(filteredData);
  };

  return (
    <div className="container mt-0">
      {/* Render search inputs and table only if editUserModalOpen is false */}
      {!editUserModalOpen && !detailUserModalOpen && (
        <div className="mb-4 flex justify-between">
          <input type="text" placeholder="Search..." className="form-control border px-2 py-1 mr-3" onChange={handleSearch} />
          <input type="text" placeholder="Search by srt" className="form-control border px-2 py-1 mx-3" />
          <input type="text" placeholder="Search by unit" className="form-control border px-2 py-1 ml-3" />
        </div>
      )}

      {/* Render EditUserModal if editUserModalOpen is true */}
      {editUserModalOpen && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setEditUserModalOpen(false)} onConfirm={handleEditConfirmation} />
      )}

      {detailUserModalOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setDetailUserModalOpen(false)} />
      )}

      {/* Render message and ReactTable */}


      <p>{msg}</p>
      {!editUserModalOpen && !detailUserModalOpen && (
        <ReactTable data={users} columns={columns} defaultPageSize={10} className="bordered -stripped rounded -highlight rt-table bg-white border" />
      )}
    </div>

  );

}

export default AllUsers;
