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
import Dashbord from "../components/admin/components/dashbord.jsx";
import Posts from "../components/admin/components/Posts.jsx";
import User from "../components/admin/components/User.jsx";
import Banners from "../components/admin/components/Banners.jsx";
import Search from "../components/User/search.jsx";
import Notification from "../components/User/Notification.jsx";
import SinglePost from "../components/User/SinglePost.jsx";
import Messages from "../components/User/messges/Messages.jsx";
import PremiumPage from "../components/User/PremiumPage.jsx";
import PremiumPlans from "../components/admin/components/PremiumPlans.jsx";
import Sales from "../components/admin/components/Sales.jsx";
// import PostView from "../components/User/PostView.jsx";

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
      <Route  path='/user/usersprofile' element={<OtherProfile />}/>
      <Route path="/search" element={<Search/>}/>
      <Route path="/user/notifications" element={<Notification/>}/>
      <Route path="/user/messages" element={<Messages/>}/>
      <Route path="/postview" element={<SinglePost/>}/>
      <Route path="/premiumOptions" element={<PremiumPage/>}/>
      </Route>


        <Route path="/adminlogin" element={<AdminLoginScreen />} />
        <Route path="/admin/home" exact element={<AdminHome/>}>
          <Route index element={<Dashbord/>} />
          <Route path='sales' element={<Sales/>}/>
          <Route path="posts" element={<Posts/>}/>
          <Route path="users" element={<User/>}/>
          <Route path="banners" element={<Banners/>}/>
          <Route path="premiumPlans" element={<PremiumPlans/>}/>
        </Route>
    </Routes>
  );
}

export default Routers;
