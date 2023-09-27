import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "../components/User/LoginScreen.jsx";
import Home from "../components/User/Home.jsx";
import Login from "../components/User/Authentication/Login.jsx";
import Forgotpassword from "../components/User/Authentication/Forgotpassword.jsx";
import Verifyotp from "../components/User/Authentication/Verifyotp.jsx";
import Signup from "../components/User/Authentication/Signup.jsx";
import Resetpassword from "../components/User/Authentication/Reset password.jsx";
import AdminLoginScreen from "../components/admin/adminLoginScreen.jsx";
import AdminHome from "../components/admin/AdminHome.jsx";
import UserPrivateRoute from "../components/User/privateRoutes/userPrivateRoute.jsx";
import UserProfile from "../components/User/Profile/UserProfile.jsx";
import OtherProfile from "../components/User/Profile/otherProfile.jsx";

function Routers() {
  return (
    <Routes>
      <Route path="/" exact element={<LoginScreen />}>
        <Route index element={<Login />} />
        <Route path="forgot" element={<Forgotpassword />} />
        <Route path="forgot/verifyOtp" element={<Verifyotp />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="forgot/verifyOtp/resetpassword"
          element={<Resetpassword />}
        />
      </Route>
      <Route path='' element={<UserPrivateRoute/>}>
      <Route path="/user/home" element={<Home />} />
      <Route path='/user/profile' element={<UserProfile/>}/>
      <Route path='/user/usersprofile' element={<OtherProfile />}/>
      </Route>


        <Route path="/admin" element={<AdminLoginScreen />} />
        <Route path="/admin/home" element={<AdminHome/>}/>
    </Routes>
  );
}

export default Routers;
