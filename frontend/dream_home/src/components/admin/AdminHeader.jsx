import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../assets/logowhite.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useLogoutMutation } from "../../slices/adminSlices/adminApisliceEnd";
import { adminlogout } from "../../slices/adminSlices/adminAuthSlice.js";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { adminInfo } = useSelector((state) => state.adminAuth);

  const [Logout] = useLogoutMutation();

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await Logout().unwrap();
      let dis = dispatch(adminlogout());
      navigate("/adminlogin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="bg-lime-600 z-40 h-14 flex items-center"
      style={{ position: "fixed", top: "0", width: "100%" }}
    >
      <img src={Logo} alt="" className="w-24 ml-16 pt-1" />

      <div className="flex ml-auto items-center text-white pr-4">
        {adminInfo && (
          <button
            onClick={logoutHandler}
            className="bg-lime-600 hover:bg-lime-800 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>

  );
}

export default AdminHeader;
