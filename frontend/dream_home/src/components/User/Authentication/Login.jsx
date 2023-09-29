import React, { useEffect, useState } from "react";
import "../../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../../slices/userSlices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useGoogleLoginbuttonMutation,useLoginMutation} from "../../../slices/userSlices/userApiSlice";


function Login() {
  let [email, setemail] = useState("");
  let [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [Login, { isLoading }] = useLoginMutation();
  const [GoogleLoginbutton]=useGoogleLoginbuttonMutation()

  const dispatch = useDispatch();
  let { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate("/user/home");
  }, [ userInfo]);

  const authenticateData=async(credentialResponse)=>{
    
    try {
      let res = await GoogleLoginbutton({credentialResponse}).unwrap();
      let token=res.token
      dispatch(setCredentials({...res}));
      localStorage.setItem('token',token)// console.log(token)
      navigate('/');
    } catch (error) {
      toast.error("Invalid User");
    }
  }
  

  const submitHander = async (e) => {
    e.preventDefault();
    try {
      if ((email, password)) {
        const res = await Login({ email, password }).unwrap();
        toast("Authentication success", 2000);
        let token=res.token
        dispatch(setCredentials({ ...res }));
        localStorage.setItem('token',token)
        navigate("/");
      } else {
        toast.error("Please give a valid input");
      }
    } catch (err) {
      toast.error(err?.data.error || err.message, 2000);
    }
  };

 

  return (
    <GoogleOAuthProvider clientId="835826000162-eojub40v88g9f9q44of4n2uu9o8qn7e6.apps.googleusercontent.com">
      <div>
        <div>
          <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
            <h1 className="text-3xl font-semibold mb-4 text-center">Login</h1>

            <form onSubmit={submitHander}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <Link
                className="block text-gray-500 text-center mb-3 text-sm"
                to="signup"
              >
                Dont have Account?Signup
              </Link>
              <button
                type="submit"
                className="w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-4"
              >
                Login
              </button>
              <div className="flex justify-center items-center ">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  authenticateData(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                className="googlebutton"
              />
              </div>
              <Link
                className="block text-gray-500 text-center mb-3 text-sm mt-3"
                to="forgot"
              >
                Forgot Password
              </Link>
            </form>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
