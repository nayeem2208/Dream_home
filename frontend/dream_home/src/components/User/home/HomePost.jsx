import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Post from "../post.jsx";
import axiosInstance from "../../../axios/axios.jsx";

function HomePost() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [loader,setLoader]=useState(true)

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await axiosInstance.get(`/getpost?id=${userInfo.id}`);
        setPosts(response.data);
        setLoader(false)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {loader&&<div class="loader"></div>}
      {posts.length > 0 ? (
        posts.map((post, index) => <Post key={index} post={post} />)
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
}

export default HomePost;
