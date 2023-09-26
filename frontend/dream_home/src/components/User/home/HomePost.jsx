import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Post from "../post.jsx";

function HomePost() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getpost?id=${userInfo.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {posts.length > 0 ? (
        posts.map((post, index) => <Post key={index} post={post} />)
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
}

export default HomePost;
