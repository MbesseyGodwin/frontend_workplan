import React, { useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = ({ toggleCreateUser }) => {
  const [firstName, setFirstName] = useState('evidence');
  const [lastName, setLastName] = useState('onyebuchi');
  const [email, setEmail] = useState('maondohemba@ccfng.org');
  const [password, setPassword] = useState('Admin123');
  const [matchPassword, setMatchPassword] = useState('Admin123');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('09038337107');
  const [staffCode, setStaffCode] = useState('CCFN/2021/A111');
  const [address, setAddress] = useState('No, 15 wurukum Street');
  const [stateOrigin, setStateOrigin] = useState('benue');
  const [lgaOrigin, setLgaOrigin] = useState('makurdi');
  const [designationId, setDesignationId] = useState(1);
  const [departmentId, setDepartmentId] = useState(1);
  const [unitId, setUnitId] = useState(1);
  const [employeeId, setEmployeeId] = useState('');
  const [tenancyId, setTenancyId] = useState(1);

  const [userId, setUserId] = useState()





  const [msg, setMsg] = useState('');

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    switch (type) {
      case 'email':
        setEmail(value);
        break;
      case 'employee_id':
        setEmployeeId(value);
        break;
      case 'tenancy_id':
        setTenancyId(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'phone_number':
        setPhoneNumber(value);
        break;
      case 'staff_code':
        setStaffCode(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'state_origin':
        setStateOrigin(value);
        break;
      case 'lga_origin':
        setLgaOrigin(value);
        break;
      case 'designation_id':
        setDesignationId(value);
        break;
      case 'department_id':
        setDepartmentId(value);
        break;
      case 'unit_id':
        setUnitId(value);
        break;
      case 'fName':
        setFirstName(value);
        break;
      case 'lName':
        setLastName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'matchPassword':
        setMatchPassword(value);
        break;
      default:
        break;
    }
  };


const handleEmployeeSignup = async () => {
  try {
    const employeeData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      staff_code: staffCode,
      address: address,
      state_origin: stateOrigin,
      lga_origin: lgaOrigin,
      designation_id: designationId,
      department_id: departmentId,
      unit_id: unitId,
      tenancy_id: tenancyId
    };

    const response = await axios.post('http://0.0.0.0:8000/api/v1/employees/', employeeData, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });

    // Handle successful response, e.g., display success message or navigate to a different page
    console.log('Employee created successfully:', response.data);
    toast.success('Employee created successfully');
    setUsername(firstName+lastName)
    setEmployeeId(response.data.id);
    setTenancyId(response.data.tenancy_id);
    // setEmail(`${firstName}${lastName}@ccfng.org`)
    
    setMsg('')
  } catch (error) {
    // Handle error response
    console.error('Error creating employee:', error.response.data);
    toast.error("Error creating employee")
    setMsg(error.response.data.msg || 'Error creating employee: phone number or staff code must be unique. duplicate key value violates unique constraint');
  }
};


const handleUserSignup = async (e) => {
  e.preventDefault();
  if (password !== matchPassword) {
    return setMsg('Password fields do not match. Please try again.');
  }
  try {
    const userData = {
      username: username,
      email: email,
      password: password,
      employee_id: employeeId,
      tenancy_id: tenancyId
    };

    const response = await axios.post('http://0.0.0.0:8000/api/v1/users/', userData);

    console.log('User created successfully:', response.data);
    toast.success('user created successfully');
    setUserId(response.data.id);

    // After successful user creation, automatically assign roles to the user
    await assignRoles(response.data.id, [1, 2, 3]); // Assuming roles 1, 2, and 3 are predefined

    setMsg('');
    // window.location.reload();
  } catch (error) {
    setMsg(error.response.data.msg);
    toast.error("Error creating new user")
  }
};

const assignRoles = async (userId, roles) => {
  try {
    const data = {
      user_id: userId,
      roles: roles
    };

    const response = await axios.post(`http://0.0.0.0:8000/api/v1/users/${userId}/roles`, data);
    console.log('Roles assigned successfully:', response.data.message);
    toast.success('Default roles assigned');
    // Add a two-second delay before firing toggleCreateUser
setTimeout(() => {
  toggleCreateUser();
}, 2000);
  


  } catch (error) {
    console.error('Error assigning roles:', error);
    toast.error("default roles not assigned")
    // Handle error if roles assignment fails
  }
};


  return (
    <div id="auth-container" className="mx-auto">
       <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />


      <div id="signup-container" className="bg-slate-400 p-2 container rounded">
        {msg !== '' && <p className="text-danger alert alert-danger font-bold">{msg}</p>}
        <form id="signup-form" className="row">
          <h5 className="modal-title">Registration</h5>
          <p>an employee record must be created before a user can be created</p>

          <div className='row'>
            <div className='col-6'>
              <h4 className='text-lg text-bold'>create employee</h4>

              <div className='row'>
                <div className="form-group col-6 my-2">
                  <label className='text-sm'>First Name</label>
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => handleInputChange(e, 'fName')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Last Name</label>
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleInputChange(e, 'lName')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>phone number (unique*)</label>
                  <input type="number" placeholder="phone_number" value={phoneNumber} onChange={(e) => handleInputChange(e, 'phone_number')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Staff Code (unique*)</label>
                  <input type="text" placeholder="Staff Code" value={staffCode} onChange={(e) => handleInputChange(e, 'staff_code')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Address</label>
                  <input type="text" placeholder="Address" value={address} onChange={(e) => handleInputChange(e, 'address')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>State of Origin</label>
                  <input type="text" placeholder="State of Origin" value={stateOrigin} onChange={(e) => handleInputChange(e, 'state_origin')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>LGA of Origin</label>
                  <input type="text" placeholder="LGA of Origin" value={lgaOrigin} onChange={(e) => handleInputChange(e, 'lga_origin')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Designation ID</label>
                  <input type="number" placeholder="Designation ID" value={designationId} onChange={(e) => handleInputChange(e, 'designation_id')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-4 my-2">
                  <label className='text-sm'>Department ID</label>
                  <input type="number" placeholder="Department ID" value={departmentId} onChange={(e) => handleInputChange(e, 'department_id')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-4 my-2">
                  <label className='text-sm'>Unit ID</label>
                  <input type="number" placeholder="Unit ID" value={unitId} onChange={(e) => handleInputChange(e, 'unit_id')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-4 my-2">
                  <label className='text-sm'>Tenancy ID</label>
                  <input type="number" placeholder="Tenancy ID" value={tenancyId} onChange={(e) => handleInputChange(e, 'tenancy_id')} className="form-control p-1 text-xs border border-dark" autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Password</label>
                  <input type="password" placeholder="Password" value={password} onChange={(e) => handleInputChange(e, 'password')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
                </div>

                <div className="form-group col-6 my-2">
                  <label className='text-sm'>Confirm Password</label>
                  <input type="password" placeholder="Confirm Password" value={matchPassword} onChange={(e) => handleInputChange(e, 'matchPassword')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
                </div>
              </div>
            </div>



            <div className='col-6'>
              <h4 className='text-lg text-bold'>create user</h4>
              <div className="form-group col-12 my-2">
                <label className='text-sm'>username</label>
                <input type="text" placeholder="username" value={username} onChange={(e) => handleInputChange(e, 'username')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
              </div>

              <div className="form-group col-12 my-2">
                <label className='text-sm'>Email</label>
                <input type="email" placeholder="Your Email" value={email} onChange={(e) => handleInputChange(e, 'email')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
              </div>


              <div className="form-group col-12 my-2">
                <label className='text-sm'>employee_id</label>
                <input type="number" placeholder="employee_id" value={employeeId} onChange={(e) => handleInputChange(e, 'employee_id')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
              </div>


              <div className="form-group col-12 my-2">
                <label className='text-sm'>tenancy_id</label>
                <input type="number" placeholder="tenancy_id" value={tenancyId} onChange={(e) => handleInputChange(e, 'tenancy_id')} className="form-control p-1 text-xs border border-dark" required autoComplete="false" />
              </div>

            </div>


          </div>


          <div className="my-2 flex justify-around">


            <button type="button" onClick={handleEmployeeSignup} className="btn btn-danger">
              Create employee
            </button>


            <button type="button" onClick={handleUserSignup} className="btn btn-danger">
              Create new User
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
