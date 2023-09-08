import React from 'react'
import Logo from '../assets/logowhite.png'
import {Link} from 'react-router-dom'

function UserHeader() {
  return (
    <div className='bg-mainColor h-14 flex'>
      <img src={Logo} alt="" className='w-24 ml-16 pt-1' />
      <div className="p-3 pr-16 flex ml-auto text-white">
        <Link to='/user/home'><h4 className='pr-6'>Home</h4></Link>
        <Link to='/user/services'><h4 className='pr-6'>Services</h4></Link>
        <Link to='/user/notifications'><h4 className='pr-6'>Notifications</h4></Link>
        <Link to='/user/messages'><h4 className='pr-6'>Messages</h4></Link>
        <Link to='/user/profile'><h4 className='pr-6'>Profile</h4></Link>
       
        
      </div>
    </div>
  )
}

export default UserHeader
