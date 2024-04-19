import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faLock, faShieldAlt, faPalette, faCog } from '@fortawesome/free-solid-svg-icons';




function Setting() {

  // Reusable SettingCard component
  const SettingCard = ({ title, description, icon }) => (
    <div onClick={comingSoon} className="bg-gray-600 rounded-lg hover:bg-slate-900 hover:text-white ease-in-out duration-300 shadow-md p-3 cursor-pointer">
      <FontAwesomeIcon icon={icon} className="text-2xl border-light text-white border-3 p-2 rounded-full mb-2" />
      <h2 className="text-xl  text-light font-semibold text-center">{title}</h2>
      <p className="mt-2 text-light ">{description}</p>
    </div>
  );


  const comingSoon = () => {
    alert("the implementation is coming soon");
  }


  return (

    <DefaultLayout pageTitle="Account and Settings">
      <div className="container align-center mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* User Profile Settings */}
          <SettingCard
            title="Profile Settings"
            description="Edit your personal information, change your password, update your profile picture, and manage your preferences."
            icon={faUser}
          />

          {/* Notification Settings */}
          <SettingCard
            title="Notification Settings"
            description="Manage your email and push notification preferences. Choose which types of notifications you want to receive and how often."
            icon={faBell}
          />

          {/* Privacy Settings */}
          <SettingCard
            title="Privacy Settings"
            description="Control who can see your profile and workplans. Customize your privacy settings to ensure your information is only visible to the desired audience."
            icon={faLock}
          />

          {/* Security Settings */}
          <SettingCard
            title="Security Settings"
            description="Enhance your account security by enabling two-factor authentication, managing login sessions, and reviewing recent activity."
            icon={faShieldAlt}
          />

        </div>
      </div>
    </DefaultLayout>


  );
}

export default Setting;
