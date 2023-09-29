import React, { useEffect, useState } from "react";
import "../../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleauthMutation, useSignupMutation } from "../../../slices/userSlices/userApiSlice.js";
import { setCredentials } from "../../../slices/userSlices/authSlice.js";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function Signup() {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  const [Signup, { isLoading }] = useSignupMutation();
  const [GoogleAuth]=useGoogleauthMutation()

  const navigate = useNavigate();


  let { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate("/user/home");
  }, [ userInfo]);

  const authenticateData = async (credentialResponse) => {
    try {

      let res = await GoogleAuth({ credentialResponse }).unwrap();
      let token=res.token
      dispatch(setCredentials({ ...res }));
      localStorage.setItem('token',token)
      navigate("/")
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  let dispatch = useDispatch();
  const usernamePattern =  /^[^\s]+$/;
  const phoneNumberPattern = /^\d{10}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?!\s).{6,}$/;

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      if ((username, email, phone, password)) {
        if (usernamePattern.test(username)) {
          if (phoneNumberPattern.test(phone)) {
            if (passwordPattern.test(password)) {
              if (password === confirmPassword) {
                try {
                  let res = await Signup({
                    username,
                    email,
                    phone,
                    password,
                  }).unwrap();
                  let token=res.token
                  dispatch(setCredentials({ ...res }));
                  localStorage.setItem('token',token)
                  navigate("/");
                } catch (err) {
                  console.log(err.data.err)
                  toast.error(err.data.err || 'user already exist machaaa');
                }
                
              } else {
                toast.error("Please check confirm password");
              }
            } else {
              toast.error("Please put a strong password");
            }
          } else {
            toast.error("Invalid Phone number");
          }
        } else {
          toast.error("Spaces not allowed in username");
        }
      } else {
        toast.error("Please fill the fields");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <GoogleOAuthProvider clientId="835826000162-eojub40v88g9f9q44of4n2uu9o8qn7e6.apps.googleusercontent.com">
      <div className="py-24">
        <div className="login-form">
          <div className="w-96 bg-white rounded-lg shadow-lg p-6 ">
            <h1 className="text-3xl font-semibold mb-2 text-center">Signup</h1>
            <form onSubmit={signupHandler}>
              <div className="mb-1">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-base"
                >
                  Username
                </label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="username" className="block text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="password" className="block text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="mt-5 mb-4 w-full bg-mainColor text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 "
              >
                Signup
              </button>
              <div className="flex justify-center items-center ">
              <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse)
                authenticateData(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              text='Sign Up with Google'
              themeConfig={{
                primaryColor: '#4285F4', // Change the color as needed
                text: 'Sign Up with Google', // Change the text here
                textAlign: 'center', // Center-align the text
              }}
              className='googlebutton'
            />
            </div>
            </form>
            <Link
              to="/"
              className="block text-gray-500 text-center mb-3 text-sm mt-2"
            >
              Already have account? login
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Signup;
