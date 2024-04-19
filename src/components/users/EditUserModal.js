import React, { useState } from 'react';

const EditUserModal = ({ user, onClose, onConfirm }) => {
  const [updatedUserData, setUpdatedUserData] = useState({
    username: user.username,
    tenancy_id: user.tenancy_id,
    email: user.email
    // Add other user fields as needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirm = () => {
    onConfirm(updatedUserData);
  };

  const tenancies = [
    { id: 1, value: 'abia' },
    { id: 2, value: 'enugu' },
    { id: 3, value: 'imo' }
  ];

  return (
    <div className="container bg-gray-400 p-2 rounded" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-slate-800 p-2">

          <div className="modal-header">
            <h6 className="modal-title text-decoration-underline">Edit User</h6>
          </div>

          <div className="modal-body row">
            <div className="form-group col-4 my-2">
              <label className='text-sm fw-bold'>Username <span className='text-xs fw-light text-red-900'>(cannot be modified)</span></label>
              <input type="text" disabled name="username" value={updatedUserData.username} onChange={handleInputChange} className="form-control bg-secondary border border-dark shadow-none" />
            </div>

            <div className="form-group col-4 my-2">
              <label className='text-sm fw-bold'>Email <span className='text-xs fw-light text-red-900'>(cannot be modified)</span></label>
              <input type="email" disabled name="email" value={updatedUserData.email} onChange={handleInputChange} className="form-control bg-secondary border border-dark shadow-none" />
            </div>

            <div className="form-group col-4 my-2">
              <label className='text-sm fw-bold'>tenancy_id</label>
              <select name="tenancy_id" value={updatedUserData.tenancy_id} onChange={handleInputChange} className="form-control border border-dark shadow-none">
                {tenancies.map(tenancy => (
                  <option key={tenancy.id} value={tenancy.id}>{tenancy.value}</option>
                ))}
              </select>

            </div>

          </div>

          <div className="my-2 flex justify-between">
            <button type="button" className="btn btn-primary badge" onClick={handleConfirm}>Confirm</button>
            <button type="button" className="btn btn-secondary badge" onClick={onClose}>Cancel</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
