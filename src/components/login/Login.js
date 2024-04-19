import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Login.css"
import { useNavigate } from 'react-router-dom';
import caritaslogo from '../../assets/images/caritas-logo4.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [username, setUsername] = useState('maondohemba@ccfng.org');
  const [password, setPassword] = useState('strongpassword');
  const [errorMessage, setErrorMessage] = useState(''); // More specific error message
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to track loading status
  const [resetModalOpen, setResetModalOpen] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructuring for cleaner access
    setUsername(name === 'username' ? value : username);
    setPassword(name === 'password' ? value : password);
  };



  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when sign-in process starts


    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`http://0.0.0.0:8000/api/v1/token`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 || response.status === 201) {

        console.log("success");
        console.log(response.data);

        // Store access token in local storage
        localStorage.setItem('accessToken', response.data.access_token);
        // localStorage.setItem('refreshToken', response.data.refresh_token);

        getUserInfo();

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
          setLoading(false); // Set loading to false after sign-in process completes
        }, 2000);

        setErrorMessage('');
      } else {
        setErrorMessage('Login failed. Please check your credentials.'); // Specific message
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Username or Password Invalid'); // Use API error message if available
        setLoading(false); // Set loading to false after sign-in process completes
      } else {
        console.error('Login error:', error);
        setErrorMessage('An unexpected error occurred. Please try again later.');
        setLoading(false); // Set loading to false after sign-in process completes
      }
    }
  };

  const url = 'http://0.0.0.0:8000/api/v1'; // Assuming the base URL is constant

  const getUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Assuming access token is stored in local storage

      if (!accessToken) {
        // Handle missing access token (e.g., redirect to login)
        navigate('/', { replace: true });
        console.error('Access token not found');
        return;
      }

      const response = await axios.get(`${url}/users/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        console.log('User data:', response.data);
        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
      } else {
        console.error('Error fetching user info:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`http://0.0.0.0:8000/api/v1/password-reset/`, {
        email: username // Assuming username is the email
      });
      console.log('Password reset response:', response.data);
      setErrorMessage('a reset link has been sent to your email');
      toast.success('If your account exists, a reset link has been sent to your email');

      setTimeout(() => {
        
      setResetModalOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage('Failed to send reset link. Please try again later.');
    }
  };


  return (
    <div className='m-0 p-0'>
       <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      <div className='header-box-logo'>
        <img className='caritaslogo  mt-0 flex justify-end' src={caritaslogo} alt='logo' />
      </div>

      <div className="flex justify-end items-center my-10 mx-3 md:h-screen sm:h-screen custom-height">
        <div className="Background fixed">
          <div className='Ellipse3'></div>
          <div className='Ellipse1'></div>
          <div className='Ellipse2'></div>
        </div>

        <div className={resetModalOpen === true ? 'd-none' : 'login-card alert m-0'}>
          <div className='mt-5 mb-2'>
            <h6 className='text-lg lg:text-xl text-red-600 m-0 p-0 fw-bold text-center capitalize'>workplan management </h6>
            <h6 className='text-lg lg:text-xl text-red-600 p-0 m-0 fw-bold text-center capitalize'>system</h6>
          </div>

          <div className="bg-white p-3 rounded-lg strong-shadow z-10">
            <div className="">


              {errorMessage ? (
                <p className="text-xs lg:text-sm text-center alert alert-danger lowercase">{errorMessage}</p>
              ) : (
                <p className="text-xs lg:text-sm alert alert-light text-dark bg-light border-0 text-center lowercase">Welcome Back</p>
              )}

              <div>
                <div className="form-group">
                  <label className='text-sm fw-bold pb-0' htmlFor="username">Username</label>
                  <input required type="email" placeholder="Username" value={username} onChange={handleInputChange} className="w-full text-sm px-4 py-3 rounded border shadow-sm" name="username" />
                </div>
                <div className="form-group">
                  <label className='text-sm fw-bold pb-0' htmlFor="password">Password</label>
                  <input required type="password" placeholder="Password" value={password} onChange={handleInputChange} className="w-full text-sm px-4 py-3 rounded border shadow-sm" name="password" />
                </div>

              <button className="btn btn-link text-danger text-decoration-none" onClick={() => setResetModalOpen(true)}> Forgot Password?</button>

                <div className='d-flex justify-center m-2 mb-0'>
                  {/* // Disable button when loading is true */}
                  <button type="submit" onClick={handleUserLogin} className="btn btn-danger bg-red-700 text-white rounded hover:bg-red-900" disabled={loading} >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Reset Password Modal */}
        {resetModalOpen && (
          <>
            <div className="modal"></div>
            <div className="reset-password-modal p-2 w-full lg:w-96 w"> {/* Added a new class for modal */}
              <div className="bg-black modal-dialog rounded-lg p-4 m-0">
                <div className="bg-black text-light text-xs modal-content">
                  <div className="modal-header py-2">
                    <h5 className="modal-title">Reset Password</h5>
                  </div>
                  <div className="modal-body">
                    <p className="mb-3">Enter your username (email) to receive a password reset link.</p>
                    <div className="form-group">
                      <label htmlFor="resetEmail" className="form-label">Username (Email)</label>
                      <input type="email" id="resetEmail" name="resetEmail" className="form-control border border-dark shadow-none" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                  </div>
                  <div className="flex justify-between py-3">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setResetModalOpen(false)}>Close</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={handleResetPassword}>Reset Password</button>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}



      </div>


    </div>
  );
};

export default Login;
