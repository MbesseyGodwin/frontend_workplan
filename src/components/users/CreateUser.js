import { useState } from 'react';
import axios from 'axios';

const CreateUser = ({ toggleCreateUser }) => {
  // State variables for form inputs and error message
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState('');
  const [msg, setMsg] = useState('');

  const { REACT_APP_AXIOS_URL: url } = process.env

  // Function to handle input changes
  const handleInputChange = (e, type) => {
    const value = e.target.value;
    switch (type) {
      case 'email':
        return setEmail(value);
      case 'fName':
        return setFirstName(value);
      case 'lName':
        return setLastName(value);
      case 'password':
        return setPassword(value);
      case 'matchPassword':
        return setMatchPassword(value);
      default:
        break;
    }
  };

  // Function to handle user signup form submission
  const handleUserSignup = async (e) => {
    e.preventDefault();
    // Check if password and confirm password match
    if (password !== matchPassword) {
      return setMsg('Password fields do not match. Please try again.');
    }
    try {
      // Send POST request to signup endpoint
      await axios.post(`${url}/signup`, {
        firstName,
        lastName,
        email,
        password,
      });
      // Reload the page after successful signup
      window.location.reload();
    } catch (error) {
      // Set error message if signup fails
      setMsg(error.response.data.msg);
    }
  };

  return (
    <div id="auth-container" className="mx-auto p-2">
      <div id="signup-container" className="bg-slate-400 p-2 container rounded">
        {/* Display error message if exists */}
        {msg !== '' && <p className="text-danger alert alert-danger">{msg}</p>}
        <form id="signup-form" onSubmit={handleUserSignup} className="row">
          {/* Input fields for first name, last name, email, password, and confirm password */}
          <h5 className="modal-title">Registration</h5>
          <div className="form-group col-6 my-2">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => handleInputChange(e, 'fName')}
              className="form-control"
              required
              autoComplete="false"
            />
          </div>
          <div className="form-group col-6 my-2">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => handleInputChange(e, 'lName')}
              className="form-control"
              required
              autoComplete="false"
            />
          </div>
          <div className="form-group col-6 my-2">
            <label>Email</label>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="form-control"
              required
              autoComplete="false"
            />
          </div>
          <div className="form-group col-6 my-2">
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleInputChange(e, 'password')}
              className="form-control"
              required
              autoComplete="false"
            />
          </div>
          <div className="form-group col-6 my-2">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={matchPassword}
              onChange={(e) => handleInputChange(e, 'matchPassword')}
              className="form-control"
              required
              autoComplete="false"
            />
          </div>
          {/* Buttons to submit form and cancel */}
          <div className="my-2 flex justify-around">
            <button type="submit" className="btn btn-danger">
              Create User
            </button>
            <button type="button" onClick={toggleCreateUser} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
