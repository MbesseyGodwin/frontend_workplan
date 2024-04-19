import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';

function VisitSummary() {
  return (
    <DefaultLayout pageTitle="Visit Summary">
      <div className="container align-center mt-10">


{/* serves as breadcrumb */}
<div className="flex justify-between items-center bg-gray-300 mb-4 border border-dark rounded p-2">
          <div className="">
            <Link to="../dashboard" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </Link>
            {/* <span className="mx-2">&#8594;</span> */}
          </div>


          <div className="">
            {/* <span className="mx-2">&#8594;</span> */}
            <Link to="#"  className="btn btn-sm btn-primary badge disabled bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Not Linked
            </Link>
          </div>
        </div>


        <div className="d-flex justify-content-between">
          {/* Sample ManageUser Items */}

          <div className="col-12 cursor-pointer bg-gray-300 rounded-lg  hover:bg-red-900 hover:text-white ease-in-out duration-300 shadow-md p-3">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <h2 className="text-xl text-center font-semibold mb-4">Analysis Section - Coming Soon</h2>
          <p>
  The Visit Summary page serves as a comprehensive dashboard for analyzing usage trends within the workplan application. It aggregates data, visualizes usage trends, monitors user engagement metrics, tracks application performance, provides data-driven insights, offers customizable reporting, and may employ predictive analytics techniques.
</p>

          </div>


        </div>
      </div>
    </DefaultLayout>
  );
}

export default VisitSummary;
