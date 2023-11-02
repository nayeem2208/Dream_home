// import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { IoSendOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axios/axios";

function PostCards({ post, servies }) {
  const { userInfo } = useSelector((state) => state.auth);

  let location = useLocation();
  let home = location.pathname.endsWith("/home");

  return (
    <div className="w-96 items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 ">
      <div className="flex mx-5 my-4">
        <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2">
          {home ? (
            <img
              src={
                post.user[0].profilePic
                  ? `https://www.dreamhome.cloud/images/${post.user[0].profilePic}`
                  : `https://www.dreamhome.cloud/images/${post.user.profilePic}`
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          ) : (
            // <h1>home</h1>
            <img
              src={
                post.user.profilePic
                  ? `https://www.dreamhome.cloud/images/${post.user.profilePic}`
                  : `https://www.dreamhome.cloud/images/${post.user[0].profilePic}`
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          )}
        </div>
        {home ? (
          <Link to={`/user/usersprofile?username=${post.user[0].username}`}>
            <h5 className="text-2xl tracking-tight text-gray-900">
              {post.user[0].username}
            </h5>
            <p className="text-xs text-slate-700 font-thin">
              {post.dateOfPosted}
            </p>
          </Link>
        ) : (
          <Link to={`/user/usersprofile?username=${post.user[0].username}`}>
            <h5 className="text-2xl tracking-tight text-gray-900">
              {post.user[0].username}
            </h5>
            <p className="text-xs text-slate-700 font-thin">
              {post.dateOfPosted}
            </p>
          </Link>
        )}
      </div>
      <div className="p-5">
        {servies ? (
          <div>
            <Link to={`/postview?id=${post?._id}`}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {post.service}
              
            </h5>
            <h5 className="mb-2  tracking-tight text-gray-900">
              {post.heading}
            </h5>
            </Link>
          </div>
        ) : (
          <Link to={`/postview?id=${post?._id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {post.heading}
          </h5></Link>
        )}
        {post.media ? (
          <div className="flex w-64 h-32 overflow-hidden">
            {post.media?.map((mediaUrl, index) => (
              <img
                key={index} 
                src={`https://www.dreamhome.cloud/images/${mediaUrl}`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="mx-2"
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="h-12 mb-2"></div>
        )}
      </div>
    </div>
  );
}

export default PostCards;
