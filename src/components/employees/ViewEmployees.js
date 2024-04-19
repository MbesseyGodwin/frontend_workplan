import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import DefaultLayout from '../../layout/DefaultLayout';

function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading status

  const accessToken = localStorage.getItem('accessToken'); // Assuming access token is stored in local storage

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://0.0.0.0:8000/api/v1/employees/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json'
          }
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data); // Initialize filteredEmployees with all employees
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching employees. Please try again.');
        setLoading(false); // Set loading to false if an error occurs
      }
    };

    fetchEmployees();
  }, [accessToken]);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = employees.filter((employee) =>
      employee.first_name.toLowerCase().includes(searchTerm) ||
      employee.last_name.toLowerCase().includes(searchTerm) ||
      employee.phone_number.includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  return (

    <DefaultLayout pageTitle="Employees">

    <div className="container mx-auto my-5 px-4">
        
      {/* serves as breadcrumb */}
      <div className="flex justify-between items-center bg-gray-300 mb-2 border border-dark rounded p-2">
        <div className="">
          <Link to="../dashboard" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </Link>
          {/* {/* <span className="mx-2">&#8594;</span> */}
        </div>
        <div className="">
          {/* <span className="mx-2">&#8594;</span> */}
          <Link to="../manage-users" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            manage-users
          </Link>
        </div>
      </div>

      <h4 className="text-xl font-bold">All Employees</h4>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by name or phone number" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="border-2 border-black rounded-md px-3 py-2 w-full"
        />
      </div>
      {/* Display loading message if data is being fetched */}
      {loading ? (
        <p className="text-gray-500">Fetching data...</p>
      ) : (
        <>
          {/* Display error message if an error occurs */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <table className="w-full table table-bordered border-collapse border-2 border-black">
            <thead>
              <tr>
                <th className="border-2 border-black px-4 py-2 text-xs">S/N</th>
                <th className="border-2 border-black px-4 py-2 text-xs">E-ID (dev)</th>
                <th className="border-2 border-black px-4 py-2 text-xs">Name</th>
                <th className="border-2 border-black px-4 py-2 text-xs">Phone Number</th>
                <th className="border-2 border-black px-4 py-2 text-xs">staff_code</th>
                <th className="border-2 border-black px-4 py-2 text-xs">address</th>
                <th className="border-2 border-black px-4 py-2 text-xs">state_origin</th>
                <th className="border-2 border-black px-4 py-2 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-gray-100">
                <td className="border-2 border-black px-4 py-2 text-xs">{index+1}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.id}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.first_name} {employee.last_name}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.phone_number}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.staff_code}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.address}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">{employee.lga_origin}, {employee.state_origin}</td>
                  <td className="border-2 border-black px-4 py-2 text-xs">
                    <button className="bg-blue-500 hover:bg-blue-700 badge text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
                    <button className="bg-red-500 hover:bg-red-700 badge text-white font-bold py-2 px-4 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
    </DefaultLayout>
  );
}

export default ViewEmployees;
