import React from "react";
import {useNavigate} from 'react-router-dom'

function Forgotpassword() {

    const navigate=useNavigate()

  return (
    <div>
      <div className="login-form">
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Forgot Password
          </h1>

          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={()=>navigate('/login/verifyOtp')}
            className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
          >
           Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
