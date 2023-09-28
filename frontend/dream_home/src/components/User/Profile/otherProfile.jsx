import React, { useEffect, useState } from "react";
import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import userimage from "../../../assets/149071.png";
import { BsPencil } from "react-icons/Bs";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Post from "../post";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function OtherProfile() {
  let [modalVisible, setModalVisible] = useState(false);
  let [followingVisible, setfollowingVisible] = useState(false);
  let [userDetailss, Setuserdetails] = useState(false);
  let [usernames, SetUsername] = useState("");
  let [name, setName] = useState("");
  let [Phone, SetPhone] = useState("");
  let [email, SetEmail] = useState("");
  let [coverpic, setCoverPic] = useState("");
  let [profilePic, SetProfilPic] = useState("");
  let [AboutUs, SetAboutUs] = useState("");
  let [following, setFollowing] = useState("");
  let [followingcount, setFollowingcount] = useState("");

  let [followerscount, setFollowerscount] = useState("");
  let [followers, setFollowers] = useState("");

  let [posts, setPosts] = useState([]);
  let [likes, setlikes] = useState([]);
  let [comments, setcomments] = useState([]);
  let [follow, SetFollow] = useState(false);


  const location = useLocation();
  const username = new URLSearchParams(location.search).get("username");

  let { userInfo } = useSelector((state) => state.auth);
  let userid = userInfo.id.toString();

  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = async () => {
      try {
        const userId = userInfo.id;
        if (username == userInfo.name) {
          navigate("/user/profile");
        } else {
          let res = await axios.get(
            `http://localhost:3000/othersProfile?username=${username}`,
            {
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          if (res.data.followers.includes(userid)) {
            SetFollow(true);
          }
          SetUsername(res.data.username);
          SetPhone(res.data.phone);
          SetEmail(res.data.email);
          setCoverPic(res.data.coverPic);
          SetProfilPic(res.data.profilePic);
          SetAboutUs(res.data.aboutUs);
          setName(res.data.name);
          setFollowers(res.data.followersDetails);
          setFollowerscount(res.data.followers.length);
          setFollowing(res.data.followingDetails);
          setFollowingcount(res.data.following.length);
          setPosts(...posts, res.data.post);
          setcomments(...comments, res.data.comments);
          setcomments(...likes, res.data.likes);
          //   SetFollow(followers.some((follow) => follow.userId === userInfo.id))
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    userDetails();
  }, [userDetailss]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Setuserdetails(!userDetailss);
  };
  const followingToggle = () => {
    setfollowingVisible(!followingVisible);
  };

  const followManagement = async (e) => {
    try {
      let res = await axios.put(
        `http://localhost:3000/follow?id=${username}&userId=${userInfo.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.message == "unfollowed") {
        SetFollow(false);
        setFollowerscount(followerscount - 1);
        setFollowers(res.data.followersDetails);
      } else if (res.data.message == "following") {
        SetFollow(true);
        setFollowerscount(followerscount + 1);
        setFollowers(res.data.followersDetails);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const modalfollowManagement = async (user) => {
    try {
      let res = await axios.put(
        `http://localhost:3000/follow?id=${user}&userId=${userInfo.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // setChange(!change);
      Setuserdetails(!userDetailss);

      // if (res.data.message == "unfollowed") {
      //   SetFollow(false);
      // } else if (res.data.message == "following") {
      //   SetFollow(true);
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div>
        <div className="relative w-screen h-96">
          <img
            src={coverpic ? `http://localhost:3000/images/${coverpic}` : null}
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="sm:h-44 sm:w-44 sm:rounded-full sm:overflow-hidden sm:absolute sm:top-60 sm:left-16   h-32 w-32 rounded-full overflow-hidden absolute top-60 left-1/3 mt-9">
            <img
              src={
                profilePic
                  ? `http://localhost:3000/images/${profilePic}`
                  : userimage
              }
              className="h-full w-full object-cover"
              alt="User Image"
            />
          </div>
        </div>
        <div className="px-7 mb-12 xl:px-24">
          <div className="flex flex-col mt-4 sm:flex-row items-center justify-between">
            {usernames ? (
              <h1 className="text-4xl mt-6  sm:mt-14 ">{usernames}</h1>
            ) : (
              <h1 className="text-4xl mt-6  sm:mt-14 ">Username</h1>
            )}
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
                          Followers
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
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
                                          ? `http://localhost:3000/images/${follower.profilePic}`
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

                              <div key={follower._id}>
                                {follower.username == userInfo.name ? null : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      modalfollowManagement(follower.username)
                                    }
                                    className="mx-3 sm:mx-6 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-2 sm:px-5 py-1 sm:py-2.5 text-center"
                                  >
                                    Following
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <h1>you dont have a followers</h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
                                          ? `http://localhost:3000/images/${following.profilePic}`
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
                              {following.username == userInfo.name ? null : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    modalfollowManagement(following.username)
                                  }
                                  className="mx-3 sm:mx-6 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-2 sm:px-5 py-1 sm:py-2.5 text-center"
                                >
                                  Following
                                </button>
                              )}
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
          <div className="mt-4">
            {follow ? (
              <button
                type="button"
                onClick={followManagement}
                className=" items-center justify-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={followManagement}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Follow
              </button>
            )}

            <button
              type="button"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Message
            </button>
          </div>
          <div className="sm:flex sm:space-x-4">
            <div className="sm:w-1/2">
              {name ? (
                <h3 className="text-2xl sm:mt-14 ">{name}</h3>
              ) : (
                <h3 className="text-2xl sm:mt-14 ">name</h3>
              )}
              {Phone ? <p>{Phone}</p> : <p>Add your phone number</p>}
              {email ? <p>{email}</p> : <p>Add your email number</p>}
              <div className="flex mt-4">
                <button onClick={toggleModal}>
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

export default OtherProfile;
