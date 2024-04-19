import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AllUsers from './AllUsers';
import CreateUser from './CreateUser';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ManageUser() {
  const [showCreateUser, setShowCreateUser] = useState(false);

  const toggleCreateUser = () => {
    setShowCreateUser(!showCreateUser);
  };

  return (
    <DefaultLayout pageTitle="User Account">
       <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />


      <div className='container my-3 mx-auto'>
        {/* serves as breadcrumb */}
        <div className="flex justify-between items-center bg-gray-300 mb-2 border border-dark rounded p-2">

          <div className="">
            <Link to="../dashboard" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </Link>
            {/* <span className="mx-2">&#8594;</span> */}
          </div>


          <div className="">
            {/* <span className="mx-2">&#8594;</span> */}
            <Link to="../view-employees" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              view-employees
            </Link>
          </div>

          <div className="">
            {/* <span className="mx-2">&#8594;</span> */}
            <button className='btn btn-danger btn-sm badge p-2' onClick={toggleCreateUser}><i className="fa-solid fa-user-plus"></i> Add User</button>
          </div>

        </div>
        {showCreateUser ? <CreateUser toggleCreateUser={toggleCreateUser} /> : <AllUsers />}

      </div>
    </DefaultLayout>
  );
}

export default ManageUser;
