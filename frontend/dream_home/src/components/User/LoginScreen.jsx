import React from 'react'
import {Outlet} from 'react-router-dom'
import backgroundImg from '../../assets/armchair-green-living-room-with-copy-space.jpg'


const loginPageStyle = {
  background: `url(${backgroundImg})`, // Replace with the actual path to your image
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '100vh', // Ensure the background covers the entire viewport height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function LoginScreen() {
  return (
    <div style={loginPageStyle}>
       <Outlet/>
    </div>
  )
}

export default LoginScreen
