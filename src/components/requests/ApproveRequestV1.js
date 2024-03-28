import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Accordion, Table } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles


import Moment from 'react-moment';
// import 'moment-timezone';

function ApproveRequest() {
  // State variables
  const { REACT_APP_AXIOS_URL: url } = process.env;
  const [workplanRequests, setWorkplanRequests] = useState([]); // State for storing workplan requests
  const [loading, setLoading] = useState(true); // State for tracking loading status
  const [declineReason, setDeclineReason] = useState('review what you submitted'); // State for capturing decline reason

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  // Fetch workplan requests on component mount
  useEffect(() => {
    fetchWorkplanRequests();
  }, []);

  // Function to fetch workplan requests
  const fetchWorkplanRequests = async () => {
    try {
      const response = await axios.get(`${url}/workplans/pending/authorize/${loggedInUser.userID}`);
      setWorkplanRequests(response.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching workplan requests:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  // console.log(workplanRequests);

  // Group workplan requests by user_id
  const groupedWorkplanRequests = workplanRequests.reduce((acc, curr) => {
    const index = acc.findIndex(item => item.user_id === curr.user_id);
    if (index !== -1) {
      acc[index].requests.push(curr);
    } else {
      acc.push({ user_id: curr.user_id, requests: [curr] });
    }
    return acc;
  }, []);


  const refreshWorkplanRequests = () => {
    setLoading(true);
    fetchWorkplanRequests();
  };

  const approveWorkplan = async (workplanId) => {
    try {
      await axios.put(`${url}/workplans/approve/${loggedInUser.userID}`, { userId: loggedInUser.userID, Workplan_id: workplanId });
      // Update the state to reflect the approval of the workplan
      setWorkplanRequests(workplanRequests.map(workplan => {
        if (workplan.workplan_id === workplanId) {
          return { ...workplan, status: 'Approved', authorizer: loggedInUser.userID };
        }
        return workplan;
      }));
      // Show success toast
      toast.success('Workplan approved successfully');
      // Refresh workplan requests
      refreshWorkplanRequests();
    } catch (error) {
      console.error("Error approving workplan:", error);
      // Show error toast
      toast.error('Failed to approve workplan');
    }
  };


  
// Function to handle declining a workplan
const declineWorkplan = async (workplanId) => {
  try {
    // Prompt the user to enter a comment
    const comment = prompt('Please enter a reason for declining the workplan:');
    if (!comment) {
      // User cancelled the prompt or did not enter a comment
      return;
    }

    // Send a PUT request to the backend API to decline the workplan
    await axios.put(`${url}/workplans/decline/${loggedInUser.userID}`, {
      userId: loggedInUser.userID,
      Workplan_id: workplanId,
      declineReason: comment
    });

    // Update the state to reflect the decline of the workplan
    setWorkplanRequests(workplanRequests.map((workplan) => {
      if (workplan.workplan_id === workplanId) {
        return { ...workplan, status: 'Declined', authorizer: loggedInUser.userID };
      }
      return workplan;
    }));

    // Show success toast or notification
    toast.success('Workplan declined successfully');

    // Refresh workplan requests
    fetchWorkplanRequests();
  } catch (error) {
    console.error("Error declining workplan:", error);

    // Show error toast or notification
    toast.error('Error declining workplan');
  }
};


  return (
    <DefaultLayout pageTitle="Request Approvals">

      <div className="container my-10">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Accordion className='z-10'>
            


        
        {workplanRequests.length === 0 ? 
          <div className="w w-100 w-full">
            <div className="alert alert-dark flex justify-between align-center">
              <h4 className="font-bold text-lg text-decoration-none capitalize">no pending workplan requests waiting your approval</h4>
              <Link className="font-bold text-lg text-decoration-none capitalize" to="/dashboard" title="Home">Dashboard</Link>
            </div>
          </div> : <div className="alert alert-dark flex justify-between align-center">
              <h4 className="font-bold text-lg text-decoration-none capitalize">All Pending Approvals</h4>
              <Link className="font-bold text-lg text-decoration-none capitalize" to="/dashboard" title="Home">Dashboard</Link>
            </div>
        }

            {groupedWorkplanRequests.map((group, index) => (
              <Accordion.Item className="border border-dark shadow-none" eventKey={index.toString()} key={index}>
                <Accordion.Header>{group.requests[0].user_fullname} </Accordion.Header>
                <Accordion.Body key={group.requests[0].workplan_id}>

                  <Table key={index} striped bordered hover>

                  <thead className="table-light">
                          <tr>
                            <th>workplan_day</th>
                            <th>date</th>
                            <th>description</th>
                            <th>destination</th>
                            <th>location</th>
                            <th>logistic</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                    {group.requests.map(request => (
                      <>
                        <tbody className="table-group-divider">
                          <tr className="table-primary text-sm">
                            <td>{request.workplan_day}</td>
                            <td>
                            <Moment format="YYYY/MM/DD">
                            {request.workplan_date} 
            </Moment>

                            </td>
                            <td>{request.description}</td>
                            <td>{request.destination}</td>
                            <td>{request.location}</td>
                            <td>{request.logistic}</td>

                            <td className='flex justify-around my-auto align-center flex-wrap' style={{"display": "table-cell"}}>
                              <button onClick={() => approveWorkplan(request.workplan_id)} className='btn btn-sm m-1 btn-success uppercase'>approve</button>
                            <button className='btn btn-sm m-1 btn-danger uppercase' onClick={() => declineWorkplan(request.workplan_id)}>Decline</button>
                              
                            </td>
                          </tr>
                        </tbody>

                      </>
                    ))}
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}

          </Accordion>
        )}


      </div>
    </DefaultLayout>
  );
}

export default ApproveRequest;
