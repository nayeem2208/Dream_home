import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useResetpasswordMutation } from '../../slices/userSlices/userApiSlice'


function Resetpassword() {
  let [password,setPassword]=useState('')
  let [confirmpassword,setConfirmPassword]=useState('')
  const navigate=useNavigate()
  let {email}=useLocation()

  let [ResetPassword,{isLoading}] =useResetpasswordMutation()
   
  const resetPassword=async(e)=>{
    e.preventDefault()
    try {
      
      let res=await resetPassword({email,password}).unwrap()
      console.log(res)
      navigate('/')
    } catch (error) {
      toast.error(error.data)
    }
  }
  return (
    
    <div>
    <div >
      <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Reset password
        </h1>
        <form onSubmit={resetPassword}>
        <div className="mb-4">
          <label htmlFor="OTP" className="block text-gray-700">
           New Password
          </label>
          <input
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="OTP" className="block text-gray-700">
           Confirm Password
          </label>
          <input
            type="password"
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type='submit'
          className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-7"
        >
        Reset Password
        </button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Resetpassword
