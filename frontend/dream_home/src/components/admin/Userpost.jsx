import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axios/adminaxios";

function UserPost({ post }) {

  let [blocked,setBlocked]=useState(false)

  const blockHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await axiosInstance.put(
        `/blockPost?postId=${post._id}`
      );
      if(res.data=='unblocked'){
        setBlocked(false)
      }
      else{
        setBlocked(true)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex">
      <div className="max-w-4xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
        <div className="flex mx-5 my-4">
          <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2">
            <img
              src={
                post.user.profilePic
                  ? `https://www.dreamhome.fun/images/${post.user.profilePic}`
                  : null
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          </div>
          {/* <Link to={`/user/usersprofile?username=${post.user.username}`}> */}
          <div>
            <h5 className="text-2xl tracking-tight text-gray-900">
              {post.user.username}
            </h5>
            <p className="text-xs text-slate-700 font-thin">
              {post.dateOfPosted}
            </p>
            </div>
          {/* </Link> */}
        </div>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {post.heading}
            </h5>
          </a>

          <p className="mb-3 font-normal text-gray-700 dark:text-gray-700">
            {post.description}
          </p>

          <p className="mb-3 font-normal text-gray-700 dark:text-gray-700">
            service: {post.service}
          </p>
        </div>
        {post.media.length > 0 && (
          <div>
            <Carousel className="px-2" useKeyboardArrows infiniteLoop>
              {post.media.map((image, imageIndex) => (
                <div className="slide" key={imageIndex}>
                  <img
                    src={`https://www.dreamhome.fun/images/${image}`}
                    style={{ maxHeight: "40vh", width: "auto" }}
                    alt={`Image ${imageIndex + 1}`}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
      {/* {!blocked?<button
        type="button"
        onClick={blockHandler}
        className=" my-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 max-h-12 mx-4"
      >
        Block
      </button>:<button type="button" onClick={blockHandler} className="my-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 max-h-12 mx-4">Unblock</button>} */}
    </div>
  );
}

export default UserPost;
