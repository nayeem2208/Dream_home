import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useForgotpasswordMutation,
  useOtpverifyMutation,
} from "../../../slices/userSlices/userApiSlice";
import { toast } from "react-toastify";

function Verifyotp() {
  let [otp, setOtp] = useState("");
  let navigate = useNavigate();
  let { state } = useLocation();


  const verifyOTPHandler=async(e)=>{
    e.preventDefault();
    try {
      let res=await Otpverify({state,otp}).unwrap()
      console.log(res)
      navigate('resetpassword',{email:state})
    } catch (error) {
      toast.error(error.data)
    }
  }
  

  return (
    <div>
      <div>
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Verify OTP
          </h1>
          <form onSubmit={verifyOTPHandler}>
            <div className="mb-4">
              <div className="flex">
                <label htmlFor="OTP" className="block text-gray-700 mt-2 mr-2">
                  Otp
                </label>
                <input
                  type="text"
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                />
                {/* <button className='text-blue'>Resend</button> */}
                <button className="text-blue-500 mt-2" onClick={resendHandler}>
                  Resend
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Verifyotp;
