import React, { useEffect, useState, useRef } from "react";
import { TbSend } from "react-icons/tb";
import { GrAdd } from "react-icons/gr";
import axiosInstance from "../../../axios/axios";
import { Link} from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../../../../animations/message.json";
import { ChatState } from "../../../../context/chatProvider";
import InputEmoji from "react-input-emoji";
import { AiOutlineClose } from "react-icons/ai";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ENDPOINT = "https://www.dreamhome.fun";
let socket, selectChatCompare;

function Messages() {
  const [isPopoverVisible, setPopoverVisible] = useState(false); //for pop over in add chat button
  const [modalVisible, setModalVisible] = useState(false); //modal for selecting new user for chat
  const [searchPattern, setSearchPattern] = useState(""); //input value for search
  const [filteredValues, setFilteredValues] = useState([]); //filter value for search result

  const [socketConnected, setSocketConnected] = useState(false);

  const [chatRoomId, SetChatRoomId] = useState("");
  const [chatMessage, SetChatMessage] = useState([]);
  const [chatUser, setChatUser] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [typeMessge, SetTypeMessge] = useState("");
  const [unreadMessage, setUnreadMessage] = useState([]);
  

  //mobile view
  const [chatUsersVisible, setChatUsersVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  

  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  let data = location.state?.data;

  const { headerRefresh, setHeaderRefresh, onlineUser, socket } = ChatState();

  const chatMessageRef = useRef(null);
  const chatRoomIdRef = useRef(chatRoomId);

  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [chatMessage]);

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectChat = async (id) => {
    try {
      let res = await axiosInstance.post("/selectChat", { id });
      SetChatMessage(res.data.messages);
      SetChatRoomId(res.data.chatRoomId);
      setChatUser(res.data.userProfile);
      setModalVisible(false);
      setRefresh(!refresh);
      let Chatid = res.data.chatRoomId;
      setChatUsersVisible(false);
      setChatVisible(true);
      selectChatCompare = chatMessage;
      await isRead(Chatid);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const pattern = /[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
      if (pattern.test(typeMessge)) {
        // socket.emit("stop typing", chatRoomId);
        const res = await axiosInstance.put("/sendMessage", {
          typeMessge,
          chatUser,
        });
        const newMessage = res.data;
        setHeaderRefresh(!headerRefresh);
        SetTypeMessge("");
        socket.emit("sendMessage", {
          from: userInfo.id,
          to: chatUser._id,
          message: newMessage,
          chatId: chatRoomId,
        });
        SetChatMessage([...chatMessage, newMessage]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket === null) return;
  
    const handleNewMessage = async (message, from, chatId, to) => {
      if (chatRoomIdRef.current !== '' && chatRoomIdRef.current === chatId) {
        if (from !== userInfo.id && to === userInfo.id && chatMessage[chatMessage.length - 1] !== message) {
          SetChatMessage((prevMessages) => [...prevMessages, message]);
          await isRead(chatRoomIdRef.current);
        }
      } else {
        setChatRooms((rooms) =>
          rooms.map((room) => {
            if (room && room._id === chatId) {
              if (room.otherParticipant && room.otherParticipant._id !== userInfo.id) {
                return {
                  ...room,
                  unreadMessagesCount: (room.unreadMessagesCount || 0) + 1,
                };
              }
            }
            return room;
          })
        );
      }
    };
  
    socket.on("newMessage", handleNewMessage);
  
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, chatMessage, userInfo, chatRoomIdRef, SetChatMessage, setChatRooms]);
  


  useEffect(() => {
    chatRoomIdRef.current = chatRoomId;
  }, [chatRoomId]);

  useEffect(() => {
    // to select the chat when it comes from userProfile
    if (data) {
      let User = data.participants.filter((user) => user != userInfo.id);
      selectChat(User[0]);
      data = null;
    }

    const handleResize = () => {
      setCollapsed(window.innerWidth <= 640);
    };
    setCollapsed(window.innerWidth <= 640);
    setChatVisible(false);
    setChatUsersVisible(true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/chatroom");
      setAllUser(res.data.followedUsers);
      setUnreadMessage(res.data.isUnRead);
      const chatRoomsData = res.data.chatRoomsData;
      const updatedChatRooms = chatRoomsData.map((chatRoom) => {
        const matchingUnreadRoom = res.data.isUnRead.filter((unreadRoom) => {
          return (
            unreadRoom.room === chatRoom._id &&
            chatRoom.lastMessage?.senderId !== userInfo.id
          );
        });
        const unreadCount = matchingUnreadRoom.length;
        return {
          ...chatRoom,
          unreadMessagesCount: unreadCount,
        };
      });
      setChatRooms(updatedChatRooms);
    };
    fetchData();
  }, [refresh]);

  //for mobile view
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  //message read function
  const isRead = async (e) => {
    try {
      let res = await axiosInstance.patch("/MessageIsRead", { e });
      // SetChatMessage(res.data)
    } catch (error) {
      console.log(error);
    }
  };

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

  const chatVisibleToggle = () => {
    setChatVisible(false);
    setChatUsersVisible(true);
  };

  return (
    <div>
      {/* <button className="pt-24 flex justify-cente">New chat</button> */}
      <div className=" pt-24 flex justify-center">
        <div className="w-5/6 h-96  rounded-md mb-12 shadow-xl flex ">
          {(collapsed == false || chatUsersVisible == true) && (
            <div className="w-full sm:w-2/6 bg-gray-200 rounded-l-md h-full ">
              <div className="flex justify-center p-3 h-16  rounded-tl-lg">
                <input
                  type="text"
                  className="rounded-lg w-full sm:w-3/4 h-8 text-center placeholder-center items-center"
                  placeholder="Search"
                  value={searchPattern}
                  onChange={handleSearchChange}
                />
                <GrAdd
                  className="w-6 h-6 mx-5  sm:mx-3 mt-1  cursor-pointer"
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
                            {allUser.length > 0 ? (
                              allUser.map((user) => (
                                <div key={user.id} className="flex p-3 ml-4">
                                  <div className="w-12 h-12 rounded-full overflow-hidden ">
                                    {" "}
                                    <img
                                      src={`https://www.dreamhome.cloud/images/${user.profilePic}`}
                                      className="w-full h-full "
                                      alt=""
                                    />
                                  </div>
                                  <button onClick={() => selectChat(user._id)}>
                                    <p className="font-bold m-3">
                                      {user.username}
                                    </p>
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 font-bold flex justify-center">
                                You dont have a followers
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className=" max-h-72 overflow-y-auto mx-3 my-3">
                <div className="">
                
                  {filteredValues.length > 0 ? (
                    filteredValues.map((user) => (
                      <div
                        key={user.otherParticipant._id}
                        className="flex my-1 shadow-sm rounded-lg p-2"
                      >
                        <div className="w-12 h-12 overflow-hidden rounded-full">
                          <img
                            src={`https://www.dreamhome.cloud/images/${user.otherParticipant.profilePic}`}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {onlineUser.some(
                            (onlineUser) =>
                              onlineUser.userId === user.otherParticipant._id
                          ) && (
                            <div className="w-3 h-3 bg-green-900 rounded-full"></div>
                          )}
                        <p
                          className="m-2 font-bold cursor-pointer"
                          onClick={() => selectChat(user.otherParticipant._id)}
                        >
                          {user.otherParticipant.username}
                        </p>
                      </div>
                    ))
                  ) : chatRooms.length > 0 ? (
                    chatRooms.map((user) => (
                      <div
                        key={user.otherParticipant._id}
                        onClick={() => selectChat(user.otherParticipant._id)}
                        className="flex my-1 shadow-sm rounded-lg py-2 sm:p-2 justify-between cursor-pointer"
                      >
                        <div className="flex">
                          <div
                            className=" w-8 h-8 mt-1 sm:w-12 sm:h-12 overflow-hidden rounded-full flex justify-center "
                            onClick={() =>
                              selectChat(user.otherParticipant._id)
                            }
                          >
                            <img
                              src={`https://www.dreamhome.cloud/images/${user.otherParticipant.profilePic}`}
                              alt=""
                              className="object-cover w-full h-full cursor-pointer"
                            />
                          </div>
                          {onlineUser.some(
                            (onlineUser) =>
                              onlineUser.userId === user.otherParticipant._id
                          ) && (
                            <div className="w-3 h-3  bg-green-900 rounded-full"></div>
                          )}
                          <p
                            className="m-2  font-bold cursor-pointer"
                            onClick={() =>
                              selectChat(user.otherParticipant._id)
                            }
                          >
                            {user.otherParticipant.username}
                          </p>
                        </div>
                        {user.unreadMessagesCount > 0 ? (
                          <div className="w-6 h-6 bg-mainColor rounded-full m-2">
                            <p className="flex justify-center text-white">
                              {user.unreadMessagesCount}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="font-bold flex justify-center">
                      No user in the chat
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {chatUser.username ? (
            (!collapsed || chatVisible) && (
              <div className="w-full sm:w-5/6 ">
                <div className="bg-mainColor h-16  rounded-tr-lg">
                  <div className="h-16 flex shadow-inner items-center justify-between">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full overflow-hidden m-2">
                        <Link
                          to={`/user/usersprofile?username=${chatUser.username}`}
                        >
                          <img
                            src={`https://www.dreamhome.cloud/images/${chatUser.profilePic}`}
                            className="object-cover h-full w-full"
                            alt=""
                          />
                        </Link>
                      </div>
                      <Link
                        to={`/user/usersprofile?username=${chatUser.username}`}
                      >
                        <p className="my-4 mx-2 font-bold text-white">
                          {chatUser.username}
                        </p>
                      </Link>
                    </div>
                    {collapsed && (
                      <div className="right-3 mr-4" onClick={chatVisibleToggle}>
                        <AiOutlineClose className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={chatMessageRef}
                  className="max-h-72 h-4/6 overflow-y-auto p-2"
                >
                  {chatMessage.map((message, index) =>
                    message.senderId == userInfo.id ? (
                      <div key={index} className="w-full flex my-2 justify-end">
                        <div className="bg-emerald-500  w-fit text-white p-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg ml-6">
                          {message.content}
                        </div>
                        <div className="w-4 h-4 overflow-hidden rounded-full my-3 mx-2">
                          <img
                            src={`https://www.dreamhome.cloud/images/${userInfo.image}`}
                            className="object-cover h-full w-full"
                            alt=""
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="w-full my-2 flex">
                        <div className="w-4 h-4 overflow-hidden rounded-full my-3 mx-2">
                          <img
                            src={`https://www.dreamhome.cloud/images/${chatUser.profilePic}`}
                            className="object-cover h-full w-full"
                            alt=""
                          />
                        </div>
                        <div className="bg-cyan-600 text-white max-w-1/2 w-fit p-2 rounded-tl-lg rounded-tr-lg rounded-br-lg mr-6">
                          {message.content}
                        </div>
                      </div>
                    )
                  )}
                  <div className=""></div>
                </div>
                {/* {istyping ? (
                  <div className="typingLoding">typing.......</div>
                ) : (
                  <></>
                )} */}
                <div className="h-1/6  rounded-br-lg bg-gray-400 flex justify-center">
                  <form
                    onSubmit={sendMessageHandler}
                    className="flex w-full sm:w-4/6"
                  >
                    <InputEmoji
                      value={typeMessge}
                      onChange={SetTypeMessge} // Update the state directly
                      cleanOnEnter
                      placeholder="Type a message"
                      className="w-3 h-3"
                    />
                    <button type="submit">
                      <TbSend
                        className="w-6 h-6 text-white my-4 cursor-pointer"
                        type="submit"
                      />
                    </button>
                  </form>
                </div>
              </div>
            )
          ) : collapsed == false ? (
            <div className="w-5/6">
              <Lottie options={defaultOptions} className="w-24 h-24" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Messages;
