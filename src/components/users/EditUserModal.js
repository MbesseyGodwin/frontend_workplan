import React, { useState } from 'react';

const EditUserModal = ({ user, onClose, onConfirm }) => {
  const [updatedUserData, setUpdatedUserData] = useState({
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
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

  return (
    <div className="container" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-white p-2 rounded">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
          </div>

          <div className="modal-body row">
            <div className="form-group col-6 my-2">
              <label>Username</label>
              <input type="text" name="username" value={updatedUserData.username} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group col-6 my-2">
              <label>First Name</label>
              <input type="text" name="firstName" value={updatedUserData.firstName} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group col-6 my-2">
              <label>Last Name</label>
              <input type="text" name="lastName" value={updatedUserData.lastName} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group col-6 my-2">
              <label>Email</label>
              <input type="email" name="email" value={updatedUserData.email} onChange={handleInputChange} className="form-control" />
            </div>
            {/* Add other input fields for editing user information */}
          </div>
          <div className="my-2 flex justify-around">
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>Confirm</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
