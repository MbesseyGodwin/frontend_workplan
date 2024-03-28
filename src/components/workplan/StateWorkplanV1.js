import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Accordion, Table } from 'react-bootstrap'; // Assuming you're using Bootstrap for styling
import workplanData from './workplanData.json';
import "./StateWorkplan.css"
import BreadCrumb from '../../helpers/breadcrumb/BreadCrumb';
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

// DayAccordion component to render the accordion for each day
const DayAccordion = ({ day, tasks }) => (
  <Accordion.Item className='shadow-none' eventKey={day}>
    <Accordion.Header className='border border-dark shadow-none'>{day}</Accordion.Header>
    <Accordion.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            {generateTableHeaders(tasks)}
          </tr>
        </thead>
        <tbody>
          {/* Map through tasks and render table rows */}
          {tasks.map((task, index) => (
            <tr key={index}>
              {Object.values(task).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Accordion.Body>
  </Accordion.Item>
);

function StateWorkplan() {
  return (
    <DefaultLayout pageTitle="State Workplan">
      <div className="container w-full mx-auto mt-10">

        <div className="alert alert-dark flex justify-between align-center">
          {/* use the workplan week in the database to show the week */}
          <h4 className="font-bold text-lg uppercase">state: <span className='text-red-900'>Abia </span></h4> 

          <h4 className="font-bold text-lg uppercase hidden lg:block">week: <span className='text-red-900'>21 </span></h4> 

          <h4 className="font-bold text-lg uppercase hidden lg:block">Fiscal year: <span className='text-red-900'>2024 (Q3) </span></h4> 

          <h4 className="font-bold text-lg uppercase hidden lg:block" >Duration: <span className='text-red-900'>24-03-2024 - 30-03-2024</span></h4> 

          <Link className="font-bold text-lg text-decoration-none uppercase" to="/dashboard" title="Home">dashboard</Link>
        </div>

        {/* <BreadCrumb /> */}
        <Accordion defaultActiveKey="0">
          {/* Map through workplanData and render DayAccordion for each day */}
          {Object.entries(workplanData).map(([day, tasks], index) => (
            <DayAccordion key={index} day={day} tasks={tasks} />
          ))}
        </Accordion>
      </div>
    </DefaultLayout>
  );
}

export default StateWorkplan;
