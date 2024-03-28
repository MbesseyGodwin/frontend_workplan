import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import "./Login.css"
import caritaslogo from '../../assets/images/caritas-logo4.png';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import jwtDecode from 'jwt-decode';

const Login = () => {
  // State variables to manage email, password, and error message
  const [email, setEmail] = useState('nattah@ccfng.org')
  const [password, setPassword] = useState('123')
  const [showPasswordInput, setShowPasswordInput] = useState(false); // State to manage showing password input
  const [signInDisabled, setSignInDisabled] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [roleID, setRoleID] = useState();
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [user, setUser] = useState([]);

  // Access the navigation function from React Router
  const navigate = useNavigate()

  // Retrieve the backend URL from environment variables
  const { REACT_APP_AXIOS_URL: url } = process.env

  // Function to handle input changes
  const handleInputChange = (e, type) => {
    if (type === 'email') return setEmail(e.target.value)
    if (type === 'password') return setPassword(e.target.value)
  }

  // Function to handle continue button click
  const handleContinue = (e) => {
    e.preventDefault();

    // Check if the email is filled and in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.match(emailRegex)) {
      // If email is not filled or not in correct format, display an error message
      // setMsg("Please enter a valid email address.");            
      toast.error('Email address is not valid');
      return;
    }
    // If email is in correct format, proceed to show password input
    setShowPasswordInput(true);
  }

  // Function to go back to email input
  const goBackToEmail = () => {
    setShowPasswordInput(false);
    setPassword(''); // Clear password field
  }


  // Function to handle user login
  const handleUserLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Send a login request to the backend
      await axios.put(`${url}/login`, {
        email,
        password,
      });
  
      // Call refreshToken function to update user data and set session storage
      await refreshToken();
  
      // Redirect to the dashboard upon successful login
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Display error message if login fails
      if (error) return toast.error(`${error.response.data}`);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      const { accessToken } = response.data;
      setToken(accessToken);
      const decoded = jwtDecode(accessToken);
      setUser(decoded); // Set user information
      setFirstName(decoded.fName);
      setExpire(decoded.exp);
      setRoleID(decoded.roleID);
      
      console.log(decoded);
  
      // Save user data in session storage
      sessionStorage.setItem('loggedInUser', JSON.stringify(decoded));
  
      return decoded; // Return decoded user data
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
                  <input required type="email" placeholder="Email" value={email} onChange={e => handleInputChange(e, 'email')} className="w-full text-2xl px-4 py-3 mb-6 rounded border border-dark shadow-sm" />
                </div>

                {showPasswordInput && (
                  <div className="form-group">
                    <label className='text-xl fw-bold pb-1' htmlFor="password">Password</label>
                    <input required type="password" placeholder="Password" value={password} onChange={e => handleInputChange(e, 'password')} className="w-full text-2xl px-4 py-3 mb-6 rounded border border-dark shadow-sm" />
                  </div>
                )}

                <div className="d-flex justify-between">
                  {showPasswordInput && (
                    <>
                      <button type="button" className="w-60 text-2xl bg-black text-white px-4 py-3 rounded hover:bg-gray-500" onClick={goBackToEmail}>Back</button>
                      <button type="submit" className="w-60 text-2xl bg-red-700 text-white px-4 py-3 rounded hover:bg-red-900" disabled={signInDisabled}>Sign In</button>
                    </>
                  )}
                  {!showPasswordInput && (

                    <button
                      type="submit"
                      className={`w-100 text-2xl px-4 py-3 rounded hover:bg-red-400 ${email === "" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-black text-white"
                        }`}
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
  )
}

export default Login;
