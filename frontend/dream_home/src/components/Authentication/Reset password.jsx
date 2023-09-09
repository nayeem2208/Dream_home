import React from 'react'

function Resetpassword() {
  return (
    
    <div>
    <div >
      <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Reset password
        </h1>

        <div className="mb-4">
          <label htmlFor="OTP" className="block text-gray-700">
           New Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="OTP" className="block text-gray-700">
           Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={()=>navigate('/login/resetpassword')}
          className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
        >
        Reset Password
        </button>
      </div>
    </div>
  </div>
  )
}

export default Resetpassword
