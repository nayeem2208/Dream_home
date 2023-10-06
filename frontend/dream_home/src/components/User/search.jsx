import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
    <div className="py-16 flex justify-center">
      <div className=" w-screen px-8 mt-6 h-full flex">
        <div className="w-1/6 h-96  bg-gray-200 font-bold py-3 flex justify-center">
          <ul className="cursor-pointer ">
            <li className="py-2 " onClick={userONfunction}>
              Users({users.length})
            </li>
            <li className="py-2" onClick={postONfunction}>
              Posts({posts.length})
            </li>
            <li className="py-2" onClick={serviceONfunction}>
              Services({services.length})
            </li>
          </ul>
        </div>
        <div className="w-5/6 h-96  bg-gray-100 py-3 overflow-x-hidden ">
          {/*--------------User search results------------------- */}
          {userON && (
            <div className=" h-full">
              <div className=" flex  justify-center">
                <h1 className="font-bold flex justify-center  text-3xl">Users</h1>
              </div>
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id}>
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
                <h1 className="font-bold text-3xl flex justify-center">Posts</h1>
              </div>

              {posts.length > 0 ? (
                // posts.map((post, index) =><div className="w-2/4 px-8"> <Post  key={index} post={post} /></div>)
                <div className="grid grid-cols-2 gap-1 px-8">
                  {posts.map((post, index) => (
                    <div key={index}>
                      <PostCards post={post} />
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
                <h1 className="font-bold text-3xl flex justify-center">Services</h1>
              </div>

              {services.length > 0 ? (
                // posts.map((post, index) =><div className="w-2/4 px-8"> <Post  key={index} post={post} /></div>)
                <div className="grid grid-cols-2 gap-1 px-8">
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
