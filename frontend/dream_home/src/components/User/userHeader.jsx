import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../assets/logowhite.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Userlogout } from "../../slices/userSlices/authSlice.js";
import { useLogoutMutation } from "../../slices/adminSlices/adminApisliceEnd.js";


function UserHeader() {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Logout] = useLogoutMutation()

  const logoutHandler =async (e) => {
    e.preventDefault()
    try {
       Logout().unwrap()
      dispatch(Userlogout())
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-mainColor z-40 h-14 flex fixed w-screen">
      <Link to="/">
        <img src={Logo} alt="" className="w-24 ml-16 pt-1" />
      </Link>
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

        {userInfo && (
          <Menu as="div" className="relative inline-block text-left">
            <div className="mb-3">
              <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20  font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                User
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100 mt-1"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to='user/profile'>
                      <button
                        className={`${
                          active ? "bg-mainColor text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 `}
                      >
                        Profile
                      </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logoutHandler}
                        className={`${
                          active ? "bg-mainColor text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 `}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
}

export default UserHeader;
