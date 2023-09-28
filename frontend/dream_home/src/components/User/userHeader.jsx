import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../assets/logowhite.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Userlogout } from "../../slices/userSlices/authSlice.js";
import { useLogoutMutation } from "../../slices/adminSlices/adminApisliceEnd.js";
import {MdOutlineHomeRepairService,MdOutlineNotificationImportant} from 'react-icons/md'
import {BiMessageRoundedDots,BiUserCircle,BiArrowBack} from 'react-icons/bi'
import {TbHome2} from 'react-icons/tb'
import { FaSearch } from "react-icons/fa";
import {RxDropdownMenu} from 'react-icons/rx'



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

  const [collapsed, setCollapsed] = useState(false);

  // Function to toggle the collapsed state
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Media query for responsiveness
  const isSmallScreen = window.innerWidth <= 640;

  // Effect to update collapsed state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-mainColor z-40 h-14 flex fixed w-screen">
      {/* <BiArrowBack className="text-white items-center"/> */}
      <Link to="/">
        <img src={Logo} alt="" className="w-24 ml-16 pt-1" />
      </Link>
      <div className="p-3 pr-16 flex ml-auto text-white">
        {userInfo && !collapsed && (
          <input
            type="text"
            className="border ml-4 rounded-lg w-3/4 text-center placeholder-center mr-4"
            placeholder="search"
          />
        )}

        {userInfo && !collapsed && (
          <Link to="/user/home">
            <TbHome2 className="mx-2 w-6 h-6" />
          </Link>
        )}
        {userInfo && !collapsed && (
          <Link to="/user/services">
            <MdOutlineHomeRepairService className="mx-2 w-6 h-6" />
          </Link>
        )}
        {userInfo && !collapsed && (
          <Link to="/user/notifications">
            <MdOutlineNotificationImportant className="mx-2 w-6 h-6 " />
          </Link>
        )}
        {userInfo && !collapsed && (
          <Link to="/user/messages">
            <BiMessageRoundedDots className="mx-2 w-6 h-6" />
          </Link>
        )}
        {userInfo && collapsed && (
          
           
            <Menu as="div" className="relative inline-block text-left">
            <div className="mb-3">
              <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20  font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <RxDropdownMenu className="mx-2 w-6 h-6" />
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
                      <Link to="/user/home">
                        <button
                          className={`${
                            active ? "bg-mainColor text-white hover:bg-opacity-50 !important"
                            : "text-gray-900 hover:bg-gray-100 !important"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >Home
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/user/notifications">
                        <button
                          className={`${
                            active ? "bg-mainColor text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >Notification
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/user/messages">
                        <button
                          className={`${
                            active ? "bg-mainColor text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                        >Messages
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="user/profile">
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

        {userInfo && !collapsed && (
          <Menu as="div" className="relative inline-block text-left">
            <div className="mb-3">
              <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20  font-medium text-white hover:bg-mainColo focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {/* User */}
                {userInfo.image?<div className="h-7 w-7 rounded-full overflow-hidden ml-2 border border-2 border-lime-400">
                  <img
                    src={`http://localhost:3000/images/${userInfo.image}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>:<BiUserCircle className="ml-2 w-6 h-6"/>}
                <ChevronDownIcon
                  className="mr-1 h-5 w-5 text-violet-200 hover:text-violet-100 mt-1"
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
                      <Link to="user/profile">
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