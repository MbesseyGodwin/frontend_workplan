import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

function UploadReport() {
  return (
    <DefaultLayout pageTitle="Upload Report">
      <div className="container align-center mt-10">
        <div className="d-flex justify-content-between">
          {/* Sample ManageUser Items */}

          <div className="col-lg-3 col-md-6 mx-3 cursor-pointer bg-slate-400 rounded-lg  hover:bg-red-900 hover:text-white ease-in-out duration-300 shadow-md p-3">
          <i className="fa-solid fa-user-plus"></i>
            <h2 className="text-xl font-semibold mb-4 text-capitalize text-center align-center">placeholder</h2>
          </div>


        </div>
      </div>
    </DefaultLayout>
  );
}

export default UploadReport;
