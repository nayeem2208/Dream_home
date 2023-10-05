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
  const [likedUser, setLikedUsers] = useState([]);
  const [commentcount, setcommentcount] = useState(post.comments.length);
  // const [comment, setcomment] = useState(post.comments);
  const [commentedUser, setCommentedUser] = useState([]);
  const [typecomment, settypedComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  let [likeModal, setLikeModal] = useState(false);
  let [commentModal, setcommentModal] = useState(false);

  let location = useLocation();
  let home = location.pathname.endsWith("/home");

  useEffect(() => {
    // Check if the current user has liked this post
    setLiked(post.likes.some((like) => like.userId === userInfo.id));
  }, [post.likes, userInfo.id]);

  useEffect(() => {
    let fetchData = async () => {
      try {
        let likeUser = await axiosInstance.get(`/postLikes?id=${post._id}`);
        setLikedUsers(likeUser.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (likeModal) {
      fetchData();
    }
  }, [likeModal]);

  useEffect(() => {
    let fetchData = async () => {
      try {
        let commentedUser = await axiosInstance.get(
          `/postcomments?id=${post._id}`
        );
        setCommentedUser(commentedUser.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (commentModal) {
      fetchData();
    }
  }, [commentModal,commentedUser]);

  console.log(commentedUser);

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
      const response = await axiosInstance.put(
        `/postcomment?id=${post._id}&userId=${userInfo.id}`,
        { typecomment }
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

  const likemodalManagement = async () => {
    try {
      setLikeModal(!likeModal);
    } catch (error) {
      console.log(error.message);
    }
  };

  const commentModalManagement = async () => {
    try {
      setcommentModal(!commentModal);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-5xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
      {likeModal && (
        <div>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
            onClick={likemodalManagement}
          ></div>
          <div
            id="defaultModal"
            className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full "
          >
            <div className="relative w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 ">Likes</h3>
                  <button
                    type="button"
                    onClick={likemodalManagement}
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="max-h-[65vh] overflow-y-auto">
                  {likedUser.length > 0 ? (
                    likedUser.map((user) => (
                      <div key={user._id} className="flex py-3 px-4">
                        <div className=" w-14 h-14 rounded-full overflow-hidden ">
                          <img
                            src={`http://localhost:3000/images/${user.profilePic}`}
                            className="h-full w-full object-cover "
                            alt=""
                          />
                        </div>
                        <h2 className="px-4 font-bold mt-2 text-lg">
                          {user.username}
                        </h2>
                      </div>
                    ))
                  ) : (
                    <div className="font-bold flex justify-center py-4">There is no like for the post</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {commentModal && (
        <div>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
            onClick={commentModalManagement}
          ></div>
          <div
            id="defaultModal"
            className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden inset-0"
          >
            <div className="relative w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Comments</h3>
                  <button
                    type="button"
                    onClick={commentModalManagement}
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
                <div className="max-h-[65vh] overflow-y-auto">
                  {" "}
                  {/* Adjust max-height as needed */}
                  {commentedUser.length > 0 ? (
                    <div>
                      {" "}
                      {/* Wrapping content in a div */}
                      {commentedUser.map((user) => (
                        <div key={user._id} className="flex px-4 py-4">
                          <div className="w-12 h-12 overflow-hidden rounded-full mx-5">
                            <img
                              src={`http://localhost:3000/images/${user.profilePic}`}
                              className="h-full w-full object-cover"
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="font-bold">{user.username}</p>
                            <p>{user.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center font-bold py-4">There are no comments</div>
                  )}
                </div>
                <div className="flex py-4">
                  <input
                    type="text"
                    value={typecomment}
                    onChange={(e) => settypedComment(e.target.value)}
                    className="border ml-3 p-2 rounded-lg w-96 w-full text-center placeholder-center"
                    placeholder="Comment here"
                  />
                  <IoSendOutline
                    className="mx-3 mt-3 w-5 h-5 cursor-pointer "
                    onClick={commentHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div  className="flex">
          <div className="flex justify-evenly">
          {liked ? (
            <AiTwotoneLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5 cursor-pointer"
            />
          ) : (
            <AiOutlineLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5  cursor-pointer"
            />
          )}
          <p className="mr-6 ml-3  cursor-pointer" onClick={likemodalManagement}>
            {likeCount}
          </p>
          <BiComment className="mx-3 mt-1 w-5 h-5" />
          <p className="mr-6 cursor-pointer" onClick={commentModalManagement}>
            {commentcount}
          </p>
          </div>
          <input
            type="text"
            value={typecomment}
            onChange={(e) => settypedComment(e.target.value)}
            className="border ml-2 rounded-lg w-3/4 text-center placeholder-center"
            placeholder="Comment here"
          />
          <IoSendOutline
            className="ml-4 mt-1 w-5 h-5 cursor-pointer"
            onClick={commentHandler}
          />
        </div>
        {/* {commentcount>0&&} */}
      </div>
    </div>
  );
}

export default Post;
