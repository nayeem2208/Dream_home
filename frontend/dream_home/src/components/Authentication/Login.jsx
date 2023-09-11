import React, { useEffect, useState } from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/userSlices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/userSlices/userApiSlice.js";
import { toast } from "react-toastify";


function Login() {
  let [email, setemail] = useState("");
  let [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [Login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  let { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate("/user/home");
  }, [navigate, userInfo]);


  const submitHander = async (e) => {
    e.preventDefault();
    try {
      if(email,password){
        const res = await Login({ email, password }).unwrap();
        toast("its working macha", 2000);
        dispatch(setCredentials({ ...res }));
        navigate("/");
      }
      else{
        toast.error('Please give a valid input')
      }
    } catch (err) {
      toast.error(err?.data.error || err.message, 2000);
    }
  };

  return (
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
            <Link
              className="block text-gray-500 text-center mb-3 text-sm"
              to="forgot"
            >
              Forgot Password
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
