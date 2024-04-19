import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Accordion, Table, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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
const generateTableRows = (task, excludedKeys, onInputChange) => {
    // Function to format date string into a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return Object.entries(task).map(([key, value], index) => {
        if (!excludedKeys.includes(key)) {
            // Check if the value is a date field and format it
            const formattedValue = key.includes('date') ? formatDate(value) : value;
            // If the key is vehicle_name or pilot_name, render an input box
            if (key === 'vehicle_name' || key === 'pilot_name') {
                return (
                    <td className='text-xs' key={index}>
                        <input
                            type="text"
                            value={formattedValue}
                            onChange={(e) => onInputChange(key, e.target.value)}
                            className="form-control form-control-sm"
                        />
                    </td>
                );
            } else {
                return <td className='text-xs' key={index}>{formattedValue}</td>;
            }
        }
        return null;
    });
};



const { REACT_APP_AXIOS_URL: url } = process.env;

// DayAccordion component to render the accordion for each day, grouped by user_unit and excluding specified keys
const DayAccordion = ({ day, tasks, excludedKeys, onApprove }) => {
    // Group tasks by user_unit
    const groupedByUserUnit = groupByUserUnit(tasks);

    // State to manage input values for vehicle_name and pilot_name
    const [inputValues, setInputValues] = useState({});

    // Mock arrays of vehicle and pilot options (replace with actual data)
    const vehicleOptions = ['', 'Toyota Corolla', 'Honda Accord', 'Mercedes Benz C-Class', 'Nissan Pathfinder', 'Lexus RX', 'Ford Explorer', 'Volkswagen Golf', 'Hyundai Sonata', 'Kia SUV'];
    const pilotOptions = ['', 'Abdullahi Ahmed', 'Blessing Adeyemi', 'Chukwudi Eze', 'Fatima Ibrahim', 'Gbenga Adekunle', 'Hassan Bello', 'Ifeoma Okonkwo', 'Jide Oluwatosin', 'Kemi Adeleke'];

    // Function to approve a workplan and push it to Francis Agim for vehicle allocation
    const approveAndAllocateVehicle = async (workplanId, vehicleName, pilotName) => {
        try {
            // Make a PUT request to your backend API endpoint to approve the workplan
            await axios.put(`${url}/workplans/allocate/${workplanId}`, {
                Workplan_id: workplanId,
                vehicle_name: vehicleName,
                pilot_name: pilotName
            });

            // Notify user with success message
            toast.success('Vehicle and pilot allocated successfully');

            // Once the workplan is approved, call the onApprove callback function to refresh the UI
            onApprove();

            // You can use another API endpoint or method to handle this process
            console.log('Vehicle and pilot allocated successfully');
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error allocating pilot and allocating vehicle:', error);
            toast.error('Vehicle and pilot allocation failed');
        }
    };

    // Function to handle input changes for vehicle_name and pilot_name
    const handleInputChange = (workplanId, key, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [workplanId]: {
                ...prevState[workplanId],
                [key]: value
            }
        }));
    };



    
    return (
        // i removed eventKey={day} from the Accordion.Item, this will enable francis to open multiple accordion at once. so that he can see every request at once
        <Accordion.Item className='shadow-none rounded-none'> 
            <Accordion.Header className='border border-dark shadow-none'>{day}</Accordion.Header>
            <Accordion.Body className='border border-dark shadow-none'>
                {/* Map through tasks grouped by user_unit */}
                {Object.entries(groupedByUserUnit).map(([unit, unitTasks], unitIndex) => {
                    // Calculate the total number of workplans for the current unit
                    const totalWorkplans = unitTasks.length;

                    return (
                        <div key={unitIndex}>
                            <h6 className="font-bold text-sm mb-0 uppercase">
                                {unit} <span className='badge bg-red-800 mb-1'>{totalWorkplans}</span>
                            </h6>

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
                                            
                                            {/* Generate table rows including select dropdowns for vehicle_name and pilot_name */}
                                            {Object.entries(task).map(([key, value], columnIndex) => (
                                                !excludedKeys.includes(key) && (
                                                    <td key={columnIndex} className='text-xs'>
                                                        {key === 'vehicle_name' || key === 'pilot_name' ? (
                                                            <select
                                                                value={inputValues[task.workplan_id]?.[key] || value}
                                                                onChange={(e) => handleInputChange(task.workplan_id, key, e.target.value)}
                                                                className="block w-full p-1 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            >
                                                                {/* Map over options and generate <option> elements */}
                                                                {key === 'vehicle_name' ? (
                                                                    vehicleOptions.map((option, optionIndex) => (
                                                                        <option className='text-xs' key={optionIndex} value={option}>{option}</option>
                                                                    ))
                                                                ) : (
                                                                    pilotOptions.map((option, optionIndex) => (
                                                                        <option className='text-xs' key={optionIndex} value={option}>{option}</option>
                                                                    ))
                                                                )}
                                                            </select>
                                                        ) : (
                                                            value // Render other fields as plain text
                                                        )}
                                                    </td>
                                                )
                                            ))}

                                            {/* Add a button to approve the workplan and allocate vehicle */}
                                            <td className='text-xs'>
                                                <button className='btn small btn-success btn-sm' onClick={() => approveAndAllocateVehicle(task.workplan_id, inputValues[task.workplan_id]?.vehicle_name || task.vehicle_name, inputValues[task.workplan_id]?.pilot_name || task.pilot_name)}> <i className="fa-solid fa-truck"></i> Assign</button>
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


    const excludedKeys = ['user_id', 'workplan_id', 'workplan_day', 'status', 'description', 'title', 'is_unit', 'is_srt', 'is_dept', 'creation_date', 'workplan_week_id', 'vehicle_id', 'assigned_pilot_id', 'approval_date', 'decline_date', 'decline_reason', 'implementing_team_id', 'user_unit', 'workplan_week', 'workplan_quarter', 'report_status']

    // Calculate the total number of workplans
    const totalWorkplans = Object.values(groupedWorkplans).reduce((total, tasks) => total + tasks.length, 0);

    return (
        <DefaultLayout pageTitle="Assign Vehicle and Pilot">

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="container-fluid px-5 my-10">
                <div className="alert alert-dark flex justify-between align-center">
                    {/* Display the total number of workplans */}
                    <h5 className="font-bold capitalize hidden lg:flex">Vehicle Requests: <span className='mx-1 badge bg-red-800 text-2xl'>{totalWorkplans}</span> </h5>
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