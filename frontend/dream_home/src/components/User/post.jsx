// import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import { AiOutlineLike, AiTwotoneLike, AiOutlineMore } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { BiComment } from "react-icons/bi";
import { IoSendOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios";
import { Menu, Transition } from "@headlessui/react";
import Swal from "sweetalert2";

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [likedUser, setLikedUsers] = useState([]);
  const [commentcount, setcommentcount] = useState(post.comments.length);
  const [commentedUser, setCommentedUser] = useState([]);
  const [typecomment, settypedComment] = useState("");

  let [heading, setheading] = useState(post.heading);
  let [description, setDescription] = useState(post.description);
  let [service, setService] = useState(post.service);

  let [likeModal, setLikeModal] = useState(false);
  let [commentModal, setcommentModal] = useState(false);
  let [editModal, setEditModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  let location = useLocation();
  let home = location.pathname.endsWith("/home"); //to check the post is in home page or profile page

  let navigate = useNavigate();

  {
    /*-----------checking post is liked or not--------- */
  }
  useEffect(() => {
    // Check if the current user has liked this post
    setLiked(post.likes.some((like) => like.userId === userInfo.id));
  }, [post.likes, userInfo.id]);

  {
    /*-----------fetching liked users--------- */
  }
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

  {
    /*-----------fetching commented users--------- */
  }
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
  }, [commentModal, commentedUser]);

  {
    /*-----------like management--------- */
  }
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

  {
    /*-----------comment management--------- */
  }
  const commentHandler = async () => {
    try {
      const response = await axiosInstance.put(
        `/postcomment?id=${post._id}&userId=${userInfo.id}`,
        { typecomment }
      );
      settypedComment("");
      if (response.data == "commented") {
        setcommentcount(commentcount + 1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------like modal management--------- */
  }
  const likemodalManagement = async () => {
    try {
      setLikeModal(!likeModal);
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------comment modal management--------- */
  }
  const commentModalManagement = async () => {
    try {
      setcommentModal(!commentModal);
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------delete comment --------- */
  }
  const deleteComment = async (commentId) => {
    try {
      const res = await axiosInstance.delete(
        `/commentDelete?id=${commentId}&postId=${post._id}`
      );
      setcommentcount(commentcount - 1);
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------Edit post modal management--------- */
  }
  const toggleEditModal = async () => {
    try {
      setEditModal(!editModal);
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------Edit post function--------- */
  }
  const editPostfunction = async (e) => {
    e.preventDefault();
    try {
      let res = await axiosInstance.put(`/editPost?id=${post._id}`, {
        heading,
        description,
        service,
      });
      setheading(res.data.heading);
      setDescription(res.data.description);
      setService(res.data.service);
      setEditModal(false);
      if (!home) {
        navigate("/user/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  {
    /*-----------delete post function--------- */
  }
  const deletePost = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this item.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const deleteFunc = async () => {
            const res = await axiosInstance.put(`/deletePost?id=${post._id}`);
            Swal.fire({
              title: "Deleted!",
              text: "The item has been deleted.",
              icon: "success",
              timer: 2000, // Specify the time delay in milliseconds (2 seconds in this case)
              showConfirmButton: false,
            });
            window.scrollTo(0, 0);
            navigate("/");
          };
          deleteFunc();
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const commentLike = async (e) => {
    try {
      const res = await axiosInstance.post("/addCommentLike", e);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
      {/*--------------------Like Dispaly modal-------------- */}
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
                  {likedUser.length > 0 ? (
                    likedUser.map((user) => (
                      <div key={user._id} className="flex py-3 px-4">
                        <div className=" w-14 h-14 rounded-full overflow-hidden ">
                          <img
                            src={`https://www.dreamhome.cloud/images/${user.profilePic}`}
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
                    <div className="font-bold flex justify-center py-4">
                      There is no like for the post
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*--------------------comment modal-------------- */}
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
                      {commentedUser.map((user, index) => (
                        <div
                          key={index}
                          className="flex px-4 py-4 justify-between border-gray-950"
                        >
                          <div className="flex">
                            <div className="w-12 h-12 overflow-hidden rounded-full mx-5">
                              <img
                                src={`https://www.dreamhome.cloud/images/${user.profilePic}`}
                                className="h-full w-full object-cover"
                                alt=""
                              />
                            </div>
                            <div>
                              <p className="font-bold">{user.username}</p>
                              <p>{user.comment}</p>
                              <div className="flex">
                                {console.log("userInfo.id:", userInfo.id)}
                                {console.log(
                                  "user.commentLikes:",
                                  user.commentLikes
                                )}
                               {user.commentLikes.map(like => like._id).includes(userInfo.id) ? (
                                  <AiTwotoneLike
                                    className=" mt-1 w-3 h-3 cursor-pointer"
                                    onClick={() => commentLike(user)}
                                  />
                                ) : (
                                  <AiOutlineLike
                                    className=" mt-1 w-3 h-3  cursor-pointer"
                                    onClick={() => commentLike(user)}
                                  />
                                )}
                                {/* <p>{user.id}</p> */}
                                <p className="mr-6 ml-1  cursor-pointer text-sm">
                                  {user.commentLikes.length}
                                </p>
                              </div>
                            </div>
                          </div>
                          {home
                            ? (userInfo.name === post.user[0].username ||
                                user.username == userInfo.name) && (
                                <div>
                                  <MdDeleteOutline
                                    className="mt-2 w-5 h-5"
                                    onClick={() => deleteComment(user.id)}
                                  />
                                </div>
                              )
                            : userInfo.name === post.user.username && (
                                <div>
                                  <MdDeleteOutline
                                    className="mt-2 w-5 h-5"
                                    onClick={() => deleteComment(user.id)}
                                  />
                                </div>
                              )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center font-bold py-4">
                      There are no comments
                    </div>
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
      {/*--------------------edit post  modal-------------- */}
      {editModal && (
        <div>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
            onClick={toggleEditModal}
          ></div>
          <div
            id="defaultModal"
            className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 ">
                    Edit Post
                  </h3>
                  <button
                    type="button"
                    onClick={toggleEditModal}
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
                <form onSubmit={editPostfunction}>
                  <div className="p-6 space-y-3 flex flex-col">
                    <label htmlFor="Heading">Heading</label>
                    <input
                      type="text"
                      className="rounded-lg"
                      value={heading}
                      onChange={(e) => setheading(e.target.value)}
                    />
                    <label htmlFor="description">Description</label>
                    <textarea
                      type="text"
                      className="rounded-lg"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="service">Service</label>
                    <input
                      type="text"
                      className="rounded-lg"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                    <button
                      data-modal-hide="defaultModal"
                      type="submit"
                      className="text-white font-semibold  bg-mainColor hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                    >
                      Post
                    </button>
                    <button
                      data-modal-hide="defaultModal"
                      type="button"
                      onClick={toggleEditModal}
                      className="text-gray-500 font-semibold bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex mx-5 my-4 justify-between">
        <div className="flex ">
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
        {/* -----------------dropdown --------------*/}
        {home ? (
          userInfo.name === post.user[0].username ? (
            <Menu as="div" className="relative inline-block text-left ">
              <div className="mb-3">
                <Menu.Button className="inline-flex w-full  rounded-md  bg-opacity-20  font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {/* <RxDropdownMenu className="mx-2 w-6 h-6 " /> */}
                  <AiOutlineMore className="w-8 h-8" />
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
                        <button
                          className={`${
                            active
                              ? "bg-mainColor text-white hover:bg-opacity-50 !important"
                              : "text-gray-900 hover:bg-gray-100 !important"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                          onClick={toggleEditModal}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        // <Link to="/user/messages">
                        <button
                          className={`${
                            active ? "bg-mainColor text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 `}
                          onClick={deletePost}
                        >
                          Delete
                        </button>
                        // </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            ""
          )
        ) : userInfo.name === post.user.username ? (
          <Menu as="div" className="relative inline-block text-left ">
            <div className="mb-3">
              <Menu.Button className="inline-flex w-full  rounded-md  bg-opacity-20  font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {/* <RxDropdownMenu className="mx-2 w-6 h-6 " /> */}
                <AiOutlineMore className="w-8 h-8" />
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
                      <button
                        className={`${
                          active
                            ? "bg-mainColor text-white hover:bg-opacity-50 !important"
                            : "text-gray-900 hover:bg-gray-100 !important"
                        } group flex w-full items-center rounded-md px-2 py-2 `}
                        onClick={toggleEditModal}
                      >
                        Edit
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      // <Link to="/user/messages">
                      <button
                        className={`${
                          active ? "bg-mainColor text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 `}
                      >
                        Delete
                      </button>
                      // </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          ""
        )}
        {/* -------------------------------------*/}
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
      {/*-------------- image carousel --------------*/}
      {post.media.length > 0 && (
        <div>
          <Carousel
            className="px-2"
            useKeyboardArrows
            infiniteLoop
            showThumbs={false}
          >
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
                    src={`https://www.dreamhome.cloud/images/${image}`}
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
      {/*-------------------Like and comment --------------------*/}
      <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
        <div className="flex">
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
            <p
              className="mr-6 ml-3  cursor-pointer"
              onClick={likemodalManagement}
            >
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
      </div>
    </div>
  );
}

export default Post;
