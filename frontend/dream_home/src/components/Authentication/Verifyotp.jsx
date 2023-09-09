import React from 'react'
import {useNavigate} from 'react-router-dom'

function Verifyotp() {
    let navigate=useNavigate()
  return (
    <div>
      <div className="login-form">
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Verify OTP
          </h1>

          <div className="mb-4">
            <label htmlFor="OTP" className="block text-gray-700">
             Otp
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
             onClick={()=>navigate('/login/resetpassword')}
            className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
          >
          Verify OTP
          </button>
        </div>
      </div>
    </div>
  )
}

export default Verifyotp
