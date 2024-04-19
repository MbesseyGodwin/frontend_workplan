import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState('Please use a strong password');
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get('token');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Password strength validation
    const isValidPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{6,}$/.test(newPassword);
    if (!isValidPassword) {
      setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post(`http://0.0.0.0:8000/api/v1/password-reset/confirm/`, {
        reset_token: token,
        new_password: newPassword,
      });
      console.log('Password reset response:', response.data);
      toast.success('Password reset successfully');
      setErrorMessage('You will be redirected to the login page');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Password reset failed. Try again');
      setErrorMessage('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div className="container">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      
      <div className="row justify-content-center flex justify-center items-center h-screen">
        <div className="col-md-6">

          <div className='flex justify-between mb-2'>
          <h6 title='Return to login page' onClick={() => navigate('/')} className="card-title btn p-0 fw-bold text-center text-danger capitalize"><i className='fa-solid fa-home'></i> caritas nigeria</h6>

            <h6 className="card-title text-center">Reset Your Password</h6>
          </div>

          <div className="card border border-dark">
            <div className="card-body">
              <form onSubmit={handlePasswordReset}>
                <div className="form-group mb-2">
                  <label htmlFor="newPassword">Reset token (disabled)</label>
                  <input type="text" disabled className="form-control border border-dark shadow-none" value={token} required />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-group">
                    <input type={showPassword ? 'text' : 'password'} id="newPassword" name="newPassword" className="form-control border border-dark shadow-none" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <button type="button" className="btn btn-outline-secondary border border-dark" onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>

                  <div className="input-group">
                    <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" className="form-control border border-dark shadow-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="button" className="btn btn-outline-secondary border border-dark" onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
                {errorMessage && <p className="flex justify-end text-sm text-danger mt-2 mb-1">{errorMessage}</p>}
                <div className="flex justify-between">
                  <button type="submit" className="btn btn-primary">Reset Password</button>
                  {/* <input type="reset" className="btn btn-dark"></input> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
