import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";

function Notification() {
  let [notifications, setNotification] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let res = await axiosInstance.get("/getnotification");
      setNotification(res.data);
    };
    fetchData();
  }, []);
  console.log(notifications);
  return (
    <div className="w-screen flex justify-center py-24">
      <div className="w-3/5 flex flex-col   bg-mainColor h-full ">
        <div className="bg-black w-full h-20 ">
          <div className="my-3 mx-2">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              All
            </button>
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Post
            </button>
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Follows
            </button>
          </div>
        </div>
        {notifications.length > 0 ? (
          <div className="px-12 py-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex px-3 pb-3">
                <div className="h-12 w-12 rounded-full overflow-hidden my-3">
                  <img
                    src={`http://localhost:3000/images/${notification.user[0].profilePic}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mx-3 my-3">
                  <span className="mr-3 font-bold">{notification.user[0].username}</span>
                  <span className="mr-3">
                    {notification.Post[0].likes.length > 1
                      ? ` and ${
                          notification.Post[0].likes.length - 1
                        } others people liked your photo`
                      : 'liked your photo'}
                  </span>
                </div>
                <div className="flex-grow"></div>
                <div className="h-16 w-16 overflow-hidden ">
                      <img src={`http://localhost:3000/images/${notification.Post[0].media[0]}`} alt="" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>There is no notification to display</div>
        )}
      </div>
    </div>
  );
}

export default Notification;
