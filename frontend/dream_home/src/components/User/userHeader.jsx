import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../assets/logowhite.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Userlogout } from "../../slices/userSlices/authSlice.js";
import './userHeader.css'
import { useLogoutMutation } from "../../slices/adminSlices/adminApisliceEnd.js";
import {
  MdOutlineNotificationImportant,
} from "react-icons/md";
import {
  BiMessageRoundedDots,
  BiUserCircle,
} from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { TbHome2 } from "react-icons/tb";
import { RxDropdownMenu } from "react-icons/rx";
import axios from "axios";
import axiosInstance from "../../axios/axios";
import { ChatState } from "../../../context/chatProvider";
import { io } from "socket.io-client";

const backendUrl = "https://www.dreamhome.fun";
function UserHeader() {
  const [notification, setNotification] = useState([]);
  const [unReadMessage, setUnReadMessage] = useState([]);
  const [unreaded, setUnreaded] = useState(0);
  const [online, setOnline] = useState([]);

  let [searchInput, setSearchInput] = useState("");
  const { socket, setSocket, setOnlineUser } = ChatState();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [Logout] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        let res = await axiosInstance.get("/notificationCount");
        setNotification(res.data.notification);
        const Message = res.data.isUnRead.filter((message) => {
          return message.senderId !== userInfo.id;
        });
        setUnreaded(Message.length);
      };
      fetchData();
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.id) {
      const newSocket = io(backendUrl);
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userInfo]);
  useEffect(() => {
    if (socket === null) return;
    if (userInfo) {
      socket.emit("addNewUser", userInfo.id);
      socket.on("getOnlineUsers", (res) => {
        setOnline(res);
        setOnlineUser(res);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    const handleNewMessage = async (message, from, chatId, to) => {
      if (location.pathname !== "/user/messages") {
        setUnreaded((prev) => prev + 1);
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Clean up the effect to avoid multiple listeners
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, location.pathname, setUnreaded]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("notification", () => {
      setUnreaded(0);
    });
  }, [socket]);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      //  Logout().unwrap()
      dispatch(Userlogout());
      localStorage.removeItem("token");
      window.scrollTo(0, 0);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const [collapsed, setCollapsed] = useState(false);
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
      const userToken = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      let res = await axios.post(
        "https://www.dreamhome.fun/search",
        { val: searchInput },
        {
          headers: headers,
        }
      );
      setSearchInput("");
      navigate("/search", { state: { searchData: res.data } });
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
            <button className='hoverme'>
              <img src={Logo} alt="" className="w-24  pt-1" />
            </button>
          </Link>
        </div>

        {userInfo && !collapsed && (
          <div className="flex justify-center p-4 rounded-lg w-2/4 mx-8">
            <div className="relative flex items-center w-3/4 " >
              <input
                type="text"
                className="border rounded-lg w-full pl-10 text-center placeholder-center"
                placeholder="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              <AiOutlineSearch
                onClick={searchManagement}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>
        )}
        <div className="p-3 sm:pr-12 flex ml-auto text-white w-1/4 justify-end">
          {userInfo && !collapsed && (
            <Link to="/user/home">
              <TbHome2
                className={`mx-3 w-6 h-6 ${
                  location.pathname === "/user/home" ? "text-yellow-400 " : ""
                }`}
              />
            </Link>
          )}
          {/* {userInfo && !collapsed && (
          <Link to="/user/services">
            <MdOutlineHomeRepairService className="mx-2 w-6 h-6" />
          </Link>
        )} */}
          {userInfo && !collapsed && (
            <Link to="/user/notifications">
              <div className="relative">
                <MdOutlineNotificationImportant
                  className={`mx-3 w-6 h-6 ${
                    location.pathname === "/user/notifications"
                      ? "text-yellow-400"
                      : ""
                  }`}
                />
                {notification.length > 0 && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-red-700 rounded-full text-white flex items-center justify-center">
                    <p className="text-center mb-1">{notification.length}</p>
                  </div>
                )}
              </div>
            </Link>
          )}
          {userInfo && !collapsed && (
            <Link to="/user/messages">
              <div className="relative" onClick={() => setUnreaded(0)}>
                <BiMessageRoundedDots
                  className={`mx-3 w-6 h-6 ${
                    location.pathname === "/user/messages"
                      ? "text-yellow-400 "
                      : ""
                  }`}
                />
                {unreaded > 0 && location.pathname !== "/user/messages" && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-red-700 rounded-full text-white flex items-center justify-center">
                    <p className="text-center mb-1">{unreaded}</p>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* --------------SMALL SCREEN DROPDOWN------------ */}
          {userInfo && collapsed && (
            <Menu as="div" className="relative inline-block text-left">
              <div className="mb-3">
                <Menu.Button className="inline-flex w-full rounded-md font-medium text-white bg-opacity-20 hover:bg-mainColor focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {" "}
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
                                ? "bg-red-500 text-white hover:bg-opacity-50 !important"
                                : "text-gray-900 hover:bg-gray-100 !important"
                            } group flex w-full items-center rounded-md px-2 py-2`}
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
          {/* --------------NORMAL SCREEN DROPDOWN------------ */}
          {userInfo && !collapsed && (
            <Menu as="div" className="relative inline-block text-left">
              <div className="mb-3">
                <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20  font-medium text-white hover:bg-mainColo focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {/* User */}
                  {userInfo.image ? (
                    <div className="h-7 w-7 rounded-full overflow-hidden ml-2 border border-2 border-lime-400">
                      <img
                        src={`https://www.dreamhome.fun/images/${userInfo.image}`}
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
