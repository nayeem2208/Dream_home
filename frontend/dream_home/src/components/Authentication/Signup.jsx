import React from 'react'
import "../../App.css";
import {Link} from 'react-router-dom'


function Signup() {
  return (
    <div>
      <div className="login-form">
        <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-3xl font-semibold mb-2 text-center">Signup</h1>

          <div className="mb-1">
            <label htmlFor="username" className="block text-gray-700 text-base">
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-1">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-1">
            <label htmlFor="username" className="block text-gray-700">
              Phone
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-1">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-1">
            <label htmlFor="password" className="block text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="mt-5 w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 "
          >
            Signup
          </button>
          <Link to='/login' className="block text-gray-500 text-center mb-3 text-sm mt-2">Already have account? login</Link>
          
        </div>
      </div>
    </div>
  )
}

export default Signup
