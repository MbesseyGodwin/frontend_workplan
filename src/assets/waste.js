import React, { useState } from 'react';
import { Accordion, Table, Button } from 'react-bootstrap'; // Assuming you are using Bootstrap components
import axios from 'axios'; // Import axios for API calls

import PromptComponent from './PromptComponent'; // Adjust the path as per your project structure

const DayAccordion = ({ day, tasks, excludedKeys, onApprove }) => {
    const [showModal, setShowModal] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    // Group tasks by user_unit
    const groupedByUserUnit = groupByUserUnit(tasks);


    const handlePromptConfirm = (value) => {
        setVehicleName(value);
        setShowModal(false); // Hide the prompt modal after confirming
        // Once the vehicle name is confirmed, proceed to allocate the vehicle
        allocateVehicle();
    };
    
    const handlePromptCancel = () => {
        setShowModal(false); // Hide the prompt modal if canceled
    };

    const allocateVehicle = async () => {
        try {
            // Ensure vehicle name is not empty
            if (!vehicleName) {
                console.error('Vehicle name is required');
                return;
            }

            // Perform the API call to allocate the vehicle
            // Replace the URL and payload with your actual API endpoint and data structure
            await axios.put(`${url}/workplans/allocate/${selectedTask.workplan_id}`, {
                Workplan_id: selectedTask.workplan_id,
                vehicle_name: vehicleName,
                pilot_name: driverName // Assuming you also capture driver name somewhere
            });

            // Notify user with success message
            toast.success('Vehicle allocated successfully');
            
            // Once the workplan is approved, call the onApprove callback function to refresh the UI
            onApprove();
        } catch (error) {
            console.error('Error allocating vehicle:', error);
            toast.error('Failed to allocate vehicle');
        }
    };

    const approveAndPromptVehicle = (task) => {
        setSelectedTask(task);
        setShowModal(true); // Display the prompt modal
    };

    return (
        <>
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
                                                {/* Add a button to approve the workplan and prompt for vehicle allocation */}
                                                <td className='text-xs'>
                                                    <Button variant='success' size='sm' onClick={() => approveAndPromptVehicle(task)}>Assign</Button>
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

            {/* Render the PromptComponent modal */}
            {showModal && (
                <PromptComponent
                    message="Please enter the vehicle name:"
                    defaultValue=""
                    onConfirm={handlePromptConfirm}
                    onCancel={handlePromptCancel}
                />
            )}
        </>
    );
};

export default DayAccordion;
import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Accordion, Table, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

import PromptComponent from '../custom/PromptComponent';

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
const DayAccordion = ({ day, tasks, excludedKeys, onApprove }) => {
    const [showModal, setShowModal] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    // Group tasks by user_unit
    const groupedByUserUnit = groupByUserUnit(tasks);


    const handlePromptConfirm = (value) => {
        setVehicleName(value);
        // setDriverName('okon')
        setShowModal(false); // Hide the prompt modal after confirming
        // Once the vehicle name is confirmed, proceed to allocate the vehicle
        allocateVehicle();
    };
    
    const handlePromptCancel = () => {
        setShowModal(false); // Hide the prompt modal if canceled
    };

    const allocateVehicle = async () => {
        try {
            // Ensure vehicle name is not empty
            if (!vehicleName) {
                console.error('Vehicle name is required');
                return;
            }

            // Perform the API call to allocate the vehicle
            // Replace the URL and payload with your actual API endpoint and data structure
            await axios.put(`${url}/workplans/allocate/${selectedTask.workplan_id}`, {
                Workplan_id: selectedTask.workplan_id,
                vehicle_name: vehicleName,
                pilot_name: driverName // Assuming you also capture driver name somewhere
            });

            // Notify user with success message
            toast.success('Vehicle allocated successfully');
            
            // Once the workplan is approved, call the onApprove callback function to refresh the UI
            onApprove();
        } catch (error) {
            console.error('Error allocating vehicle:', error);
            toast.error('Failed to allocate vehicle');
        }
    };

    const approveAndPromptVehicle = (task) => {
        setSelectedTask(task);
        setShowModal(true); // Display the prompt modal
    };

    return (
        <>
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
                                                {/* Add a button to approve the workplan and prompt for vehicle allocation */}
                                                <td className='text-xs'>
                                                    <Button variant='success' size='sm' onClick={() => approveAndPromptVehicle(task)}>Assign</Button>
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

            {/* Render the PromptComponent modal */}
            {showModal && (
                <PromptComponent
                    message="Please enter the vehicle name:"
                    defaultValue=""
                    onConfirm={handlePromptConfirm}
                    onCancel={handlePromptCancel}
                />
            )}
        </>
    );
};


function AssignVehicle() {
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
            const response = await axios.get(`${url}/workplans/allocate/all`);
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


    const excludedKeys = ['workplan_id', 'workplan_day', 'status', 'description', 'title', 'is_unit', 'is_srt', 'is_dept', 'creation_date', 'workplan_week_id', 'vehicle_id', 'assigned_pilot_id', 'approval_date', 'decline_date', 'decline_reason', 'implementing_team_id', 'user_unit']

    // Calculate the total number of workplans
    const totalWorkplans = Object.values(groupedWorkplans).reduce((total, tasks) => total + tasks.length, 0);

    return (
        <DefaultLayout pageTitle="Assign Vehicle and Pilot">

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="container w-full mx-auto mt-10">
                <div className="alert alert-dark flex justify-between align-center">
                    {/* Display the total number of workplans */}
                    <h5 className="font-bold capitalize hidden lg:flex">Vehicle Requests: <span className='mx-1 badge bg-red-800 text-2xl'>{totalWorkplans}</span> </h5>
                    <h5 className="font-bold capitalize text-xs">remember to implement api for vehicle and pilot assignment tomorrow</h5>
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

export default AssignVehicle;







// this is the first stage of approval. unit member sends to surpervisor for approval
const approveWorkplanByUserId = (req, res) => {

    const { Workplan_id } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date and time
  
    const sqlQuery = `UPDATE Workplan SET status = "Approved", authorizer = 43, approval_date = ? WHERE Workplan_id = ?`;
  
    // Query the database to update the status of pending workplans
    connection.query(sqlQuery, [currentDate, Workplan_id], (error, results, fields) => {
      if (error) {
        console.error('Error updating workplans:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      if (results.affectedRows === 0) {
        // If no workplans were updated, it means there were no pending workplans
        return res.status(404).json({ message: 'No pending workplans found for the Workplan ID' });
      }
  
      // Get user details for approved workplan(s) (assuming user_id is available in workplan object)
      const approvedWorkplans = results.map(workplan => ({
        user_email: workplan.user_email, // Assuming user email is a field in the workplan object
        Workplan_id: workplan.Workplan_id
      }));
  
      // Send email notification for each approved workplan
      approvedWorkplans.forEach(workplan => {
        const emailContent = `Your workplan (ID: ${workplan.Workplan_id}) has been approved on ${currentDate}.`;
        sendEmailNotification(workplan.user_email, emailContent);
      });
  
      // Send a success response with the number of workplans updated
      res.status(200).json({ message: `Approved ${results.affectedRows} workplan(s)` });
    });
  };