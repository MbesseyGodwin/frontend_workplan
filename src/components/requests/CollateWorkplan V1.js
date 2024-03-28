import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Accordion, Table } from 'react-bootstrap';
import axios from 'axios';
import { getNextMonday, CountdownTimer } from './TimeEffect/CountdownTimer';
import { Link } from 'react-router-dom';

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to dynamically generate table headers based on JSON keys
const generateTableHeaders = (tasks) => {
  if (!tasks.length) return null;
  const sampleTask = tasks[0];
  return Object.keys(sampleTask).map((key, index) => (
    <th key={index}>{capitalizeFirstLetter(key)}</th>
  ));
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

  // Group workplans by day
  const groupedWorkplans = workplanCollate.reduce((acc, workplan) => {
    const { workplan_day } = workplan;
    if (!acc[workplan_day]) {
      acc[workplan_day] = [];
    }
    acc[workplan_day].push(workplan);
    return acc;
  }, {});

  // console.log(groupedWorkplans);

  // Get next Monday
  const today = new Date();
  const deadline = getNextMonday(today);

  return (
    <DefaultLayout pageTitle="Collate Weekly Workplan">
      <div className="w-full mx-auto mt-10">
        <div className="alert alert-dark flex justify-between align-center">
          <h5 className="font-bold uppercase hidden lg:flex">Deadline: <span className='text-red-900 badge bg-dark mx-1'><CountdownTimer deadline={deadline} /></span></h5>
          <h5 className="font-bold uppercase hidden lg:flex"><Link className="font-bold badge bg-dark text-decoration-none uppercase mb-0" to="/dashboard" title="Home"> <i className="fa-solid fa-home"></i> Home</Link></h5>
        </div>

        <Accordion defaultActiveKey="0">
          {/* Map through groupedWorkplans and render accordion for each day */}
          {Object.entries(groupedWorkplans).map(([day, tasks], index) => (
            <Accordion.Item key={index} eventKey={day}>
              <Accordion.Header className='border border-dark shadow-none'>{day}</Accordion.Header>
              <Accordion.Body>
                {/* Second level grouping by user_unit */}
                {Object.entries(groupByUserUnit(tasks)).map(([unit, unitTasks]) => (
                  <div key={unit}>
                    <h5 className="font-bold">{unit}</h5>
                    <Table className='table table-bordered table-light' bordered hover>
                      <thead>
                        <tr>
                          {generateTableHeaders(unitTasks)}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map through unitTasks and render table rows */}
                        {unitTasks.map((task, index) => (
                          <tr key={index}>
                            {Object.values(task).map((value, index) => (
                              <td key={index}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
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