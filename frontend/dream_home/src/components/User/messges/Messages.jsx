import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { TbSend } from "react-icons/tb";
import { GrAdd } from "react-icons/gr";
import axiosInstance from "../../../axios/axios";
// import backgroundImg from '../../../../public/pxfduel.jpg'

// const loginPageStyle = {
//     background: `rgba(0, 0, 0, 0.02) url(${backgroundImg})`, // Replace with the actual path to your image
//     backgroundSize: 'cover',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     minHeight: '40vh', // Ensure the background covers the entire viewport height
//     display: 'flex',
//     justifyContent: 'center',
//     marginRight:'1px',
//     alignItems: 'center',
//     opacity:0.2
//   };

function Messages() {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [allUser,setAllUser]=useState([])

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  console.log(allUser,'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
  useEffect(()=>{
    const fetchData=async()=>{
      const res=await axiosInstance.get('/chatroom')
      setAllUser(res.data)
    }
    fetchData()
  },[])
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
                    <div className="relative w-full max-w-2xl ">
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
                                stroke-Linecap="round"
                                stroke-linejoin="round"
                                stroke-Width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* <AiOutlineSearch className="cursor-pointer mt-4 transform -translate-y-1/2 mx-2 w-5 h-5" /> */}
            </div>
            <div className=" max-h-72 overflow-y-auto mx-3 my-3">
              <div className=" h-16 flex">
                {" "}
                <div className="w-12 h-12 mx-2 my-2 rounded-full bg-black"></div>
                <p className="font-bold my-3">Nayeem CE</p>
              </div>
            </div>
          </div>
          <div className="w-4/6">
            <div className="bg-mainColor h-16 rounded-tr-lg">
              <div className=" h-16 flex shadow-inner">
                {" "}
                <div className="w-12 h-12 mx-2 my-2 rounded-full bg-white"></div>
                <p className="font-bold my-3 text-white text-xl">Nayeem CE</p>
              </div>
            </div>
            <div className="max-h-72 h-4/6 overflow-y-auto ">
              <div className="bg-black"></div>
            </div>
            <div className="h-1/6  rounded-br-lg bg-gray-400 flex justify-center">
              <textarea
                name=""
                id=""
                cols="60"
                rows="2"
                className="m-2 rounded-xl w-4/5"
              ></textarea>
              <TbSend className="w-6 h-6 text-white my-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
