import React, { useEffect, useMemo, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import WorkplanForm from './WorkplanForm';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import jwtDecode from "jwt-decode";
import { Link } from 'react-router-dom';

function CreateWorkplan() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [existingWorkplan, setExistingWorkplan] = useState(null);
  const [workplanExit, setWorkplanExit] = useState('');
  const [workplanDays, setWorkplanDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state


  const { REACT_APP_AXIOS_URL: url } = process.env;


  const axiosJWT = axios.create();
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const weekAndQuarter = JSON.parse(sessionStorage.getItem('weekAndQuarter'));

  // Use useMemo to memoize the loginUser object
  const loginUser = useMemo(() => ({
    label: `${loggedInUser.fName} ${loggedInUser.lName}`,
    value: loggedInUser.userID,
  }), [loggedInUser.fName, loggedInUser.lName, loggedInUser.userID]); // Only re-create if firstName, lastName, or userID change

  const [selectedTeam, setSelectedTeam] = useState([]);


  useEffect(() => {
    setSelectedTeam([loginUser])
    fetchWorkplanDays();
  }, []);


  useEffect(() => {
    if (loginUser && loginUser.value !== selectedTeam[0]?.value) {
      // Only update if loginUser value is different from the first element in selectedTeam
      setSelectedTeam([loginUser]);
    }
  }, [loginUser, selectedTeam]);




  // console.log(users);


  useEffect(() => {


    const checkWorkplanExists = async (day) => {
      try {
        // Make a request to check if a workplan exists for the selected day
        const response = await axios.get(`${url}/workplans/check/${day}`);

        if (response.data.exists) {
          // Set existingWorkplan to the data of the existing workplan
          setExistingWorkplan(response.data.workplan);
          setWorkplanExit(response.data.exists);

          // console.log(workplanExit);
        } else {
          // If no workplan exists, reset existingWorkplan
          setExistingWorkplan(null);
          // console.log(response.data.exists);
        }
      } catch (error) {
        console.error('Error checking workplan existence:', error);
        // Handle error state or display an error message to the user
      }
    };

    // Check if a workplan exists for the selected day when selectedDay changes
    if (selectedDay) {
      checkWorkplanExists(selectedDay);
    }
  }, [selectedDay, url, workplanExit]);


  // useEffect(() => {
  //   const fetchWorkplanDays = async () => {
  //     try {
  //       const response = await axios.get(`${url}/workplans/days/all`);
  //       setWorkplanDays(response.data);
  //     } catch (error) {
  //       console.error('Error fetching workplan days:', error);
  //     } finally {
  //       setIsLoading(false); // Set loading state to false after fetching
  //     }
  //   };
  //   fetchWorkplanDays();
  // }, []);


  const fetchWorkplanDays = async () => {
    try {
      const response = await axios.get(`${url}/workplans/days/all/${loggedInUser.userID}`);
      setWorkplanDays(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching workplan days:', error);
    }
  };

  // console.log(userID);


  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (day !== 'Monday') {
      setIsFormOpen(true);
    }
  };


  const checkWorkplanExists = async (day) => {
    try {
      // Make a request to check if a workplan exists for the selected day
      const response = await axios.get(`${url}/workplans/check/${day}`);

      if (response.data.exists) {
        // Set existingWorkplan to the data of the existing workplan
        setExistingWorkplan(response.data.workplan);
        setWorkplanExit(response.data.exists);

        // console.log(workplanExit);
      } else {
        // If no workplan exists, reset existingWorkplan
        setExistingWorkplan(null);
        // console.log(response.data.exists);
      }
    } catch (error) {
      console.error('Error checking workplan existence:', error);
      // Handle error state or display an error message to the user
    }
  };


  const handleSubmit = async (formData) => {
    try {
      // Check if implementing_team array is empty
      const implementingTeam = formData.implementing_team.length > 0 ? formData.implementing_team : [formData.user_id];

      const response = await axios.post(`${url}/workplans`, {
        title: formData.title,
        description: formData.description,
        status: 'Pending',
        user_id: formData.user_id,
        workplan_type: formData.workplan_type,
        workplan_day: formData.workplan_day,
        workplan_date: formData.workplan_date,
        destination: formData.destination,
        location: formData.location,
        departure_time: formData.departure_time || '09:00',
        logistic: formData.logistic_required || 'no',
        implementingTeam: implementingTeam,
        authorizer: formData.authorizer,
        user_unit: formData.user_unit,
        workplan_week: weekAndQuarter.week, 
        workplan_quarter: weekAndQuarter.quarter, 
      });

      if (response.status === 201) {
        console.log('Workplan created successfully:', response.data.message);
        // Notify user with success message
        toast.success('Workplan created successfully');
        // Fetch updated list of workplan days
        fetchWorkplanDays();
      } else {
        console.error('Error creating workplan:', response.data.error);
        // Handle error state or display an error message to the user
        toast.error('Error creating workplan');
      }
    } catch (error) {
      console.error('Error creating workplan:', error);
      // Handle error state or display an error message to the user
      toast.error('Failed to create workplan, check your connection');
    }
  };

  const handleClose = async () => {
    setIsFormOpen(false);
  };


  const generateDateForDay = (day) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const daysToAdd = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day) - currentDay;
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);
    return nextDate.toDateString().substring(4); // Extract the date part from the full string
  };

  const isWeekend = () => {
    const dayOfWeek = new Date().getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Check if it's Sunday, Friday, or Saturday
  };

  // console.log(isWeekend());

  return (
    <DefaultLayout pageTitle="Create Workplan">

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      {!isFormOpen ? (
        <div className="container p-0 sm:mx-10 md:mx-10 mt-10">


          {isWeekend() && (
            <div className="alert alert-dark shadow-xl text-dark d-none d-lg-block">
              <div className='flex justify-between'>
                <h4 className="font-bold text-lg">Creating a Weekly Workplan</h4>
                <Link className="font-bold text-lg text-decoration-none capitalize" to="/workplan-status" title="Home">workplan status</Link>
              </div>

              <ul className="list-disc pl-4 mt-2">
                <li className="mb-1 text-black text-sm">To create a workplan for a specific day, click on the corresponding card.</li>
                <li className="mb-1 text-black text-sm">Upon clicking a card, a dedicated workplan form will be presented.</li>
                <li className="mb-1 text-black text-sm">Carefully fill out the required information within the workplan form.</li>
                <li className="mb-1 text-black text-sm">Once completed and saved, the selected day will be removed from the list of available cards, indicating a workplan has been created for that day.</li>
                <li className="mb-1 text-black text-sm">The authorizer will get an instant notifications prompting them to process your request.</li>
              </ul>
            </div>

          )}




          {isLoading ? (
            <div className='container text-center'>Loading workplan days...</div>
          ) : (


            <div className='container p-0'>

              {isWeekend() && (
                <div className="alert alert-dark sm:flex d-flex d-lg-none justify-between align-center lg:hidden">
                  <h4 className="font-bold text-xs lg:text-lg text-decoration-none capitalize">Create Workplan</h4>
                  <Link className="font-bold text-xs lg:text-lg text-decoration-none capitalize" to="/workplan-status" title="Home">workplan status</Link>
                </div>
              )}


              {isWeekend() ? (
                <div className='row'>
                  {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                    .filter(day => !workplanDays.includes(day.toLowerCase()))
                    .map((day, index) => (
                      <div key={index} className={`col-4 col-lg-3`} onClick={() => handleDayClick(day)} >
                        <div className="flex flex-col items-center justify-center p-2 my-2 rounded align-center cursor-pointer hover:bg-green-900 hover:text-white  bg-slate-300">
                          <h2 className="text-sm lg:text-xl font-semibold capitalize">{day}</h2>
                          <p className="text-xs lg:text-xl text-center">{generateDateForDay(day)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center flex justify-center flex-wrap alert alert-danger font-bold mt-5">
                  {/* <p className='d-none d-sm-block m-0'><i className="fa-solid fa-triangle-exclamation fa-xl"></i></p> */}
                  <p className="col-12 col-lg-6 m-0 text-xs lg:text-xl">Workplans cannot be created on active working days</p>
                </div>
              )}
            </div>

          )}
        </div>
      ) : (
        <div className="d d-none"></div>
      )}

<div className='container'>
  
      {isFormOpen && (
        <WorkplanForm
          day={selectedDay}
          existingWorkplan={existingWorkplan}
          onSubmit={handleSubmit}
          handleClose={handleClose}
          currentUserId={loginUser.value}
        // formToggle={!isFormOpen}
        />
      )}

</div>

    </DefaultLayout>
  );






}

export default CreateWorkplan;


