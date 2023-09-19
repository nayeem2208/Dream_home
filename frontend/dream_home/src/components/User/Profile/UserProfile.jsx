import React from "react";
import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import userimage from "../../../assets/149071.png";
import { BsPencil } from "react-icons/Bs";

function UserProfile() {
  return (
    <div>
      <div>
        <div className="relative w-screen h-96">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <img
            src={userimage}
            className="h-44 absolute top-60 left-16"
            alt="User Image"
          />
        </div>
        <div className="px-7 mb-12 xl:px-24">
        <div className="flex flex-col mb-4 sm:flex-row items-center justify-between">
          <h1 className="text-4xl mt-6  sm:mt-14 ">
            MOHAMED NAYEEM CE
          </h1>
          <button type="button" className="h-9 mt-4 sm:mt-16 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 sm:mx-4">
            Edit Profile
          </button>
        </div>
        <p className="mt-7">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
        <h1>Services</h1>
      </div>
      </div>
    </div>
  );
}

export default UserProfile;
