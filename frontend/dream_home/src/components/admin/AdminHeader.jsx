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

  let {adminInfo}=useSelector((state)=>state.adminAuth)

  const [Logout]=useLogoutMutation()


  const logoutHandler = async(e) => {
    e.preventDefault()
    try {
       let res=await Logout().unwrap();
      let dis= dispatch(adminlogout());
      navigate('/admin')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-lime-600 h-14 flex">
      <img src={Logo} alt="" className="w-24 ml-16 pt-1" />

      <div className="p-3 pr-16 flex ml-auto text-white">
       {adminInfo&&<button onClick={logoutHandler}> Logout</button>}
      </div>
    </div>
  );
}

export default AdminHeader;
