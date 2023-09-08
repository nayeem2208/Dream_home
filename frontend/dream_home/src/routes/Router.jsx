import React from 'react'
import {Routes,Route} from 'react-router-dom'
import LoginScreen from '../components/LoginScreen.jsx'
import Home from '../components/Home.jsx'

function Routers() {
  return (
    <Routes>
      <Route path='/user/login' element={<LoginScreen/>}/>
      <Route path='/user/home' element={<Home/>}/>
    </Routes>
  )
}

export default Routers
