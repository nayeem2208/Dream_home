import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AdminHome() {

  let {adminInfo}=useSelector((state)=>state.adminAuth)
  let navigate=useNavigate()
  useEffect(()=>{
    if(!adminInfo){
      navigate('/admin')
    }
  },[adminInfo])
  return (
    <div>
      AdminHome
    </div>
  )
}

export default AdminHome
