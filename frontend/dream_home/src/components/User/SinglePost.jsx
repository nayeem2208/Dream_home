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

function SinglePost() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedUser, setLikedUsers] = useState([]);
  const [commentcount, setcommentcount] = useState(0);
  const [commentedUser, setCommentedUser] = useState([]);
  const [typecomment, settypedComment] = useState("");

  let [post, setpost] = useState([]);
  let [likeModal, setLikeModal] = useState(false);
  let [commentModal, setcommentModal] = useState(false);
  let [editModal, setEditModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  let navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    try {
      let fetchData = async () => {
        let res = await axiosInstance.get(`/postview?id=${id}`);
        setpost(res.data.post);
        setLikeCount(res.data.post.likes.length);
        setcommentcount(res.data.post.comments.length);
        setCommentedUser(res.data.usersWithComments);
        // setLiked(post.likes.Includes(userInfo.id));
        const userHasLiked = await res.data.post.likes.some(
          (like) => like.userId === userInfo.id
        );
        setLiked(userHasLiked);
      };
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  }, [commentcount]);

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
  }, [commentModal, commentedUser]);

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

  // const toggleEditModal = async () => {
  //   try {
  //     setEditModal(!editModal);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const editPostfunction = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let res = await axiosInstance.put(`/editPost?id=${post._id}`, {
  //       heading,
  //       description,
  //       service,
  //     });
  //     // setheading(res.data.heading);
  //     // setDescription(res.data.description);
  //     // setService(res.data.service);
  //     setEditModal(false);

  //     // navigate("/");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const deletePost = async (e) => {
  //   e.preventDefault();
  //   try {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You are about to delete this item.",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#d33",
  //       cancelButtonColor: "#3085d6",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         const deleteFunc = async () => {
  //           const res = await axiosInstance.put(`/deletePost?id=${post._id}`);
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "The item has been deleted.",
  //             icon: "success",
  //             timer: 2000, // Specify the time delay in milliseconds (2 seconds in this case)
  //             showConfirmButton: false,
  //           });
  //           window.scrollTo(0, 0);
  //           navigate("/");
  //         };
  //         deleteFunc();
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  return (
    <div className="p-12 w-screen flex justify-center">
      <div className="max-w-12xl lg:flex  bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
        
        <div className="lg:w-4/5 p-2" >
          {post.media?.length > 0 && (
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
        </div>
        <div className={`p-5 ${post.media?.length > 0 ? ' lg:w-2/6' : 'w-6/6'}`}>
        {/* <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2">
            
              <img
                src={
                    `http://localhost:3000/images/${post.user.profilePic}`
                }
                className="h-full w-full object-cover"
                alt="User Image"
              />
           
          </div> */}
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
          <div className="flex">
            <div className="flex left -0">
              {liked ? (
                <AiTwotoneLike
                  onClick={handleLikeToggle}
                  className="ml-2 mt-1 w-5 h-5 cursor-pointer"
                />
              ) : (
                <AiOutlineLike
                  onClick={handleLikeToggle}
                  className="ml-2 mt-1 w-5 h-5  cursor-pointer"
                />
              )}
              <p
                className="mr-4 ml-3  cursor-pointer"
                onClick={likemodalManagement}
              >
                {likeCount}
              </p>
              <BiComment className="mx-2 mt-1 w-5 h-5" />
              <p
                className="mr-6 cursor-pointer"
                onClick={commentModalManagement}
              >
                {commentcount}
              </p>
            </div>
          </div>
          <div className="  mt-8 max-h-72 overflow-y-auto">
            {/* <span>Comments</span> */}
            {commentedUser.map((user) => (
              <div key={user.id} className="user-profile">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div className="profile-image h-8 w-8 rounded-full overflow-hidden mr-2">
                    <img
                      src={`http://localhost:3000/images/${user.profilePic}`}
                      alt={`Profile Image of ${user.username}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div><Link to={`/user/usersprofile?username=${user.username}`}>
                  <p className="font-bold text-sm">{user.username}</p></Link>
                  <p className="text-sm">{user.comment}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdDeleteOutline className="w-4 h-4 ml-2" onClick={() => deleteComment(user.id)} />
                </div>
              </div>
            </div>
            
              
            ))}
            
          </div>
          <div className="flex mt-4">
              {" "}
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

          {/*-------------- image carousel --------------*/}

          {/*-------------------Like and comment --------------------*/}
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
