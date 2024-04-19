import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles


function UploadReport() {

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const weekAndQuarter = JSON.parse(sessionStorage.getItem('weekAndQuarter'));


  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [userDescription, setUserDescription] = useState('');

  const [reportWeek, setReportWeek] = useState(weekAndQuarter.week - 1);
  const [reportQuater, setReportQuater] = useState(weekAndQuarter.quarter);
  const [reportYear, setReportYear] = useState(2024);


  const [userName, setUserName] = useState(`${loggedInUser.fName} ${loggedInUser.lName}`);
  const [userId, setUserId] = useState(loggedInUser.userID); // Initialize with the default user ID
  const [showUploads, setShowUploads] = useState(false); // State to control visibility of previous uploads

  const [reportsWeek, setReportsWeek] = useState([]);

  const { REACT_APP_AXIOS_URL: url } = process.env;

  useEffect(() => {
    fetchUserReports(userId); // Fetch reports for the default user ID
    getWorkplanWeekWithoutReport(userId);
  }, [userId]); // Add userId as a dependency


  const fetchUserReports = (userId) => {
    axios.get(`${url}/user-reports?user_id=${userId}`)
      .then((response) => {
        setUploads(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user reports: ', error);
      });
  };

  const getWorkplanWeekWithoutReport = (userId) => {
    axios.get(`${url}/getWorkplanWeekWithoutReport/${userId}`)
      .then((response) => {
        setReportsWeek(response.data);
      })
      .catch((error) => {
        console.error('Error fetching reports week: ', error);
      });
  };


  console.log(reportsWeek);




  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('user_id', loggedInUser.userID); // Replace with actual user ID
    formData.append('user_fullname', userName);
    formData.append('description', userDescription);
    formData.append('workplan_week', reportWeek);
    formData.append('workplan_quarter', reportQuater);
    formData.append('workplan_year', reportYear);

    axios.post(`${url}/upload`, formData)
      .then((response) => {
        // Handle the response from the backend
        console.log(response.data);
        toast.success('Report Uploaded Successfully');
        fetchUserReports(loggedInUser.userID); // Refresh the list of uploads after successful upload
        setFile('');
        setUserDescription('');
      })
      .catch((error) => {
        // Handle any errors
        toast.error('Workplan Report Upload failed');
        console.error('Error uploading file: ', error);
      });
  };


  const handleFileDownload = (filename) => {
    const downloadUrl = `${url}/download/${filename}`;
    window.open(downloadUrl, '_blank');
  };


  const handleFileDelete = (filename) => {
    axios.delete(`${url}/uploads/${filename}`)
      .then(() => {
        fetchUserReports(loggedInUser.userID);
        toast.success('Workplan Report deleted');
      })
      .catch((error) => {
        toast.error('Error deleting file');
        console.error('Error deleting file: ', error);
      });
  };

  // console.log(file);

  function getReadableFileSizeString(fileSizeInBytes) {
    const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(1024));
    const byteUnits = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const result = (fileSizeInBytes / Math.pow(1024, i)).toFixed(2);
    return `${result} ${byteUnits[i]}`;
  }


  return (

    <DefaultLayout pageTitle="Report manager">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      
      <div className="container my-5">

        {/* Show previous uploads section when button is clicked and serves as breadcrumb */}
        <div className="flex justify-between items-center bg-gray-300 mb-4 border border-dark rounded p-2">
          <div className="">
            <Link to="../dashboard" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </Link>
            {/* <span className="mx-2">&#8594;</span> */}
          </div>
          <div>
            <button onClick={() => setShowUploads(!showUploads)} className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {showUploads ? 'Hide Previous Uploads' : 'Show Previous Uploads'}
            </button>
          </div>
          <div className="t">
            {/* <span className="mx-2">&#8594;</span> */}
            <Link to="../report-history" className="btn btn-sm btn-primary badge bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Report History
            </Link>
          </div>
        </div>


        <div className="container p-2 bg-gray-300 rounded-lg">
          {!showUploads && (
            <div className='row mb-2 p-2'>
              <div className='col-10'>
                <label className='label text-black capitalize text-lg'>select file</label>
                <input required type="file" name="pdf" accept=".pdf" onChange={handleFileUpload} className="form-control mb-4 shadow-none border border-dark" />
              </div>

              <div className='col-2'>
                <label className='label text-black capitalize text-lg'>file size</label>
                <input readOnly type="text" name="file-size" value={!file ? 0 : getReadableFileSizeString(file.size)} className="form-control mb-4 shadow-none border border-dark" />
              </div>

              <div className='col-3'>
                <label className='label text-black capitalize text-lg'>person uploading</label>
                <input readOnly type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="form-control mb-4 shadow-none border border-dark" />
              </div>



              <div className='col-3'>
                <label className='label text-black capitalize text-lg'>report week</label>
                {reportsWeek.length > 0 ? (
                  <select value={reportWeek} onChange={(e) => setReportWeek(e.target.value)} className="form-control mb-4 shadow-none border border-dark">
                    {[...new Set(reportsWeek.map(report => report.workplan_week))].map((week, index) => (
                      <option key={index} value={week}>{week}</option>
                    ))}
                  </select>
                ) : (
                  <select disabled value={0} readOnly className="form-control mb-4 shadow-none border bg-secondary border-dark">
                    <option value={0}>{0}</option>
                  </select>

                )}
              </div>


              <div className='col-3'>
                <label className='label text-black capitalize text-lg'>report quarter</label>
                <input required type="number" value={reportQuater} onChange={(e) => setReportQuater(e.target.value)} className="form-control mb-4 shadow-none border border-dark" />
              </div>

              <div className='col-3'>
                <label className='label text-black capitalize text-lg'>report year</label>
                <input required type="number" value={reportYear} onChange={(e) => setReportYear(e.target.value)} className="form-control mb-4 shadow-none border border-dark" />
              </div>

              <div className='col-12'>
                <label className='label text-black capitalize text-lg'>brief description</label>
                <textarea required placeholder="Description" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} className="form-control mb-4 shadow-none border border-dark" />
              </div>

              <div className='col-12'>
                {reportsWeek.length === 0 || reportWeek === '0' ? <p className="text-muted text-sm mb-2">Note: A week of 0 means there is no pending work plan report. The Button below will be disabled</p> : <p className='d-none'></p>}
                <button onClick={handleUpload} disabled={reportsWeek.length === 0 || reportWeek === '0' || userDescription === '' || file === null} className="btn btn-outline-success">Upload File</button>
              </div>
            </div>
          )}


          {showUploads && (
            <div>
              <h2 className="text-lg font-bold mb-2">Previous Uploads:</h2>
              <table className="table table-bordered flex-row-reverse">
                <thead>
                  <tr className="text-center">
                    <th className="">File Name</th>
                    <th className="">uploaded by</th>
                    <th className="">description</th>
                    <th className="">date</th>
                    <th className="">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((upload) => (
                    <tr key={upload.id}>
                      <td className="border">{upload.filename}</td>
                      <td className="border">{upload.user_fullname}</td>
                      <td className="border">{upload.description}</td>
                      <td className="border"><Moment format="YYYY/MM/DD">{upload.date_uploaded}</Moment></td>
                      <td className="border flex justify-around">
                        <button onClick={() => handleFileDownload(upload.filename)} className="btn btn-primary text-xs badge btn-sm">Download</button>
                        <button onClick={() => handleFileDelete(upload.filename)} className="btn btn-danger text-xs badge btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </DefaultLayout>
  );
}

export default UploadReport;
