import React, { useEffect, useState } from "react";
import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import userimage from "../../../assets/149071.png";
import { BsPencil } from "react-icons/bs";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { RiUserFollowLine } from "react-icons/ri";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Post from "../post";
import { Link } from "react-router-dom";
import { PiCrown } from "react-icons/pi";
import axiosInstance from "../../../axios/axios";
import { ChatState } from "../../../../context/chatProvider";

function UserProfile() {
  let [modalVisible, setModalVisible] = useState(false);
  let [profileModalVisible, setProfileModalVisible] = useState(false);
  let [followerVisible, setfollowerVisible] = useState(false);
  let [followingVisible, setfollowingVisible] = useState(false);

  let [userDetailss, Setuserdetails] = useState(false);
  let [username, SetUsername] = useState("");
  let [name, setName] = useState("");
  let [Phone, SetPhone] = useState("");
  let [email, SetEmail] = useState("");
  let [coverpic, setCoverPic] = useState("");
  let [coverpicPreview, setCoverPicPreview] = useState("");
  let [profilePic, SetProfilPic] = useState("");
  let [profilePicPreview, SetProfilePicPreview] = useState("");
  let [AboutUs, SetAboutUs] = useState("");
  let [following, setFollowing] = useState([]);
  let [followingId, SetfollowingId] = useState([]);
  let [followingcount, setFolloweingcount] = useState("");
  let [followerscount, setFollowerscount] = useState("");
  let [followers, setFollowers] = useState([]);
  let [posts, setPosts] = useState([]);
  const [loader,setLoader]=useState(true)

  let { userInfo } = useSelector((state) => state.auth);
  const { headerRefresh, setHeaderRefresh } = ChatState();

  const uploadCoverPIcHandler = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("id", userInfo.id);
      formData.append("file", coverpic);

      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.put(
          `https://www.dreamhome.cloud/uploadcoverPic`,
          formData,
          {
            headers: {
              // Add any necessary headers, such as authentication headers
              Authorization: `Bearer ${token}`, // Example for authentication
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );

        setModalVisible(false);
        toast("Cover photo succesfully updated", 2000);
        Setuserdetails(!userDetailss);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const usernamePattern = /^[^\s]+$/;
  const phoneNumberPattern = /^\d{10}$/;

  const editProfile = async (e) => {
    e.preventDefault();
    try {
      if ((username, email, Phone)) {
        if (usernamePattern.test(username)) {
          if (phoneNumberPattern.test(Phone)) {
            let FD = new FormData();
            FD.append("id", userInfo.id);
            FD.append("file", profilePic);
            FD.append("username", username);
            FD.append("name", name);
            FD.append("Phone", Phone);
            FD.append("email", email);
            if (AboutUs) {
              FD.append("AboutUs", AboutUs);
            }
            const token = localStorage.getItem("token");
            if (token) {
              let res = await axios.put(
                `https://www.dreamhome.cloud/editProfile`,
                FD,
                {
                  headers: {
                    // Add any necessary headers, such as authentication headers
                    Authorization: `Bearer ${token}`, // Example for authentication
                    "Content-Type": "multipart/form-data", // Important for file uploads
                  },
                }
              );
              setProfileModalVisible(false);
              toast("Profile succesfully edited ", 2000);
              Setuserdetails(!userDetailss);
              setHeaderRefresh(!headerRefresh)
            }
          } else toast.error("Please give a proper phone number");
        } else toast.error("Please give a valid username");
      } else toast.error("Please fill the fields");
    } catch (error) {
      console.log(error.message);
    }
  };
  {
    /*---------------fetching user profile data-------------- */
  }
  useEffect(() => {
    const userDetails = async () => {
      try {
        window.scrollTo(0, 0);
        const userId = userInfo.id;
        let res = await axiosInstance.get(`/getUserProfile?id=${userId}`);

        SetUsername(res.data.username);
        SetPhone(res.data.phone);
        SetEmail(res.data.email);
        setCoverPic(res.data.coverPic);
        SetProfilPic(res.data.profilePic);
        SetAboutUs(res.data.aboutUs);
        setName(res.data.name);
        setFollowerscount(res.data.followers.length);
        setFolloweingcount(res.data.following.length);
        setFollowers(res.data.followersDetails);
        setFollowing(res.data.followingDetails);
        setPosts(res.data.post);
        setLoader(false)
        const updatedFollowingId = res.data.followingDetails.map(
          (follow) => follow._id
        );
        SetfollowingId(updatedFollowingId);
      } catch (error) {
        console.log(error);
      }
    };
    userDetails();
  }, [userDetailss]);
  {
    /*---------------Cover photo edit toggle-------------- */
  }
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Setuserdetails(!userDetailss);
  };

  {
    /*---------------edit profile toggle------------- */
  }
  const profiletoggleModal = () => {
    setProfileModalVisible(!profileModalVisible);
    Setuserdetails(!userDetailss);
  };

  {
    /*---------------followers list modal-------------- */
  }
  const followersToggle = () => {
    setfollowerVisible(!followerVisible);
  };
  {
    /*---------------following list modal-------------- */
  }
  const followingToggle = () => {
    setfollowingVisible(!followingVisible);
  };
  {
    /*---------------following management----(follow and unfollow)-------------- */
  }
  const modalfollowManagement = async (user) => {
    try {
      let updatedFollowing = [...following];
      if (following.some(f => f._id === user._id)) {
        updatedFollowing = updatedFollowing.filter(f => f._id !== user._id);
        setFolloweingcount(followingcount-1)
      } else {
        updatedFollowing.push({ _id: user._id });
        setFolloweingcount(followingcount+1)
      } 
      setFollowing(updatedFollowing);
      let res = await axiosInstance.put(
        `https://www.dreamhome.cloud/follow?id=${user.username}&userId=${userInfo.id}`
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const modalfollowersManagement = async (user) => {
    try {
      if (followingId.includes(user._id)) {
       let index=followingId.indexOf(user._id)
       followingId.splice(index,1)
        setFolloweingcount(followingcount-1)
      } else {  
        followingId.push(user._id)     
        setFolloweingcount(followingcount+1)
      }
      let res = await axiosInstance.put(
        `https://www.dreamhome.cloud/follow?id=${user.username}&userId=${userInfo.id}`
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  



  useEffect(() => {
    // Your UI updating logic here
  }, [following,followerscount]);

  return (
    <div>
       {loader&&<div className="loader"></div>}
      <div>
        <div className="relative w-screen h-96">
          <img
            src={coverpic ? `https://www.dreamhome.cloud/images/${coverpic}` : null}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute  bottom-0 right-0 z-10 mr-8  mb-6 ">
            <BsPencil
              className="w-5 h-5 text-mainColor"
              onClick={toggleModal}
            />
          </div>
          {/*---------------Cover photo edit toggle-------------- */}
          {modalVisible && (
            <div>
              <div
                className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                onClick={toggleModal}
              ></div>
              <div
                id="defaultModal"
                className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full"
              >
                <div className="relative w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 ">
                        Upload cover picture
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
                            stroke-Linejoin="round"
                            stroke-Width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <form onSubmit={uploadCoverPIcHandler}>
                      <div className="p-6 space-y-3 flex flex-col">
                        <label htmlFor="Media">Media</label>
                        <input
                          type="file"
                          className="rounded-lg bg-mainColor py-2 px-4 text-white cursor-pointer hover:bg-hoverColor transition duration-300" // Hide the default file input
                          id="file" // Add an ID for easier styling
                          accept=".jpg, .jpeg, .png" // Specify accepted file types
                          onChange={(e) => {
                            setCoverPic(e.target.files[0]);
                            setCoverPicPreview(
                              URL.createObjectURL(e.target.files[0])
                            );
                          }}
                        />
                        {coverpicPreview && (
                          <img
                            src={coverpicPreview}
                            alt="Cover Pic Preview"
                            className="mt-3 max-h-40"
                          />
                        )}
                      </div>

                      <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                        <button
                          data-modal-hide="defaultModal"
                          type="submit"
                          className="text-white font-semibold  bg-mainColor hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                        >
                          Upload
                        </button>
                        <button
                          data-modal-hide="defaultModal"
                          type="button"
                          onClick={toggleModal}
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

          <div className="sm:h-44 sm:w-44 sm:rounded-full sm:overflow-hidden sm:absolute sm:top-60 sm:left-16   h-32 w-32 rounded-full overflow-hidden absolute top-60 left-1/3 mt-9">
            <img
              src={
                profilePic
                  ? `https://www.dreamhome.cloud/images/${profilePic}`
                  : userimage
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          </div>
        </div>
        <div className="px-7 mb-12 xl:px-24">
          <div className="flex flex-col mt-4 sm:flex-row items-center justify-between">
            {username ? (
              <h1 className="text-4xl mt-6  sm:mt-14 ">{username}</h1>
            ) : (
              <h1 className="text-4xl mt-6  sm:mt-14 ">Username</h1>
            )}
            <div className="flex">
              <Link to={'/premiumOptions'}>
              <button
                type="button"
                className="flex items-center h-9 mt-4 sm:mt-16 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 px-5 py-2.5 sm:mx-4"
              >
                <span>Premium </span>
                <PiCrown className="w-4 h-4 ml-2 text-yellow-400" />

              </button></Link>

              <button
                type="button"
                onClick={profiletoggleModal}
                className="h-9 flex items-center mt-4 sm:mt-16 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 sm:mx-4"
              >
                Edit Profile <BsPencil
              className="w-3 h-3 ml-2 text-yellow-200"
            />
              </button>
            </div>
            
            {/*---------------edit profile toggle------------- */}
            {profileModalVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={profiletoggleModal}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 ">
                          Edit your profile
                        </h3>
                        <button
                          type="button"
                          onClick={profiletoggleModal}
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
                              stroke-Linejoin="round"
                              stroke-Width="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <form onSubmit={editProfile}>
                        <div className="p-6 space-y-3 flex flex-col">
                          <label htmlFor="Username">Username</label>
                          <input
                            type="text"
                            className="rounded-lg"
                            value={username}
                            onChange={(e) => SetUsername(e.target.value)}
                          />
                          <label htmlFor="Username">Name</label>
                          <input
                            type="text"
                            value={name}
                            className="rounded-lg"
                            onChange={(e) => setName(e.target.value)}
                          />
                          <label htmlFor="Phone">Phone</label>
                          <input
                            type="number"
                            className="rounded-lg"
                            value={Phone}
                            onChange={(e) => SetPhone(e.target.value)}
                          />
                          <label htmlFor="Email">Email</label>
                          <input
                            type="email"
                            className="rounded-lg"
                            value={email}
                            onChange={(e) => SetEmail(e.target.value)}
                          />
                          <label htmlFor="About Us">About Us</label>
                          <textarea
                            name=""
                            id=""
                            cols="10"
                            rows="4"
                            className="rounded-lg"
                            value={AboutUs}
                            onChange={(e) => SetAboutUs(e.target.value)}
                          />
                          <label htmlFor="Media">Media</label>
                          <input
                            type="file"
                            className="rounded-lg bg-mainColor py-2 px-4 text-white cursor-pointer hover:bg-hoverColor transition duration-300" // Hide the default file input
                            id="file" // Add an ID for easier styling
                            accept=".jpg, .jpeg, .png" // Specify accepted file types
                            onChange={(e) => {
                              SetProfilPic(e.target.files[0]);
                              SetProfilePicPreview(
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {profilePicPreview && (
                            <img
                              src={profilePicPreview}
                              alt="Cover Pic Preview"
                              className="mt-3 max-w-xs max-h-96  h-100 w-100"
                            />
                          )}
                        </div>

                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                          <button
                            data-modal-hide="defaultModal"
                            type="submit"
                            className="text-white font-semibold  bg-mainColor hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                          >
                            Upload
                          </button>
                          <button
                            data-modal-hide="defaultModal"
                            type="button"
                            onClick={profiletoggleModal}
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
            {/*---------------followers list modal-------------- */}
            {followerVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={followersToggle}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 ">
                          Followers
                        </h3>
                        <button
                          type="button"
                          onClick={followersToggle}
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
                              stroke-Linejoin="round"
                              stroke-Width="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <div>
                        {followers.length > 0 ? (
                          followers.map((follower) => (
                            <div className="flex py-4 items-center justify-between">
                              <div className="flex">
                                <Link
                                  to={`/user/usersprofile?username=${follower.username}`}
                                >
                                  <div className="h-9 w-9  sm:h-16 sm:w-16 mx-5 sm:rounded-full sm:overflow-hidden h-32 w-32 rounded-full overflow-hidden">
                                    <img
                                      src={
                                        profilePic
                                          ? `https://www.dreamhome.cloud/images/${follower.profilePic}`
                                          : userimage
                                      }
                                      className="h-full w-full object-cover"
                                      alt="User Image"
                                    />
                                  </div>
                                </Link>

                                <Link
                                  to={`/user/usersprofile?username=${follower.username}`}
                                >
                                  <h1
                                    className="font-bold text-base sm:text-lg  mt-0 sm:mt-4 "
                                    key={follower._id}
                                  >
                                    {follower.username}
                                  </h1>
                                </Link>
                              </div>
                              {followingId.indexOf(follower._id) !== -1 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    modalfollowersManagement(follower)
                                  }
                                  className="mx-3 sm:mx-6 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-2 sm:px-5 py-1 sm:py-2.5 text-center"
                                >
                                  Following
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    modalfollowersManagement(follower)
                                  }
                                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                >
                                  Follow
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <h1 className="font-bold py-3 mx-3 text-center">
                            you dont have a followers
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/*---------------following list modal-------------- */}
            {followingVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={followingToggle}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] "
                >
                  <div className="relative w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 ">
                          Following
                        </h3>
                        <button
                          type="button"
                          onClick={followingToggle}
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
                      <div>
                        {following.length > 0 ? (
                          following.map((following) => (
                            <div className="flex py-4 items-center justify-between">
                              <div className="flex">
                                <Link
                                  to={`/user/usersprofile?username=${following.username}`}
                                >
                                  <div className="h-9 w-9  sm:h-16 sm:w-16 mx-5 sm:rounded-full sm:overflow-hidden h-32 w-32 rounded-full overflow-hidden">
                                    <img
                                      src={
                                        profilePic
                                          ? `https://www.dreamhome.cloud/images/${following.profilePic}`
                                          : userimage
                                      }
                                      className="h-full w-full object-cover"
                                      alt="User Image"
                                    />
                                  </div>
                                </Link>
                                <Link
                                  to={`/user/usersprofile?username=${following.username}`}
                                >
                                  <h1
                                    className="font-bold text-base sm:text-lg  mt-0 sm:mt-4 "
                                    key={following._id}
                                  >
                                    {following.username}
                                  </h1>
                                </Link>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  modalfollowManagement(following)
                                }
                                className="mx-3 sm:mx-6 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-2 sm:px-5 py-1 sm:py-2.5 text-center"
                              >
                                Following
                              </button>
                            </div>
                          ))
                        ) : (
                          <h1 className="font-bold py-3 mx-3 text-center">
                            You are not following anyone !
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sm:flex sm:space-x-4">
            <div className="sm:w-1/2">
              {name ? (
                <h3 className="text-2xl mt-9 sm:mt-14 ">{name}</h3>
              ) : (
                <h3 className="text-2xl sm:mt-14 ">name</h3>
              )}
              {Phone ? <p>{Phone}</p> : <p>Add your phone number</p>}
              {email ? <p>{email}</p> : <p>Add your email number</p>}
              <div className="flex mt-4">
                <button onClick={followersToggle}>
                  <p className="font-bold">{followerscount} followers</p>
                </button>
                <button onClick={followingToggle} className="ml-4">
                  <p className="font-bold">{followingcount} following</p>
                </button>
              </div>
              {AboutUs ? (
                <p className="mt-7">{AboutUs}</p>
              ) : (
                <p className="mt-7">Add something about you</p>
              )}
            </div>
            <div className="sm:w-1/2"></div>
          </div>
          <div className=" flex flex-col items-center justify-center">
            {posts.length > 0 ? (
              <h1 className="text-4xl mt-6 sm:mt-14 ">Posts</h1>
            ) : (
              <h1 className="text-4xl ">No Posts</h1>
            )}
            {posts.length > 0 ? (
              posts.map((post, index) => <Post key={index} post={post} />)
            ) : (
              <p>No posts to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
