import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

function ReportHistory() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const { REACT_APP_AXIOS_URL: url } = process.env;

  const [workplansWithoutReport, setWorkplansWithoutReport] = useState([]);
  const [workplansWithReport, setWorkplansWithReport] = useState([]);
  const [showWorkplansWithReport, setShowWorkplansWithReport] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch workplans without reports from the backend
    const fetchWorkplansWithoutReport = async () => {
      try {
        // Make a GET request to the backend API
        const response = await axios.get(`${url}/workplansWithoutReport`, {
          params: {
            user_id: loggedInUser.userID // Replace with the actual user ID
          }
        });
        // Set the retrieved workplans to state
        setWorkplansWithoutReport(response.data);
        setLoading(false); // Data is loaded

        // Show the alert after a delay if there are no pending reports found
        if (response.data.length === 0) {
          setTimeout(() => {
            setShowAlert(true);
          }, 2000); // 2000 milliseconds (2 seconds) delay
        }
      } catch (error) {
        console.error('Error fetching workplans without reports: ', error);
        setLoading(false); // Loading failed
      }
    };

    // Fetch workplans with reports
    const fetchWorkplansWithReport = async () => {
      try {
        const response = await axios.get(`${url}/workplansWithReport`, {
          params: {
            user_id: loggedInUser.userID
          }
        });
        setWorkplansWithReport(response.data);
      } catch (error) {
        console.error('Error fetching workplans with reports: ', error);
      }
    };

    // Call the functions to fetch workplans
    fetchWorkplansWithoutReport();
    fetchWorkplansWithReport();
  }, [loggedInUser.userID]); // Dependency array ensures effect runs when userID changes

  // Function to toggle showing workplans with reports
  const toggleShowWorkplansWithReport = () => {
    setShowWorkplansWithReport(!showWorkplansWithReport);
  };

  // console.log(workplansWithoutReport);

  return (
    <DefaultLayout pageTitle="Report History">
      <div className="container align-center mt-10">
        
        {/* serves as breadcrumb */}
        <div className="flex justify-between items-center bg-gray-300 mb-4 border border-dark rounded p-2">
          <div className="">
            <Link to="../dashboard" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </Link>
            {/* <span className="mx-2">&#8594;</span> */}
          </div>

          <div>
            <button className='btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={toggleShowWorkplansWithReport}>
              {!showWorkplansWithReport ? 'Submitted Reports' : 'Pending Reports'}
            </button>
          </div>

          <div className="">
            {/* <span className="mx-2">&#8594;</span> */}
            <Link to="../upload-report" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              upload-report
            </Link>
          </div>
        </div>

        <div className='container p-3 bg-gray-300 rounded-lg my-2 '>
          <h5>{!showWorkplansWithReport ? 'My Pending' : 'All Submitted'} Reports</h5>
          {!showWorkplansWithReport ? (
            <div className="table-responsive">
              <table className="table table-bordered border border-dark">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>workplan Date</th>
                    <th>approval_date</th>
                    <th>workplan_type</th>
                    <th>Description</th>
                    <th>workplan_week</th>
                    <th>workplan_quarter</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workplansWithoutReport.map((workplan, index) => (
                    <tr key={index}>
                      <td>{workplan.workplan_day}</td>
                      <td> <Moment format='YYYY/MM/DD'>{workplan.workplan_date}</Moment></td>
                      <td> <Moment format='YYYY/MM/DD'>{workplan.approval_date}</Moment></td>
                      <td>{workplan.workplan_type}</td>
                      <td>{workplan.description}</td>
                      <td>{workplan.workplan_week}</td>
                      <td>{workplan.workplan_quarter}</td>
                      <td className='text-danger fw-bold'>No Report</td>
                      {/* Add more table cells for additional workplan properties */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Display a message if no workplans are available */}
              {workplansWithoutReport.length === 0 && !showAlert && <p>checking...</p>}
              {showAlert && <p className='alert alert-danger font-bold'>No Pending Reports Found.</p>}
            </div>

          ) : (
            <div className="table-responsive">
              <table className="table table-bordered border border-dark">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>workplan_week</th>
                    <th>workplan_quarter</th>
                    <th>report_status</th>
                    {/* Add more table headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {workplansWithReport.map((workplan, index) => (
                    <tr key={index}>
                      <td>{workplan.title}</td>
                      <td>{workplan.description}</td>
                      <td>{workplan.status}</td>
                      <td>{workplan.workplan_week}</td>
                      <td>{workplan.workplan_quarter}</td>
                      <td>{workplan.report_status}</td>
                      {/* <td className='text-success fw-bold'>submitted</td> */}
                      {/* Add more table cells for additional workplan properties */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Display a message if no workplans with reports are available */}
              {workplansWithReport.length === 0 && <p className='alert alert-success'>No workplans with reports found.</p>}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ReportHistory;
