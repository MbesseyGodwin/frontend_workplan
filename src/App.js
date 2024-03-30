import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie library

import "./index.css";

const Login = lazy(() => import('./components/login/Login'));
const Signup = lazy(() => import('./components/signup/Signup'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const CreateWorkplan = lazy(() => import('./components/workplan/CreateWorkplan'));
const StateWorkplan = lazy(() => import('./components/workplan/StateWorkplan'));
const WorkplanStatus = lazy(() => import('./components/workplan/WorkplanStatus'));
const ReportHistory = lazy(() => import('./components/report/ReportHistory'));
const UploadReport = lazy(() => import('./components/report/UploadReport'));
const ManageUser = lazy(() => import('./components/users/Manageuser'));
const Setting = lazy(() => import('./components/settings/Setting'));
const VisitSummary = lazy(() => import('./components/visits/VisitSummary'));
const ApproveRequest = lazy(() => import('./components/requests/ApproveRequest'));
const CollateWorkplan = lazy(() => import('./components/requests/CollateWorkplan'));
const AssignVehicle = lazy(() => import('./components/requests/AssignVehicle'));

const App = () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  const checkAccessTokenInCookies = () => {
    const accessTokenFromCookies = Cookies.get('accessToken');
    if (!accessTokenFromCookies) {
      const accessTokenFromLocalStorage = localStorage.getItem('accessToken');
      if (accessTokenFromLocalStorage) {
        Cookies.set('accessToken', accessTokenFromLocalStorage, { expires: 7 });
      }
    }
  };

  useEffect(() => {
    checkAccessTokenInCookies();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
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

          {loggedInUser && loggedInUser.roleID === 1 && (
            <Route path='/manage-users' element={<ManageUser />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
