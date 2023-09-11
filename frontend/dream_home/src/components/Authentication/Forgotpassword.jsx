import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom'
import { useForgotpasswordMutation } from "../../slices/userSlices/userApiSlice.js";
import { toast } from "react-toastify";

function Forgotpassword() {
  let [email,setEmail]=useState('')


    let [Forgot,{isLoading}]=useForgotpasswordMutation()

    const navigate=useNavigate()

    const forgotSubmitHandler=async(e)=>{
      e.preventDefault()
      try {
        let res=await Forgot({email}).unwrap()
        console.log(res)
        navigate('verifyOtp',{state:email})
      } catch (error) {
        toast.error(error.data)
      }
    }

    

  return (
    <div>
      <div className="login-form">
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Forgot Password
          </h1>
          <form onSubmit={forgotSubmitHandler}>
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
           type="submit"
            
            className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
          >
           Send OTP
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
