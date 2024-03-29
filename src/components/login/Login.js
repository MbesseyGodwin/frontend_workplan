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

  const navigate = useNavigate();
  const { REACT_APP_AXIOS_URL: url } = process.env;

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
      await axios.put(`${url}/login`, {
        email,
        password,
      });
      await refreshToken();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error) {
        toast.error(`${error.response.data}`);
        setLoading(false); // Set loading state to false in case of error
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      const decoded = jwtDecode(accessToken);
      setLoading(false); // Set loading state to false after successful login
      // Set user information
      sessionStorage.setItem('loggedInUser', JSON.stringify(decoded));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error.response) {
        navigate('/', { replace: true });
      }
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
