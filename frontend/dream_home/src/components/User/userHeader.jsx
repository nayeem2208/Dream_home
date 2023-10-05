import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../assets/logowhite.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Userlogout } from "../../slices/userSlices/authSlice.js";
import { useLogoutMutation } from "../../slices/adminSlices/adminApisliceEnd.js";
import {
  MdOutlineHomeRepairService,
  MdOutlineNotificationImportant,
} from "react-icons/md";
import {
  BiMessageRoundedDots,
  BiUserCircle,
  BiArrowBack,
} from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { TbHome2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { RxDropdownMenu } from "react-icons/rx";
// import axiosInstance from "../../axios/axios";
import axios from "axios";

function UserHeader() {
  let [searchInput,setSearchInput]=useState('')
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Logout] = useLogoutMutation();

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      //  Logout().unwrap()
      dispatch(Userlogout());
      localStorage.removeItem("token");
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


  const searchManagement = async (e) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      let res = await axios.post('http://localhost:3000/search',{val:searchInput} , {
        headers: headers,
      });
      setSearchInput('')
      navigate('/search' ,{ state: { searchData: res.data }})
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    // <div className="flex-col">
    <div className="bg-mainColor z-40 h-14 flex fixed w-screen ">
      {/* <BiArrowBack className="text-white items-center"/> */}
      <div className="w-full flex  justify-between">
        <div className="w-2/4 sm:w-1/4 sm:flex sm:justify-start sm:pl-14 ">
          <Link to="/">
            <img src={Logo} alt="" className="w-24  pt-1" />
          </Link>
        </div>

        {userInfo && !collapsed && (
          <div className="flex justify-center p-4 rounded-lg w-2/4">
            <div className="relative flex items-center w-3/4">
              <input
                type="text"
                className="border rounded-lg w-full pl-10 text-center placeholder-center"
                placeholder="Search"
                onChange={(e)=>setSearchInput(e.target.value)}
                value={searchInput}
              />
              <AiOutlineSearch onClick={searchManagement} className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>
          </div>
        )}
        <div className="p-3 sm:pr-12 flex ml-auto text-white w-1/4 justify-end">
          {userInfo && !collapsed && (
            <Link to="/user/home">
              <TbHome2 className="mx-3 w-6 h-6" />
            </Link>
          )}
          {/* {userInfo && !collapsed && (
          <Link to="/user/services">
            <MdOutlineHomeRepairService className="mx-2 w-6 h-6" />
          </Link>
        )} */}
          {userInfo && !collapsed && (
            <Link to="/user/notifications">
              <MdOutlineNotificationImportant className="mx-3 w-6 h-6 " />
            </Link>
          )}
          {userInfo && !collapsed && (
            <Link to="/user/messages">
              <BiMessageRoundedDots className="mx-3 w-6 h-6" />
            </Link>
          )}
          {userInfo && collapsed && (
            <Menu as="div" className="relative inline-block text-left">
              <div className="mb-3">
                <Menu.Button className="inline-flex w-full  rounded-md  bg-opacity-20  font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <RxDropdownMenu className="mx-2 w-6 h-6 " />
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
                              active
                                ? "bg-mainColor text-white hover:bg-opacity-50 !important"
                                : "text-gray-900 hover:bg-gray-100 !important"
                            } group flex w-full items-center rounded-md px-2 py-2 `}
                          >
                            Home
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/user/notifications">
                          <button
                            className={`${
                              active
                                ? "bg-mainColor text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 `}
                          >
                            Notification
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/user/messages">
                          <button
                            className={`${
                              active
                                ? "bg-mainColor text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 `}
                          >
                            Messages
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="user/profile">
                          <button
                            className={`${
                              active
                                ? "bg-mainColor text-white"
                                : "text-gray-900"
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
                  {userInfo.image ? (
                    <div className="h-7 w-7 rounded-full overflow-hidden ml-2 border border-2 border-lime-400">
                      <img
                        src={`http://localhost:3000/images/${userInfo.image}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <BiUserCircle className="ml-2 w-6 h-6" />
                  )}
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
                              active
                                ? "bg-mainColor text-white"
                                : "text-gray-900"
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
    </div>
    //     {userInfo && collapsed && (
    //      <div className="h-24 bg-black">
    //      <div className="flex justify-center pt-32 p-4 rounded-lg w-full">
    //        <div className="relative flex items-center w-3/4">
    //          <input
    //            type="text"
    //            className="border rounded-lg w-full pl-10 text-white text-center placeholder-white"
    //            placeholder="Search"
    //          />
    //          <AiOutlineSearch className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
    //        </div>
    //      </div>
    //    </div>

    //     )}
    // </div>
  );
}

export default UserHeader;
