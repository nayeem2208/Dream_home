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

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentcount, setcommentcount] = useState(post.comments.length);
  const [comment, setcomment] = useState(post.comments);
  const [typecomment, settypedComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  let location = useLocation();
  let home = location.pathname.endsWith("/home");

  useEffect(() => {
    // Check if the current user has liked this post
    setLiked(post.likes.some((like) => like.userId === userInfo.id));
  }, [post.likes, userInfo.id]);

  const handleLikeToggle = async () => {
    try {
      const response = await axiosInstance.put(
        `/postlike?id=${post._id}&userId=${userInfo.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data === "liked") {
        setLiked(true);
        setLikeCount(likeCount + 1);
      } else if (response.data === "unliked") {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const commentHandler = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/postcomment?id=${post._id}&userId=${userInfo.id}`,
        { typecomment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      settypedComment("");
      if (response.data == "commented") {
        setcommentcount(commentcount + 1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-5xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
      <div className="flex mx-5 my-4">
        <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2">
          {home ? (
            <img
              src={
                post.user[0].profilePic
                  ? `http://localhost:3000/images/${post.user[0].profilePic}`
                  : `http://localhost:3000/images/${post.user.profilePic}`
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          ) : (
            // <h1>home</h1>
            <img
              src={
                post.user.profilePic
                  ? `http://localhost:3000/images/${post.user.profilePic}`
                  : `http://localhost:3000/images/${post.user[0].profilePic}`
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
          <Link to={`/user/usersprofile?username=${post.user.username}`}>
            <h5 className="text-2xl tracking-tight text-gray-900">
              {post.user.username}
            </h5>
            <p className="text-xs text-slate-700 font-thin">
              {post.dateOfPosted}
            </p>
          </Link>
        )}
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
                <div
                  style={{
                    width: "100%",
                    paddingBottom: "56.25%", // 16:9 aspect ratio (9 / 16 = 0.5625)
                    position: "relative",
                  }}
                >
                  <img
                    src={`http://localhost:3000/images/${image}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt={`Image ${imageIndex + 1}`}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
        <div className="flex">
          {liked ? (
            <AiTwotoneLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5"
            />
          ) : (
            <AiOutlineLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5"
            />
          )}
          <p className="mr-6">{likeCount}</p>
          <BiComment className="mx-3 mt-1 w-5 h-5" />
          <p className="mr-6">{commentcount}</p>
          <input
            type="text"
            value={typecomment}
            onChange={(e) => settypedComment(e.target.value)}
            className="border ml-2 rounded-lg w-3/4 text-center placeholder-center"
            placeholder="Comment here"
          />
          <IoSendOutline
            className="ml-4 mt-1 w-5 h-5"
            onClick={commentHandler}
          />
        </div>
        {/* {commentcount>0&&} */}
      </div>
    </div>
  );
}

export default Post;
