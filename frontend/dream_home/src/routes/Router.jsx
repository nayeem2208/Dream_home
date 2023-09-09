import React from 'react'
import {Routes,Route} from 'react-router-dom'
import LoginScreen from '../components/LoginScreen.jsx'
import Home from '../components/Home.jsx'
import Login from '../components/Authentication/Login.jsx'
import Forgotpassword from '../components/Authentication/Forgotpassword.jsx'
import Verifyotp from '../components/Authentication/Verifyotp.jsx'
import Signup from '../components/Authentication/Signup.jsx'
import Resetpassword from '../components/Authentication/Reset password.jsx'


function Routers() {
  return (
    <Routes>
      <Route path='login' element={<LoginScreen/>}>
        <Route path='' index element={<Login/>}/>
        <Route path='forgot' element={<Forgotpassword/>}/>
        <Route path='verifyOtp' element={<Verifyotp/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='resetpassword' element={<Resetpassword/>}/>
      </Route>
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default Routers
