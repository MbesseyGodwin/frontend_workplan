import React, { useState, useEffect } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Moment from "react-moment";



function WorkplanStatus() {


  const { REACT_APP_AXIOS_URL: url } = process.env;
  const [workplans, setWorkplans] = useState([]);
  const [selectedWorkplan, setSelectedWorkplan] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // Added loading state


  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  useEffect(() => {
    fetchWorkplanStatus();
  }, []);

  const fetchWorkplanStatus = async () => {
    try {
      const response = await axios.get(`${url}/workplans/pending/${loggedInUser.userID}`);
      setWorkplans(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workplan status:", error);
    }
  };
  // console.log(workplans);

  // Function to handle deletion of a workplan
  const handleDelete = async () => {
    try {
      // Send an HTTP DELETE request to the backend API to delete the workplan
      const response = await axios.delete(`${url}/workplans/${selectedWorkplan.workplan_id}`);

      // console.log(selectedWorkplan.workplan_id);

      if (response.status === 200) {
        // If deletion is successful, display a success message to the user
        // console.log('Workplan deleted successfully:', response.data.message);
        toast.success('Workplan deleted successfully');

        // Fetch the latest workplan status from the server to refresh the page
        fetchWorkplanStatus(); // Await for the fetch to complete before proceeding

        // Close the modal or perform any other necessary actions
        closeModal();
      } else {
        // If there's an error during deletion, display an error message to the user
        console.error('Error deleting workplan:', response.data.error);
        toast.error('Error deleting workplan');
      }
    } catch (error) {
      // If there's an error in the request, log the error and display an error message to the user
      console.error('Error deleting workplan:', error);
      toast.error('Error deleting workplan');
    }
  };




  const openModal = (workplan) => {
    setSelectedWorkplan(workplan);
  };

  const closeModal = () => {
    setSelectedWorkplan(null);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 20
      ? `${words.slice(0, 20).join(" ")}...`
      : description;
  };

  const toggleDescription = () => {
    const updatedWorkplans = workplans.map((workplan) => {
      if (workplan.workplan_id === selectedWorkplan.workplan_id) {
        return {
          ...workplan,
          showFullDescription: !workplan.showFullDescription,
        };
      }
      return workplan;
    });
    setWorkplans(updatedWorkplans);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <DefaultLayout pageTitle="Workplan status">

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />



      {!selectedWorkplan && (
        <div className="container mx-auto mt-10">

          {workplans.length === 0 ? (
            <div className="text-center alert alert-dark flex justify-between align-center">
              <h4 className="uppercase text-xs lg:text-lg">no workplan found</h4>
              <Link className="font-bold text-xs lg:text-lg text-decoration-none capitalize" to="/create-workplan" title="Home">create new workplan</Link>
            </div>
          ) : (

            
            <div>
              <div className="alert alert-dark flex justify-between align-center">
                <h4 className="font-bold text-xs lg:text-lg text-decoration-none capitalize">workplan status</h4>
                <Link className="font-bold text-xs lg:text-lg text-decoration-none capitalize" to="/create-workplan" title="Home">create new</Link>
              </div>

              <div className="grid my-4 gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {workplans.map((workplan) => (
                  <div key={workplan.workplan_id} className="cursor-pointer ease-in-out duration-300 bg-gray-300 hover:bg-gray-500 hover:text-white rounded-lg">
                    <div
                      className={`overflow-hidden text-center shadow-md rounded-lg p-4 border ${workplan.status === "Pending"
                        ? "border-red-500"
                        : workplan.status === "Approved"
                          ? "border-green-500"
                          : workplan.status === "Declined"
                            ? "border-gray-500"
                            : "border-transparent"
                        }`}
                      onClick={() => openModal(workplan)}
                    >
                      <h3 className="text-sm lg:text-lg capitalize font-semibold">{workplan.workplan_day}</h3>
                      <h5 className="text-sm lg:text-lg font-light">{formatDate(workplan.workplan_date)}</h5>

                      <div className="flex justify-center items-center mt-4">
                        {workplan.status === "Pending" && (
                          <span className="text-sm lg:text-lg px-3 py-1 rounded-full bg-red-500 text-white flex items-center">
                            <i className="fas fa-clock fa-spin mr-1"></i>{workplan.status}
                          </span>
                        )}
                        {workplan.status === "Approved" && (
                          <span className="text-sm lg:text-lg px-3 py-1 rounded-full bg-green-500 text-white flex items-center">
                            <i className="fas fa-thumbs-up mr-1"></i>{workplan.status}
                          </span>
                        )}
                        {workplan.status === "Declined" && (
                          <span className="text-sm lg:text-lg px-3 py-1 rounded-full bg-gray-500 text-white flex items-center">
                            <i className="fas fa-ban mr-1"></i>{workplan.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}





      {selectedWorkplan && (
        <div className="inset-0 z-10 flex items-center justify-center bg-opacity-50 my-5 mx-auto">
          <div className="bg-slate-300 p-2 rounded-lg container">
            <h1 className="text-sm lg:text-xl text-center text-red-900 uppercase">
              details of {selectedWorkplan.title}
            </h1>

            <div className="row p-2">

              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedWorkplan.status}
                </p>
              </div>



              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Authorizer:</span>{" "}
                  <span className="capitalize">{selectedWorkplan.authorizer_fullname}</span>
                </p>
              </div>



              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Day:</span>{" "}
                  {selectedWorkplan.workplan_day}
                </p>
              </div>

              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Date:</span>{" "}
                  <Moment format="YYYY/MM/DD">
                    {selectedWorkplan.workplan_date}
                  </Moment>
                </p>
              </div>


              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  {selectedWorkplan.status === 'Approved' ?
                    <span className="font-semibold">Approval Date: {" "}
                      <span className="font-light"><Moment format="YYYY/MM/DD">{selectedWorkplan.approval_date}</Moment></span>
                    </span> :
                    <span className="font-semibold">Decline reason: {" "}
                      <span className="font-light">{selectedWorkplan.decline_reason}</span>
                    </span>}
                </p>
              </div>

              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedWorkplan.location}
                </p>
              </div>

              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Departure Time:</span>{" "}
                  {selectedWorkplan.departure_time}
                </p>
              </div>

              <div className="col-6 col-lg-3">
                <p className="alert alert-light text-sm text-gray-500">
                  <span className="font-semibold">Logistic Required:</span>{" "}
                  {selectedWorkplan.logistic}
                </p>
              </div>

              <div className="col-12">
                <p className="alert alert-light text-sm text-gray-500">
                  <p className="font-semibold">Description:</p>{" "}
                  <p>{selectedWorkplan.description}</p>
                </p>
              </div>

              <div className="col-12 my-0 py-0">
                <p className="text-danger text-sm">
                  <i className="fa-solid fa-triangle-exclamation"></i> Please note: Approved workplans cannot be removed.
                </p>
              </div>




              <div className="col-12 flex justify-between">

                <button className="btn btn-sm btn-primary bg-blue-500 text-white rounded hover:bg-blue-600" onClick={closeModal}>
                  <i className="fa-solid fa-xmark"></i> Close
                </button>


                {/* Button to delete workplan */}
                {selectedWorkplan.status !== 'Approved' && (
                  <div>
                    <button className="btn btn-sm btn-danger bg-red-500 text-white rounded hover:bg-red-600 mr-2" onClick={handleDelete}>
                      <i className="fa-solid fa-trash-alt"></i> Delete
                    </button>
                  </div>
                )}
              </div>



            </div>
          </div>
        </div>
      )}


    </DefaultLayout>
  );
}

export default WorkplanStatus;
