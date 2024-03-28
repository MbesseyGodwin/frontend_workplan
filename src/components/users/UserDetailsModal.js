import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="">


      {/* <div className="bg-white w-96 rounded-lg p-6">
        

      </div> */}

      <div className='row'>

        <div className='flex justify-between'>
          <button className="btn btn-danger hover:text-red-200" onClick={onClose}>close</button>
          <h2 className="text-xl font-semibold">User Details</h2>

        </div>


        <div className='col-12 my-2'>
          <div className='bg-white p-5'>
            <p><strong>User ID:</strong> {user.user_id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <div className='col-4 my-2'>
          <div className='bg-white p-5'>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
          </div>
        </div>

        <div className='col-4 my-2'>
          <div className='bg-white p-5'>
            <p><strong>Unit ID:</strong> {user.unit_id}</p>
          </div>
        </div>


        <div className='col-4 my-2'>
          <div className='bg-white p-5'>
            page 4
          </div>
        </div>


      </div>

    </div>
  );
};

export default UserDetailsModal;
