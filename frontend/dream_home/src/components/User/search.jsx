import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {FiUsers} from 'react-icons/fi'
import {GiPostStamp} from 'react-icons/gi'
import {MdOutlineHomeRepairService} from 'react-icons/md'
import Post from "./post";
import PostCards from "./PostCard";

function Search() {
  let [users, setUsers] = useState([]);
  let [posts, setPost] = useState([]);
  let [services, setServices] = useState([]);
  let [userON, setUserOn] = useState(true);
  let [PostsON, setPostsOn] = useState(false);
  let [ServicesON, setServicesOn] = useState(false);

  const location = useLocation(); // for getting the data from userHeader
  let searchData = location.state.searchData;
  useEffect(() => {
    window.scrollTo(0, 0);
    setUsers(searchData.users);
    setPost(searchData.posts || []);
    setServices(searchData.service);
  });

  const userONfunction = () => {
    setPostsOn(false);
    setServicesOn(false);
    setUserOn(true);
  };
  const postONfunction = () => {
    setServicesOn(false);
    setUserOn(false);
    setPostsOn(true);
  };
  const serviceONfunction = () => {
    setPostsOn(false);
    setUserOn(false);
    setServicesOn(true);
  };

  return (
    <div className="py-16 flex justify-center shadow-lg">
      <div className=" w-screen sm:px-8 mt-6 h-full flex ">
        <div className="w-1/6 sm:w-1/6 h-96  bg-gray-200 font-bold py-3 flex justify-center rounded-l-lg shadow-lg">
          <ul className="cursor-pointer ">
            <li className="py-2 flex" onClick={userONfunction}>
              <p className="hidden sm:block">Users</p><FiUsers className="sm:hidden mt-1"/><p className="text-sm sm:font-bold sm:text-base">({users.length})</p>
            </li>
            <li className="py-2 flex" onClick={postONfunction}>
              <p className="hidden sm:block">Posts</p> <GiPostStamp className="sm:hidden mt-1"/><p className="text-sm sm:font-bold sm:text-base">({posts.length})</p>
            </li>
            <li className="py-2 flex" onClick={serviceONfunction}>
              <p className="hidden sm:block">Services</p><MdOutlineHomeRepairService className="sm:hidden mt-1"/><p className="text-sm sm:font-bold sm:text-base">({services.length})</p>
            </li>
          </ul>
        </div>
        <div className="w-5/6 h-96  bg-gray-100 py-3 overflow-x-hidden rounded-r-lg shadow-lg">
          {/*--------------User search results------------------- */}
          {userON && (
            <div className=" h-full">
              <div className=" flex  justify-center">
                <h1 className="font-bold flex justify-center  text-3xl"><FiUsers className="mt-1"/>Users</h1>
              </div>
              {users.length > 0 ? (
                users.map((user,index) => (
                  <div key={index}>
                    <div className="flex">
                      <div className="w-14 h-14 rounded-full overflow-hidden mx-4 my-4">
                        <Link
                          to={`/user/usersprofile?username=${user.username}`}
                        >
                          <img
                            src={`http://localhost:3000/images/${user.profilePic}`}
                            alt=""
                          />
                        </Link>
                      </div>
                      <Link to={`/user/usersprofile?username=${user.username}`}>
                        <h1 className="text-lg  my-6 cursor-pointer font-semibold">
                          {user.username}
                        </h1>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="font-bold flex justify-center mt-12">
                  NO results found!!!!
                </div>
              )}
            </div>
          )}
          {/*--------------post search results------------------- */}
          {PostsON && (
            <div className=" h-full ">
              <div className=" flex  justify-center">
                <h1 className="font-bold text-3xl flex justify-center"><GiPostStamp className="mt-1"/>Posts</h1>
              </div>

              {posts.length > 0 ? (
                // posts.map((post, index) =><div className="w-2/4 px-8"> <Post  key={index} post={post} /></div>)
                <div className="sm:grid sm:grid-cols-2 gap-1 sm:px-8">
                  {posts.map((post, index) => (
                    <div key={index} >
                      <PostCards post={post} className="w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="font-bold flex justify-center mt-12">
                  NO results found!!!!
                </div>
              )}
            </div>
          )}
           {/*--------------service search results------------------- */}
          {ServicesON && (
            <div className=" h-full ">
              <div className=" flex  justify-center">
                <h1 className="font-bold text-3xl flex justify-center"><MdOutlineHomeRepairService className="mt-1"/>Services</h1>
              </div>

              {services.length > 0 ? (
                // posts.map((post, index) =><div className="w-2/4 px-8"> <Post  key={index} post={post} /></div>)
                <div className="sm:grid sm:grid-cols-2 gap-1 sm:px-8">
                {services.map((service, index) => (
                  <div>
                    <PostCards key={index} post={service} servies={true} />{" "}
                  </div>
                ))} 
                </div>
              ) : (
                <div className="font-bold flex justify-center mt-12">
                  NO results found!!!!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
