import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import jwtDecode from "jwt-decode";
import { MultiSelect } from "react-multi-select-component";
import RichTextEditor from './RichTextEditor';

const WorkplanForm = ({ day, existingWorkplan, onSubmit, handleClose, currentUserId, formToggle }) => {


  const { REACT_APP_AXIOS_URL: url } = process.env;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userID, setUserID] = useState('');

  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  // console.log(loggedInUser);

  // Function to generate the date for the selected day
  // Function to generate the date for the selected day
  const generateDateForDay = (day) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const daysToAdd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day) - currentDay;
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);

    // Get the year, month, and day components
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const dayOfMonth = String(nextDate.getDate()).padStart(2, '0');

    // Return the date in the desired format "YYYY-MM-DD"
    return `${year}-${month}-${dayOfMonth}`;
  };


  // State for managing workplan data
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${url}/token`);
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setFirstName(decoded.fName);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        // navigate('/', { replace: true });
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();

    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${url}/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setFirstName(decoded.fName);
      setLastName(decoded.lName);
      setUserID(decoded.userID)
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });


  // Use useMemo to memoize the loginUser object
  const loginUser = useMemo(() => ({
    label: `${firstName} ${lastName}`,
    value: userID,
  }), [firstName, lastName, userID]); // Only re-create if firstName, lastName, or userID change


  const [users, setUsers] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState([]);


  useEffect(() => {
    refreshToken();
    fetchUsers();
    setSelectedTeam([loginUser])
  }, []);


  useEffect(() => {
    if (loginUser && loginUser.value !== selectedTeam[0]?.value) {
      // Only update if loginUser value is different from the first element in selectedTeam
      setSelectedTeam([loginUser]);
    }
  }, [loginUser, selectedTeam]);



  const fetchUsers = async () => {
    try {
      const response = await axiosJWT.get(`${url}/users`); // Assuming this is the correct endpoint for fetching users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  // console.log(users);




  const workplanTypes = ["individual", "unit", "department", "srt"];
  const logisticRequired = ['yes', 'no'];

  const [workplanData, setWorkplanData] = useState({
    user_id: currentUserId,
    title: `workplan for ${day}`,
    workplan_type: 1,
    workplan_day: day,
    workplan_date: generateDateForDay(day),
    destination: 'dmmm',
    location: 'ahieke',
    departure_time: '09:00',
    logistic_required: "no",
    description: 'for folder auditing',
    implementing_team: [],
    authorizer: '',
    user_unit: loggedInUser.user_unit
  });

  useEffect(() => {
    // Update workplanData with actual userID on component mount
    setWorkplanData(prevData => ({
      ...prevData,
      userID: userID // Replace actualUserID with the actual user ID variable
    }));
  }, []);




  const options = users.map(user => ({
    label: `${user.first_name} ${user.last_name}`, // Assuming you have firstName and lastName properties in your user object
    value: user.user_id // Assuming you have an id property in your user object
  }));

  const handleTeamSelection = selectedOptions => {
    setSelectedTeam(selectedOptions);
    const teamIds = selectedOptions.map(option => option.value);
    setWorkplanData({ ...workplanData, implementing_team: teamIds });
  };

  // Function to remove a specific user from the selected team
  const removeUserFromTeam = (userIdToRemove) => {
    setSelectedTeam(selectedTeam.filter(user => user.value !== userIdToRemove));
  };





  // const options = [
  //   { value: 1, label: "onyedikachi ezeobi" },
  //   { value: 2, label: "agaba mohammed" },
  //   { value: 3, label: "shittu muliq" },
  //   { value: 4, label: "mbessey godwin" },
  //   { value: 5, label: "nelson attah" },
  //   { value: 6, label: "Ngozi Okonjo-Iweala" },
  //   { value: 7, label: "Chinedu Echeruo" },
  //   { value: 8, label: "Folorunso Alakija" },
  //   { value: 9, label: "Aliko Dangote" },
  //   { value: 10, label: "Bola Tinubu" },
  //   { value: 11, label: "Obiageli Ezekwesili" },
  //   { value: 12, label: "Hakeem Olajuwon" },
  //   { value: 13, label: "Joke Silva" },
  //   { value: 14, label: "Emmanuel Acho" },
  //   { value: 15, label: "Toyin Falola" }
  // ]

  const availableUsers = [
    { value: 1, label: "onyedikachi ezeobi" },
    { value: 2, label: "agaba mohammed" },
    { value: 3, label: "shittu muliq" },
    { value: 4, label: "mbessey godwin" },
    { value: 5, label: "nelson attah" },
  ]

  const [selected, setSelected] = useState([]);

  // Effect to update workplanData if existingWorkplan changes
  useEffect(() => {
    if (existingWorkplan) {
      setWorkplanData(existingWorkplan);
    }
  }, [existingWorkplan]);

  // const handleRemoveOption = (optionToRemove) => {
  //   setSelected(selected.filter((option) => option.value !== optionToRemove.value));
  // };

  // const renderSelectedOptions = () => {
  //   return selected.map((option) => (
  //     <div key={option.value} className="selected-option">
  //       {option.label}
  //       <button
  //         className="remove-button btn-sm btn p-0 btn-danger mx-2"
  //         onClick={() => handleRemoveOption(option)}
  //       >
  //         X
  //       </button>
  //     </div>
  //   ));
  // };


  // State for managing user search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for managing selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkplanData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(workplanData); // Pass the workplanData object to the onSubmit function
    // Reset form data after submission
    // window.alert('Workplan created successfully');
    handleClose(); // Close the form after submission

  };



  // const handleCloseForm = (e) => {
  //   setWorkplanData({
  //     task: '',
  //     time: '',
  //     workplan_type: ["", "individual", "unit", "department", "srt"],
  //     workplan_day: day,
  //     workplan_date: generateDateForDay(day),
  //     destination: '',
  //     location: '',
  //     departure_time: '09:00',
  //     logistic_required: ["", "no", "yes", "accomodation"],
  //     description: '',
  //     implementing_team: selected
  //   });
  // }

  // Function to handle selecting a user from the list
  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery(''); // Clear the search query
  };

  // Function to handle removal of a user from the implementing team
  const handleRemoveUser = (userIdToRemove) => {
    setWorkplanData(prevData => ({
      ...prevData,
      implementing_team: prevData.implementing_team.filter(user => user.id !== userIdToRemove)
    }));
  };

  // Function to handle description change
  const handleDescriptionChange = (description) => {
    setWorkplanData({ ...workplanData, description });
  };

  // Function to render the list of available users based on the search query
  const renderUserList = () => {
    // Only render the list of available users if there's a search query
    if (searchQuery.trim() === '') {
      return null;
    }

    const filteredUsers = availableUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render the dropdown list of filtered users
    return (
      <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
        <ul className="py-1">
          {filteredUsers.map(user => (
            <li key={user.id} className="cursor-pointer btn btn-primary px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleSelectUser(user)}>
              {user.name}

              {/* Add a button to remove the selected user */}
              <button
                type="button"
                className="btn btn-danger mx-2"
                onClick={() => handleRemoveUser(user.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Function to render the list of selected users in the text area box
  const renderSelectedUsers = () => {
    // Function to render the list of selected users in the text area box
    return selectedUsers.map(user => (
      <span key={user.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {user.name}
        {/* Button to remove the selected user */}
        <button
          type="button"
          className="ml-1 text-red-600 hover:text-red-800 focus:outline-none"
          onClick={() => handleRemoveUser(user.id)}
        >
          X
        </button>
      </span>
    ));
  };


  return (
    <div className="bg-slate-400 container mx-auto px-3 pt-3 mt-4 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-3 capitalize underline">Create Workplan for {day}</h1>

      <form onSubmit={handleSubmit}>
        <div className='row'>


          {/* Input for workplan type */}
          <div className="form-group col-3 mb-3">
            <label htmlFor="workplan_type" className='block text-gray-700 font-semibold text-sm uppercase'>Workplan Type: </label>
            <select
              className="form-control shadow-none form-input w-full border border-dark"
              required
              name="workplan_type"
              id="workplan_type"
              value={workplanData.workplan_type} // Set the selected value
              onChange={(e) => setWorkplanData({ ...workplanData, workplan_type: parseInt(e.target.value) })} // Parse the value to an integer
            >
              {workplanTypes.map((type, index) => (
                <option key={index} value={index + 1}>{type}</option> // Use index + 1 as value
              ))}
            </select>
          </div>


          {/* Input for workplan day */}
          <div className="col-3 mb-3">
            <label htmlFor="task" className="block text-gray-700 font-semibold text-sm uppercase">Workplan Day:</label>
            <input type="text" id="" name="" readOnly value={workplanData.workplan_day} onChange={handleChange} className="form-control lowercase shadow-none form-input w-full border border-dark" />
          </div>


          {/* Input for user id */}
          {/* <div className="col-3 mb-3">
            <label htmlFor="userID" className="block text-gray-700 font-semibold text-sm uppercase">user id:</label>
            <input type="text" id="" name="" readOnly value={workplanData.user_id} onChange={handleChange} className="form-control lowercase shadow-none form-input w-full border border-dark" />
          </div> */}


          {/* Input for workplan date */}
          <div className="col-3 mb-3">
            <label htmlFor="" className="block text-gray-700 font-semibold text-sm uppercase">Workplan Date:</label>
            <input type="text" id="" name="" readOnly required value={workplanData.workplan_date} onChange={handleChange} className="form-control shadow-none form-input w-full border border-dark" />
          </div>


          {/* Input for destination */}
          <div className="col-3 mb-3">
            <label htmlFor="" className="block text-gray-700 font-semibold text-sm uppercase">Destination:</label>
            <input type="text" id="destination" autoComplete='off' name="destination" required value={workplanData.destination} onChange={handleChange} className="form-control shadow-none form-input w-full border border-dark" />
          </div>


          {/* Input for location */}
          <div className="col-3 mb-3">
            <label htmlFor="" className="block text-gray-700 font-semibold text-sm uppercase">Location:</label>
            <input type="text" id="location" name="location" required value={workplanData.location} onChange={handleChange} className="form-control shadow-none form-input w-full border border-dark" />
          </div>



          {/* Select for authorizer */}
          <div className="col-3 mb-3">
            <label htmlFor="authorizer" className="block text-gray-700 font-semibold text-sm uppercase">authorizer:</label>

            <select
              id="authorizeBySelect"
              value={workplanData.authorizer}
              onChange={(e) => setWorkplanData({ ...workplanData, authorizer: e.target.value })}
              className="form-control shadow-none form-input w-full border border-dark"
              required
            >
              <option value="">Select Supervisor</option>
              {users.map((user) => (
                <option className='form-control' key={user.user_id} value={user.user_id}>{`${user.first_name} ${user.last_name}`}</option>
              ))}
            </select>
          </div>


          {/* Input for departure time */}
          <div className="col-3 mb-3">
            <label htmlFor="" className="block text-gray-700 font-semibold text-sm uppercase">Departure Time:</label>
            <input type='time' id="departure_time" name="departure_time" required value={workplanData.departure_time} onChange={handleChange} className="form-control shadow-none form-input w-full border border-dark" />
          </div>




          {/* Input for logistic required */}
          <div className="form-group col-3 mb-3">
            <label htmlFor="logistic" className='block text-gray-700 font-semibold text-sm uppercase'>Logistic Required:</label>
            
            <select
              className="form-control shadow-none form-input w-full border border-dark"
              required
              name="logistic"
              id="logistic"
              value={workplanData.logistic_required}
              onChange={(e) => setWorkplanData({ ...workplanData, logistic_required: e.target.value })}
            >
              {logisticRequired.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>






          {/* MultiSelect component for selecting team members */}
          <div className="form-group col-12 mb-3">
            <label htmlFor="implementing_team" className="block text-gray-700 font-semibold text-sm uppercase">Implementing Team:</label>
            <MultiSelect
              options={options}
              value={selectedTeam}
              onChange={handleTeamSelection}
              labelledBy="Select"
              overrideStrings={{ selectSomeItems: 'Select Team Members...' }}
              className="shadow-none form-input w-full border rounded border-dark"
            />

            {/* Render the selected team members with remove buttons */}
            <div className="alert alert-dark p-1 flex flex-wrap space-x-2">
              {selectedTeam.map(user => (
                <div className="selected-team-member bg-success text-white px-2 py-1 m-1 rounded flex items-center space-x-2" key={user.value}>
                  <span className='text-sm text-white'>{user.label}</span>
                  <button className="btn-remove text-sm btn btn-sm p-0 btn-danger hover:bg-green-600" onClick={() => removeUserFromTeam(user.value)}>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10L4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>







          <div className="col-12 mb-3">
            <label htmlFor="" className="block text-gray-700 font-semibold text-sm uppercase">Task Description:</label>
            <textarea
              rows={10}
              cols={5}
              className="form-control shadow-none form-input w-full border border-dark"
              value={workplanData.description}
              onChange={(e) => setWorkplanData({ ...workplanData, description: e.target.value })}
            />
          </div>



          {/* <div className="col-12 mb-3">
            <label htmlFor="description" className="block text-gray-700 font-semibold text-sm uppercase">Task Description:</label>
          
            <RichTextEditor value={workplanData.description} onChange={handleDescriptionChange} />
          </div> */}


        </div>

        <div className='flex justify-between mb-3'>
          {/* Submit button */}
          <button type="submit" className="bg-blue-500 mb-3 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Submit</button>
          <button type='button' className="bg-black mb-3 text-white font-semibold py-2 px-4 rounded-md" onClick={handleClose}>close</button>

        </div>
      </form>
    </div>
  );
};

export default WorkplanForm;
