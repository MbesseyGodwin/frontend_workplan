import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Accordion, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to dynamically generate table headers based on JSON keys, excluding specified keys
const generateTableHeaders = (tasks, excludedKeys) => {
  if (!tasks.length) return null;
  const sampleTask = tasks[0];
  return Object.keys(sampleTask).map((key, index) => {
    if (!excludedKeys.includes(key)) {
      return <th className='text-xs' key={index}>{capitalizeFirstLetter(key)}</th>;
    }
    return null;
  });
};

// Function to generate table rows, excluding specified keys and formatting dates
const generateTableRows = (task, excludedKeys) => {
  // Function to format date string into a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return Object.entries(task).map(([key, value], index) => {
    if (!excludedKeys.includes(key)) {
      // Check if the value is a date field and format it
      const formattedValue = key.includes('date') ? formatDate(value) : value;
      return <td className='text-xs' key={index}>{formattedValue}</td>;
    }
    return null;
  });
};



const { REACT_APP_AXIOS_URL: url } = process.env;


// DayAccordion component to render the accordion for each day, grouped by user_unit and excluding specified keys
// DayAccordion component to render the accordion for each day, grouped by user_unit and excluding specified keys
const DayAccordion = ({ day, tasks, excludedKeys, onApprove }) => {
  // Group tasks by user_unit
  const groupedByUserUnit = groupByUserUnit(tasks);

  // Function to approve a workplan and push it to Francis Agim for vehicle allocation
  const approveAndAllocateVehicle = async (workplanId) => {
    try {
      // Make a PUT request to your backend API endpoint to approve the workplan
      await axios.put(`${url}/workplans/collate/${workplanId}`, { Workplan_id: workplanId });

      // Once the workplan is approved, push it to Francis Agim for vehicle allocation

      // Notify user with success message
      toast.success('Workplan Approved successfully');
      // Once the workplan is approved, call the onApprove callback function to refresh the UI
      onApprove();
      // You can use another API endpoint or method to handle this process
      console.log(`Workplan ${workplanId} approved and allocated for vehicle`);
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error approving workplan and allocating vehicle:', error);
      toast.error('Workplan Approval Failed');
    }
  };

  return (
    <Accordion.Item className='shadow-none rounded-none' eventKey={day}>
      <Accordion.Header className='border border-dark shadow-none'>{day}</Accordion.Header>
      <Accordion.Body>

        {/* Map through tasks grouped by user_unit */}
        {Object.entries(groupedByUserUnit).map(([unit, unitTasks], unitIndex) => {
          // Calculate the total number of workplans for the current unit
          const totalWorkplans = unitTasks.length;

          return (
            <div key={unitIndex}>

              <h6 className="font-bold text-sm mb-0 uppercase">{unit} <span className='badge bg-red-800 mb-1'>{totalWorkplans}</span></h6>

              <Table className='border border-dark' bordered hover>
                <thead>
                  <tr>
                    {/* Generate table headers excluding specified keys */}
                    {generateTableHeaders(unitTasks, excludedKeys)}
                    {/* Add a header for the approve button */}
                    <th className='text-xs'>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Map through unitTasks and render table rows */}
                  {unitTasks.map((task, index) => (
                    <tr key={index}>
                      {/* Generate table rows excluding specified keys */}
                      {generateTableRows(task, excludedKeys)}
                      {/* Add a button to approve the workplan and allocate vehicle */}
                      <td className='text-xs'>
                        <button className='btn btn-success btn-sm' onClick={() => approveAndAllocateVehicle(task.workplan_id)}>Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          );
        })}
      </Accordion.Body>
    </Accordion.Item>
  );
};


function CollateWorkplan() {
  const { REACT_APP_AXIOS_URL: url } = process.env;
  const [workplanCollate, setWorkplanCollate] = useState([]); // State for storing workplan requests
  const [loading, setLoading] = useState(true); // State for tracking loading status

  // Fetch workplan requests on component mount
  useEffect(() => {
    fetchWorkplanCollate();
  }, []);

  // Function to fetch workplan requests
  const fetchWorkplanCollate = async () => {
    try {
      const response = await axios.get(`${url}/workplans/collate/all`);
      setWorkplanCollate(response.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching workplan requests:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  // Function to refresh the UI when a workplan is approved
  const handleApprove = () => {
    // Refetch the workplan data to update the UI
    fetchWorkplanCollate();
  };

  // Group workplans by day
  const groupedWorkplans = workplanCollate.reduce((acc, workplan) => {
    const { workplan_day } = workplan;
    if (!acc[workplan_day]) {
      acc[workplan_day] = [];
    }
    acc[workplan_day].push(workplan);
    return acc;
  }, {});

  // console.log(workplanCollate);

  const excludedKeys = ['workplan_id', 'workplan_day', 'status', 'title', 'is_unit', 'is_srt', 'is_dept', 'creation_date', 'workplan_week_id', 'vehicle_id', 'assigned_pilot_id', 'approval_date', 'decline_date', 'decline_reason', 'implementing_team_id', 'user_unit', 'pilot_name', 'vehicle_name']

  // Calculate the total number of workplans
  const totalWorkplans = Object.values(groupedWorkplans).reduce((total, tasks) => total + tasks.length, 0);

  return (
    <DefaultLayout pageTitle="Collate Weekly Workplan">

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div className="container w-full mx-auto mt-10">
        <div className="alert alert-dark flex justify-between align-center">
          {/* Display the total number of workplans */}
          <h5 className="font-bold capitalize hidden lg:flex">Total Workplans: <span className='mx-1 badge bg-red-800 text-2xl'>{totalWorkplans}</span> </h5>
          <h5 className="font-bold capitalize hidden lg:flex"><Link className="font-bold text-decoration-none mb-0" to="/dashboard" title="Home"> dashboard</Link></h5>
        </div>

        <Accordion defaultActiveKey="0">
          {/* Map through groupedWorkplans and render accordion for each day */}
          {Object.entries(groupedWorkplans).map(([day, tasks], index) => (
            <DayAccordion key={index} day={day} tasks={tasks} excludedKeys={excludedKeys} onApprove={handleApprove} />
          ))}
        </Accordion>
      </div>
    </DefaultLayout>
  );
}

// Function to group tasks by user_unit
const groupByUserUnit = (tasks) => {
  return tasks.reduce((acc, task) => {
    const { user_unit } = task;
    if (!acc[user_unit]) {
      acc[user_unit] = [];
    }
    acc[user_unit].push(task);
    return acc;
  }, {});
}

export default CollateWorkplan;