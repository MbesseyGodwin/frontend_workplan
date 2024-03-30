// ./frontend/src/App.js
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie library

// import './App.css';
import "./index.css";

// import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import CreateWorkplan from './components/workplan/CreateWorkplan';
import StateWorkplan from './components/workplan/StateWorkplan';
import WorkplanStatus from './components/workplan/WorkplanStatus';
import ReportHistory from './components/report/ReportHistory';
import UploadReport from './components/report/UploadReport';
import ManageUser from './components/users/Manageuser';
import Setting from './components/settings/Setting';
import VisitSummary from './components/visits/VisitSummary';
import jwtDecode from 'jwt-decode';
import ApproveRequest from './components/requests/ApproveRequest';
import CollateWorkplan from './components/requests/CollateWorkplan';
import AssignVehicle from './components/requests/AssignVehicle';



const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem('accessToken');
    if (userToken) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(userToken);
      setLoggedInUser(decodedToken);
    }
  }, []);

  // const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
        <Route path='/create-workplan' element={<CreateWorkplan />} />
        <Route path='/state-workplan' element={<StateWorkplan />} />
        <Route path='/workplan-status' element={<WorkplanStatus />} />
        <Route path='/upload-report' element={<UploadReport />} />
        <Route path='/report-history' element={<ReportHistory />} />
        <Route path='/visit-summary' element={<VisitSummary />} />
        <Route path='/settings' element={<Setting />} />
        <Route path='/approve-request' element={<ApproveRequest />} />
        <Route path='/collate-workplan' element={<CollateWorkplan />} />
        <Route path='/assign-vehicle' element={<AssignVehicle />} />

        {/* Conditionally render the ManageUser route based on roleID if loggedInUser exists */}
        {loggedInUser && loggedInUser.roleID === 1 && (
          <Route path='/manage-users' element={<ManageUser />} />
        )}

      </Routes>
    </BrowserRouter>
  );
};

export default App;
