import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { TbSend } from "react-icons/tb";
import { GrAdd } from "react-icons/gr";
import axiosInstance from "../../../axios/axios";
import { Link } from "react-router-dom";
import backgroundImg from "../../../assets/chat.jpEg";
import { useSelector } from "react-redux";
import io from 'socket.io-client'

const loginPageStyle = {
  background: `url(${backgroundImg})`, // Replace with the actual path to your image
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "5vh", // Ensure the background covers the entire viewport height
  hight: "5vh",
  display: "flex",
  justifyContent: "center",
  marginRight: "1px",
  alignItems: "center",
  opacity: 0.5,
};

const ENDPOINT='http://localhost:3000'
let socket,selectChatCompare

function Messages() {
  const [isPopoverVisible, setPopoverVisible] = useState(false); //for pop over in add chat button
  const [modalVisible, setModalVisible] = useState(false);
  const [searchPattern, setSearchPattern] = useState("");
  const [filteredValues, setFilteredValues] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);

  const [chatMessage, SetChatMessage] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [typeMessge, SetTypeMessge] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup",userInfo)
    socket.on("connected",()=>setSocketConnected(true))
  },[])

  const selectChat = async (id) => {
    try {
      let res = await axiosInstance.post("/selectChat", { id });
      SetChatMessage(res.data.messages);
      setChatUser([res.data.userProfile]);
      setModalVisible(false);
      setRefresh(!refresh);
      socket.emit("join chat",id)

      selectChatCompare=chatMessage
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/chatroom");
      setAllUser(res.data.followedUsers);
      setChatRooms(res.data.chatRoomsData);
    };
    fetchData();
  }, [refresh]);

  const handleSearchChange = (e) => {
    const pattern = e.target.value;
    try {
      const regex = new RegExp(pattern, "i"); // 'i' flag for case-insensitive matching
      const filteredValues = chatRooms.filter((user) =>
        regex.test(user.otherParticipant.username)
      );
      setSearchPattern(pattern);
      setFilteredValues(filteredValues);
    } catch (error) {
      // Handle invalid regex pattern input
      setSearchPattern(pattern);
      setFilteredValues([]);
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const pattern = /[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

      if (pattern.test(typeMessge)) {
        const res = await axiosInstance.put("/sendMessage", {
          typeMessge,
          chatUser,
        });
        SetChatMessage(res.data);
        setRefresh(!refresh);
        SetTypeMessge("");
      }
      // console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* <button className="pt-24 flex justify-cente">New chat</button> */}
      <div className=" pt-24 flex justify-center">
        <div className="w-5/6 h-96  rounded-md mb-12 shadow-xl flex ">
          <div className="w-2/6 bg-gray-200 rounded-l-md h-full ">
            <div className="flex justify-center p-3 h-16  rounded-tl-lg">
              <input
                type="text"
                className="rounded-lg w-3/4 h-8 text-center placeholder-center items-center"
                placeholder="Search"
                value={searchPattern}
                onChange={handleSearchChange}
              />
              <GrAdd
                className="w-6 h-6 mx-3 mt-1 cursor-pointer"
                type="button"
                onMouseEnter={togglePopover}
                onMouseLeave={togglePopover}
                onClick={toggleModal}
              />
              {isPopoverVisible && (
                <div className="absolute z-10 inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                    {/* <h3 className="font-semibold text-gray-900">
                      
                    </h3> */}
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-black">
                      Click this button add a new chat
                    </p>
                  </div>
                </div>
              )}
              {modalVisible && (
                <div>
                  <div
                    className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                    onClick={toggleModal}
                  ></div>
                  <div
                    id="defaultModal"
                    className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                  >
                    <div className="relative w-full max-w-md">
                      <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                          <h3 className="text-xl font-bold text-gray-900 ">
                            Choose a chat
                          </h3>

                          <button
                            type="button"
                            onClick={toggleModal}
                            className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="defaultModal"
                          >
                            <svg
                              className="w-3 h-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                          {allUser.map((user) => (
                            <div key={user.id} className="flex p-3 ml-4">
                              <div className="w-12 h-12 rounded-full overflow-hidden ">
                                {" "}
                                <img
                                  src={`http://localhost:3000/images/${user.profilePic}`}
                                  className="w-full h-full "
                                  alt=""
                                />
                              </div>
                              <button onClick={() => selectChat(user._id)}>
                                <p className="font-bold m-3">{user.username}</p>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className=" max-h-72 overflow-y-auto mx-3 my-3">
              <div className="mx-4">
                {filteredValues.length > 0
                  ? filteredValues.map((user) => (
                      <div
                        key={user.otherParticipant._id}
                        className="flex my-4"
                      >
                        <div className="w-12 h-12 overflow-hidden rounded-full ">
                          <img
                            src={`http://localhost:3000/images/${user.otherParticipant.profilePic}`}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p
                          className="m-2 font-bold cursor-pointer"
                          onClick={() => selectChat(user.otherParticipant._id)}
                        >
                          {user.otherParticipant.username}
                        </p>
                      </div>
                    ))
                  : chatRooms.map((user) => (
                      <div
                        key={user.otherParticipant._id}
                        className="flex my-4"
                      >
                        <div className="w-12 h-12 overflow-hidden rounded-full ">
                          <img
                            src={`http://localhost:3000/images/${user.otherParticipant.profilePic}`}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p
                          className="m-2 font-bold cursor-pointer"
                          onClick={() => selectChat(user.otherParticipant._id)}
                        >
                          {user.otherParticipant.username}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          {chatUser.length > 0 ? (
            <div className="w-4/6">
              <div className="bg-mainColor h-16 rounded-tr-lg">
                <div className=" h-16 flex shadow-inner">
                  {" "}
                  <div className="w-12 h-12 rounded-full overflow-hidden m-2">
                  <Link to={`/user/usersprofile?username=${chatUser[0].username}`}>
                    <img
                      src={`http://localhost:3000/images/${chatUser[0].profilePic}`}
                      className="object-cover h-full w-full"
                      alt=""
                    /></Link>
                  </div>
                  <Link to={`/user/usersprofile?username=${chatUser[0].username}`}>
                  <p className="my-4 mx-2 font-bold text-white">
                    {chatUser[0].username}
                  </p>
                  </Link>
                </div>
              </div>
              <div className="max-h-72 h-4/6 overflow-y-auto p-2">
                {chatMessage.map((message, index) =>
                  message.senderId == userInfo.id ? (
                    <div key={index} className="w-full flex my-2 justify-end">
                      <div className="bg-emerald-500  w-fit text-white p-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg ml-6">
                        {message.content}
                      </div>
                      <div className="w-4 h-4 overflow-hidden rounded-full my-3 mx-2" ><img src={`http://localhost:3000/images/${userInfo.image}`} className="object-cover h-full w-full" alt="" /></div>
                    </div>
                  ) : (
                    <div key={index} className="w-full my-2 flex">
                      <div className="w-4 h-4 overflow-hidden rounded-full my-3 mx-2" ><img src={`http://localhost:3000/images/${chatUser[0].profilePic}`} className="object-cover h-full w-full" alt="" /></div>
                      <div className="bg-cyan-600 text-white max-w-1/2 w-fit p-2 rounded-tl-lg rounded-tr-lg rounded-br-lg mr-6">
                        {message.content}
                      </div>

                    </div>
                  )
                )}
                <div className=""></div>
              </div>
              <div className="h-1/6  rounded-br-lg bg-gray-400 flex justify-center">
                <form onSubmit={sendMessageHandler} className="flex w-4/6">
                  <textarea
                    name=""
                    id=""
                    cols="60"
                    rows="2"
                    onChange={(e) => SetTypeMessge(e.target.value)}
                    className="m-2 rounded-xl w-4/5"
                    value={typeMessge}
                  ></textarea>
                  <button type="submit">
                    <TbSend
                      className="w-6 h-6 text-white my-4 cursor-pointer"
                      type="submit"
                    />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-4/6 " style={loginPageStyle}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
