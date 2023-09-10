import React, { useState } from "react";
import Logo from "../assets/logowhite.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UserHeader() {
  let [showDropDown, setShowDropDown] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleDropdown = () => {
    setShowDropDown(!showDropDown);
  };
  const closeDropdown = () => {
    setShowDropDown(false);
  };

  return (
    <div className="bg-mainColor h-14 flex">
      <img src={Logo} alt="" className="w-24 ml-16 pt-1" />
      <div className="p-3 pr-16 flex ml-auto text-white">
        {userInfo && (
          <Link to="/user/home">
            <h4 className="pr-6">Home</h4>
          </Link>
        )}
        {userInfo && (
          <Link to="/user/services">
            <h4 className="pr-6">Services</h4>
          </Link>
        )}
        {userInfo && (
          <Link to="/user/notifications">
            <h4 className="pr-6">Notifications</h4>
          </Link>
        )}
        {userInfo && (
          <Link to="/user/messages">
            <h4 className="pr-6">Messages</h4>
          </Link>
        )}
        {/* {userInfo&& <Link to='/user/profile'><h4 className='pr-6'>Profile</h4></Link>} */}
        {userInfo && (
          <button onClick={handleDropdown} className="pb-3">
            User
          </button>
        )}
        {showDropDown ? (
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Link
              to="/user/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default UserHeader;
