import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AllUsers from './AllUsers';
import CreateUser from './CreateUser';

function ManageUser() {
  const [showCreateUser, setShowCreateUser] = useState(false);

  const toggleCreateUser = () => {
    setShowCreateUser(!showCreateUser);
  };

  return (
    <DefaultLayout pageTitle="User Account">
      <div className='container my-5 p-4 rounded-2xl bg-slate-300'>

        <div className='container flex justify-end'>
          <button className='btn btn-danger m-2' onClick={toggleCreateUser}><i className="fa-solid fa-user-plus"></i></button>
        </div>

        {showCreateUser ? <CreateUser toggleCreateUser={toggleCreateUser} /> : <AllUsers />}

      </div>
    </DefaultLayout>
  );
}

export default ManageUser;
