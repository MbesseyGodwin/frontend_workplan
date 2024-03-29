import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwtDecode from 'jwt-decode';
import caritaslogo from '../../assets/images/caritas-logo4.png';

const Login = () => {
  const [email, setEmail] = useState('nattah@ccfng.org');
  const [password, setPassword] = useState('123');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [user, setUser] = useState('123');

  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

  function removeCookie(cookieName) {
    // Set the expiration date to a past date
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Call the function to remove the "favorite-color" cookie
  removeCookie('refreshToken');
  

  const clearStorageAndCookies = () => {
    // Clear localStorage
    localStorage.clear();
  
    // Clear sessionStorage
    sessionStorage.clear();
  
    // Clear cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 2070 00:00:00 GMT;path=/';
    }
  };

  clearStorageAndCookies();
  

  const handleInputChange = (e, type) => {
    if (type === 'email') return setEmail(e.target.value);
    if (type === 'password') return setPassword(e.target.value);
  }

  const handleContinue = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.match(emailRegex)) {
      toast.error('Email address is not valid');
      return;
    }
    setShowPasswordInput(true);
  }

  const goBackToEmail = () => {
    setShowPasswordInput(false);
    setPassword('');
  }

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true during login
    try {
      const response = await axios.put(`${url}/login`, {
        email,
        password,
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      const decodedToken = jwtDecode(accessToken);

      sessionStorage.setItem('loggedInUser', JSON.stringify(decodedToken));
      console.log('Decoded token:', decodedToken);
      setUser(decodedToken)

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Failed to login');
      setLoading(false);
    }
  };





  return (
    <div className='bg-black m-0 p-0'>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="flex justify-center items-center h-screen">
        <div className="login-card">
          <div className="bg-white m-sm-5 m-md-5 mx-md-5 mx-sm-0 p-4 rounded-lg strong-shadow z-10">
            <div className="w-full">
              <h1 className="text-3xl alert alert-light text-danger bg-white text-center border-0 uppercase">workplan management system</h1>
              <form onSubmit={showPasswordInput ? handleUserLogin : handleContinue}>


                <div className="form-group" style={{ display: showPasswordInput ? 'none' : 'block' }}>
                  <label className='text-xl fw-bold pb-1' htmlFor="email">Email</label>
                  <div className='flex'>
                    <div className='text-3xl px-4 py-3 mb-6 rounded rounded-end-0 border border-dark shadow-sm'><i className="fa-regular fa-envelope"></i></div>
                    <input required type="email" placeholder="Email" value={email} onChange={e => handleInputChange(e, 'email')} className="w-full text-2xl px-4 py-3 mb-6 rounded rounded-start-0 border border-dark shadow-sm" />
                  </div>
                </div>


                {showPasswordInput && (
                  <div className="form-group">
                    <label className='text-xl fw-bold pb-1' htmlFor="password">Password</label>
                    <div className='flex'>
                      <div className='text-3xl px-4 py-3 mb-6 rounded rounded-end-0 border border-dark shadow-sm'><i className="fa-solid fa-unlock-keyhole"></i></div>
                      <input required type="password" placeholder="Password" value={password} onChange={e => handleInputChange(e, 'password')} className="w-full text-2xl px-4 py-3 mb-6 rounded rounded-start-0  border border-dark shadow-sm" />
                    </div>
                  </div>
                )}


                <div className="d-flex justify-between">
                  {showPasswordInput && (
                    <>
                      <button type="button" className="w-60 text-2xl bg-black text-white px-4 py-3 rounded hover:bg-gray-500" onClick={goBackToEmail}>Back</button>
                      <button type="submit" className="w-60 text-2xl bg-red-700 text-white px-4 py-3 rounded hover:bg-red-900" disabled={loading}>{loading ? <i className="fa-solid fa-beat fa-sm text-sm">Validating</i> : <span>Sign In</span>}</button>
                    </>
                  )}
                  {!showPasswordInput && (
                    <button
                      type="submit"
                      className={`w-100 text-2xl px-4 py-3 rounded hover:bg-red-400 ${email === "" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-black text-white"}`}
                      onClick={handleContinue}
                      disabled={email === ""}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
