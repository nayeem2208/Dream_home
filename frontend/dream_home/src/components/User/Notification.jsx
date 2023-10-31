import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import { Link } from "react-router-dom";

function Notification() {
  let [notifications, setNotification] = useState([]);
  let [filterNotificatioins, setFilterNotifications] = useState([]);
  const [loader,setLoader]=useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/getnotification");
      setNotification(res.data);
      setFilterNotifications(res.data);
      setLoader(false)
    };
    fetchData();
  }, []);

  const postNotification=async()=>{
    try {
      const postFilter=filterNotificatioins.filter((n)=>n.action=='like'||n.action=='comment')
      setNotification(postFilter)
    } catch (error) {
      console.log(error.message)
    }
  }
  const allNotification=async()=>{
    try {
      setNotification(filterNotificatioins)
    } catch (error) {
      console.log(error.message)
    }
  }
  const followNotifications=async()=>{
    try {
      const followFilter=filterNotificatioins.filter((n)=>n.action=='follow')
      console.log(followFilter)
      setNotification(followFilter)
    } catch (error) {
      console.log(error.message)
    }
  }
  function formatTimeDifference(timeStamp) {
    const currentTime = new Date();
    const notificationTime = new Date(timeStamp);
  
    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - notificationTime;
  
    // Calculate seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000); // 1 second = 1000 milliseconds
    const minutes = Math.floor(seconds / 60); // 1 minute = 60 seconds
    const hours = Math.floor(minutes / 60); // 1 hour = 60 minutes
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'd' : 'd'} `;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'h' : 'h'} `;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'm' : 'm'} `;
    } else {
      return `${seconds} ${seconds === 1 ? 's' : 's'} `;
    }
  }
  
  return (
    <div className="w-screen flex justify-center py-24 ">
       {loader&&<div class="loader"></div>}
      <div className="w-full sm:w-4/6 mx-12 sm:mx-2 flex flex-col bg-gray-200   h-full rounded-md shadow-xl">
        <div className="bg-mainColor w-full h-20 sticky top-[54px] rounded-md">
          <div className="my-4 mx-2 ">
            <button
              type="button"
              onClick={allNotification}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              All
            </button>
            <button
              type="button"
              onClick={postNotification}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Post
            </button>
            <button
              type="button"
              onClick={followNotifications}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Follows
            </button>
          </div>
        </div>
        {notifications.length > 0 ? (
          <div className="pl-3 sm:pl-4 py-3 pr-3 sm:pr-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex  pb-3 my-4 sm:my-0 shadow sm:px-5 ">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full overflow-hidden sm:my-6 sm:my-3">
                  <img
                    src={`http://localhost:3000/images/${notification.user[0].profilePic}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mx-3 sm:my-5 sm:pt-4">
                  <span className="mr-3 text-xs sm:text-base font-bold"><Link
                          to={`/user/usersprofile?username=${notification.user[0]?.username}`}
                        >
                    {notification.user[0]?.username}</Link>
                  </span>
                  {/* <Link to={`/postview?id=${notification.post[0]?._id}`}> */}
                  <span className="mr-3"><Link to={`/postview?id=${notification.Post[0]?._id}`}>
                    {notification.action == "like" &&
                      (notification.Post[0]?.likes.length > 1
                        ? ` and ${
                            notification.Post[0]?.likes.length - 1
                          } others people liked your photo`
                        : "liked your photo")}
                    {notification.action == "comment" &&
                      `commented on your photo "${notification.comment}"`}
                      </Link>
                    {notification.action == "follow" && "started following you"}
                  </span>
                  {/* </Link> */}
                </div>
                <div className="flex-grow "></div>
                <div className="h-12 w-12 sm:h-16 sm:w-16 overflow-hidden pt-4">
                  <img
                    src={`http://localhost:3000/images/${notification.Post[0]?.media[0]}`}
                    alt=""
                  />
                </div>
                <div className="w-24 h-8 sm:pt-4 ">
                <span  className="mx-2  sm:mx-6 sm:my-4 text-xs ">{formatTimeDifference(notification.timeStamp)}</span>
              </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-3 my-3 font-bold h-24 flex justify-center">There is no notification to display</div>
        )}
      </div>
    </div>
  );
}

export default Notification;
