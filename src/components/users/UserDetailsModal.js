import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="container">

      <div className='row bg-gray-400 p-2 rounded-lg'>

        <div className='flex justify-between'>
          <button className="btn btn-danger hover:text-red-200 badge" onClick={onClose}>close</button>
          <h2 className="text-xl font-semibold">User Details</h2>

        </div>


        <div className='col-12 my-2'>
          <div className='bg-white p-3 flex justify-between rounded-lg'>
            <p className='alert alert-info text-xs' ><strong>User ID:</strong> {user.id}</p>
            <p className='alert alert-info text-xs' ><strong>Username:</strong> {user.username}</p>
            <p className='alert alert-info text-xs' ><strong>Email:</strong> {user.email}</p>
            <p className='alert alert-info text-xs' ><strong>First Name:</strong> {user.first_name === null ? 'not specified from backend' : user.first_name}</p>
            <p className='alert alert-info text-xs' ><strong>Last Name:</strong> {user.last_name === null ? 'not specified from backend' : user.last_name}</p>
          </div>
        </div>

        {/* Render user roles */}
        <div className='col-12 my-2'>
          <div className='bg-white p-3 rounded-lg'>
            <p><strong>User Roles:</strong> <span className='badge bg-dark'>{user.roles.length}</span> </p>
            <ul className='p-0 m-0 flex justify-start'>
              {user.roles.map((role) => (
                <li className='alert alert-info text-xs mx-2' key={role.id}>{role.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className='col-4 my-2'>
          <div className='bg-white p-3 rounded-lg'>
          placeholder
          </div>
        </div>

        <div className='col-4 my-2'>
          <div className='bg-white p-3 rounded-lg'>
          placeholder
          </div>
        </div>


        <div className='col-4 my-2'>
          <div className='bg-white p-3 rounded-lg'>
            placeholder
          </div>
        </div>


      </div>

    </div>
  );
};

export default UserDetailsModal;
