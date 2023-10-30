import React, { useState, useEffect } from "react";
import "../../App.css";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../slices/adminSlices/adminApisliceEnd.js";
import { useDispatch, useSelector } from "react-redux";
import { setAdminCredentials } from "../../slices/adminSlices/adminAuthSlice.js";
import { useNavigate } from "react-router-dom";

const adminloginPageStyle = {
  // background: `url(${backgroundImg})`,
  backgroundColor: '#94ba7b',
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center", // Horizontally center the content
  alignItems: "center", // Vertically center the content
};

function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [Login] = useLoginMutation();

  let { adminInfo } = useSelector((state) => state.adminAuth);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      if (username) {
        if (password) {
          const res = await Login({ username, password }).unwrap();
          let token=res.token
          dispatch(setAdminCredentials({ ...res }));
          localStorage.setItem('adminToken',token)
          navigate("/adminlogin");
        }else{
          toast.error('Please enter password')
        }
      } else {
        toast.error("Please enter Username");
      }
    } catch (error) {
      toast.error(error.data.error)
    }
  };

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/home");
    }
  }, [adminInfo]);

  return (
    <div style={adminloginPageStyle}>
      <div>
        <div className="w-96 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Admin Login
          </h1>

          <form onSubmit={loginHandler}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Username
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
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

            <button
              type="submit"
              className="w-full bg-lime-600 text-white font-semibold py-2 rounded-lg hover:bg-mainColorDark transition duration-300 mb-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginScreen;
