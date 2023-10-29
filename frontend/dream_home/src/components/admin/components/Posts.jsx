import React, { useEffect, useState } from "react";
import UserPost from "../Userpost";
import axios from "axios";
import axiosInstance from "../../../axios/adminaxios";
import { BiTable } from "react-icons/bi";
import { FaTabletAlt } from "react-icons/fa";

function Posts() {
  let [posts, setPosts] = useState([]);
  let [singleView, setSingleView] = useState(true);
  let [tableView, setTableView] = useState(false);
  let [refresh, setrefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/getpost`);

        setPosts(response.data);

        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);


  const blockHandler = async (e) => {
    try {
      let res = await axiosInstance.put(`/blockPost?postId=${e}`)
      setrefresh(!refresh)
    } catch (error) {
      console.log(error.message);
    }
  };

  const viewToggle = () => {
    setSingleView(!singleView);
    setTableView(!tableView);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-14">
      <div className="flex mt-6 justify-between  w-full ">
        <div className="w-20"></div>
        <p className="flex justify-center text-xl font-bold ">Posts</p>
        <div className="flex mr-6">
          {" "}
          <FaTabletAlt className={`w-4 h-6 mx-2 ${singleView ? "icon-active" : "icon-inactive"}`} onClick={viewToggle} />
          <BiTable className={`w-4 h-6 mx-2 ${tableView ? "icon-active" : "icon-inactive"}`} onClick={viewToggle} />
        </div>
      </div>
      {posts.length > 0 ? (
        singleView == true ? (
          posts.map((post, index) => <UserPost key={index} post={post} />)
        ) : (
          <div className="w-4/5">
          <table className="rounded-md mb-2  shadow-lg bg-gray-200 w-full p-12">
            <thead>
              <tr>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  User
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Image
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Heading
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Description
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Service
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Date
                </th>
                <th className="text-lg font-bold px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={index} className="shadow-lg">
                  <td className="px-6 py-4 text-center flex font-bold">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-3">
                      <img
                        src={`http://localhost:3000/images/${post.user.profilePic}`}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {post.user.username}
                  </td>
                  <td>
                    <img
                      src={`http://localhost:3000/images/${post.media[0]}`}
                      className="w-12 h-12"
                      alt=""
                    />
                  </td>
                  <td className=" py-4 text-center">{post.heading}</td>
                  <td className=" py-4 text-center text-sm">{post.description}</td>
                  <td className="px-6 py-4 text-center">{post.service}</td>
                  <td className="px-6 py-4 text-center">{post.dateOfPosted}</td>
                  <td>
                 
                    {post.isBlocked ? (
                      <button
                        type="button"
                        onClick={()=>blockHandler(post._id)}
                        className=" my-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 max-h-12 mx-4"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={()=>blockHandler(post._id)}
                        className="my-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 max-h-12 mx-4"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
}

export default Posts;
