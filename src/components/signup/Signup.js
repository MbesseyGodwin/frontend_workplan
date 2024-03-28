//  ./frontend/src/components/Signup.js

import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [matchPassword, setMatchPassword] = useState('')
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()

  const { REACT_APP_AXIOS_URL: url } = process.env

  const handleInputChange = (e, type) => {
    const value = e.target.value

    switch (type) {
      case 'email': return setEmail(value)
      case 'fName': return setFirstName(value)
      case 'lName': return setLastName(value)
      case 'password': return setPassword(value)
      case 'matchPassword': return setMatchPassword(value)
      default:
        break;
    }
  }

  const handleUserSignup = async (e) => {
    e.preventDefault()
    if (password !== matchPassword) {
      return setMsg('Password fields do not match. Please try again.')
    }

    try {
      await axios.post(`${url}/signup`, {
        firstName,
        lastName,
        email,
        password
      })

      navigate('/', { replace: true })
    } catch (error) {
      setMsg(error.response.data.msg)
    }
  }

  return (
    <div id="auth-container">
      <div id="signup-container">
        <h1>Sign Up</h1>
        {msg !== '' && <p>{msg}</p>}
        <form id="signup-form" onSubmit={handleUserSignup}>
          <input type="text" placeholder='First Name' value={firstName} onChange={e => handleInputChange(e, 'fName')}/>
          <input type="text" placeholder='Last Name' value={lastName} onChange={e => handleInputChange(e, 'lName')}/>
          <input type="email" placeholder='your-email@example.com' value={email} onChange={e => handleInputChange(e, 'email')}/>
          <input type="password" placeholder='Password' value={password} onChange={e => handleInputChange(e, 'password')}/>
          <input type="password" placeholder='Confirm Password' value={matchPassword} onChange={e => handleInputChange(e, 'matchPassword')}/>
          <input type="submit" value="Create Account" />
        </form>
      </div>
    </div>
  )
}

export default Signup