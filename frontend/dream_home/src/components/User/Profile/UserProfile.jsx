import React, { useEffect, useState } from "react";
import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import userimage from "../../../assets/149071.png";
import { BsPencil } from "react-icons/Bs";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

function UserProfile() {
  let [modalVisible, setModalVisible] = useState(false);
  let [profileModalVisible, setProfileModalVisible] = useState(false);
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

  let { userInfo } = useSelector((state) => state.auth);

  const uploadCoverPIcHandler = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("id", userInfo.id);
      formData.append("file", coverpic);

      const response = await axios.put(
        `http://localhost:3000/uploadcoverPic`,
        formData,
        {
          headers: {
            // Add any necessary headers, such as authentication headers
            // 'Authorization': `Bearer ${token}`, // Example for authentication
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      setModalVisible(false);
      toast("Cover photo succesfully updated", 2000);
      Setuserdetails(!userDetailss);
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
            FD.append("AboutUs", AboutUs);
            let res = await axios.put(`http://localhost:3000/editProfile`, FD, {
              headers: {
                // Add any necessary headers, such as authentication headers
                // 'Authorization': `Bearer ${token}`, // Example for authentication
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            });
            setProfileModalVisible(false);
            toast("Profile succesfully edited ", 2000);
            Setuserdetails(!userDetailss);
          }else toast.error('Please give a proper phone number')
        }else toast.error('Please give a valid username')
      }else toast.error('Please fill the fields')
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const userDetails = async () => {
      try {
        const userId = userInfo.id;
        let res = await axios.get(
          `http://localhost:3000/getUserProfile?id=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        SetUsername(res.data.username);
        SetPhone(res.data.phone);
        SetEmail(res.data.email);
        setCoverPic(res.data.coverPic);
        SetProfilPic(res.data.profilePic);
        SetAboutUs(res.data.aboutUs);
        setName(res.data.name);
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
  const profiletoggleModal = () => {
    setProfileModalVisible(!profileModalVisible);
    Setuserdetails(!userDetailss);
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
          <div className="absolute  bottom-0 right-0 z-10 mr-8  mb-6 ">
            <BsPencil
              className="w-5 h-5 text-mainColor"
              onClick={toggleModal}
            />
          </div>
          {modalVisible && (
            <div>
              <div
                className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                onClick={toggleModal}
              ></div>
              <div
                id="defaultModal"
                className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
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
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
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

          <div className="h-44 w-44 rounded-full overflow-hidden absolute top-60 left-16">
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
          <div className="flex flex-col mb-4 sm:flex-row items-center justify-between">
            {username ? (
              <h1 className="text-4xl mt-6  sm:mt-14 ">{username}</h1>
            ) : (
              <h1 className="text-4xl mt-6  sm:mt-14 ">Username</h1>
            )}

            <button
              type="button"
              onClick={profiletoggleModal}
              className="h-9 mt-4 sm:mt-16 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 sm:mx-4"
            >
              Edit Profile
            </button>
            {profileModalVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={profiletoggleModal}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
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
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
          </div>
          {name ? (
            <h3 className="text-2xl  sm:mt-14 ">{name}</h3>
          ) : (
            <h3 className="text-2xl  sm:mt-14 ">name</h3>
          )}
          {Phone ? <p>{Phone}</p> : <p>Add your phone number</p>}
          {email ? <p>{email}</p> : <p>Add your email number</p>}
          {AboutUs ? (
            <p className="mt-7">{AboutUs}</p>
          ) : (
            <p className="mt-7">Add something about you</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
