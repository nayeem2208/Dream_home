import React, { useEffect, useState } from 'react'
import UserPost from '../Userpost';
import axios from 'axios';
import axiosInstance from '../../../axios/adminaxios';



function Posts() {
  let [posts,setPosts]=useState([])



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/getpost`,
        );

        setPosts(response.data);
        
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  },[]);


  return (
    <div className="flex flex-col items-center justify-center mt-14">
      
      {posts.length > 0 ? (
        posts.map((post, index) => <UserPost key={index} post={post} /> )
      ) : (
        <p>No posts to display</p>
      )}
      
    </div>
  )
}

export default Posts
