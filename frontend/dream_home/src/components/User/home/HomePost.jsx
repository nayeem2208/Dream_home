import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import { AiOutlineLike } from "react-icons/ai"; // Example of an outline-style Like icon
import { AiTwotoneLike } from "react-icons/ai"; // Example of a two-tone style Like icon
import { BiComment } from "react-icons/bi"; // Comment icon
import { IoSendOutline } from "react-icons/io5"; // Send icon
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function HomePost() {
  let [posts, setPosts] = useState([]);
  let [liked, setLiked] = useState(false);
  let [like, setLike] = useState(150);

  let { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        console.log("Fetching data..."); // Log a message to indicate that data fetching is in progress
        const response = await axios.get(
          `http://localhost:3000/getpost?id=${userInfo.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setPosts(...posts, response.data);
      } catch (error) {
        console.error("Error fetching data:", error); // Log any errors that occur during data fetching
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // You can add dependencies here if necessary
  }, []);

  let likeToggle = () => {
    setLiked(!liked);
    if (liked) {
      setLike(like - 1);
    } else setLike(like + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={index}
            className="max-w-5xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen"
          >
            <div className="flex mx-5 my-4">
            <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2 ">
              <img
                src={
                  post.user.profilePic
                    ? `http://localhost:3000/images/${post.user.profilePic}`
                    : userimage
                }
                className="h-full w-full object-cover"
                alt="User Image"
              /> 
            </div>
            <a href="#">
            <h5 className=" text-2xl  tracking-tight text-gray-900">
                  {post.user.username}
                </h5>
                <p className="text-xs text-slate-700 font-thin">{post.dateOfPosted}</p>
              </a>
            </div>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  {post.heading}
                </h5>
              </a>

              <p className="mb-3 font-normal text-gray-700 dark:text-gray-700">
                {post.description}
              </p>

              <p className="mb-3 font-normal text-gray-700 dark:text-gray-700">
                service:{post.service}
              </p>
            </div>
            {post.media.length > 0 && (
              <a href="#">
                <div className="relative overflow-hidden h-96">
                  <Carousel className="px-2">
                    {post.media.map((image, imageIndex) => (
                      <div key={imageIndex}>
                        <img src={`http://localhost:3000/images/${image}`} />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </a>
            )}

            <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
              <div className="flex">
                {liked ? (
                  <AiTwotoneLike
                    onClick={likeToggle}
                    className="ml-8 mt-1 w-5 h-5"
                  />
                ) : (
                  <AiOutlineLike
                    onClick={likeToggle}
                    className="ml-8 mt-1 w-5 h-5"
                  />
                )}
                <p className="mr-6">{like}</p>
                <BiComment className="mx-3 mt-1 w-5 h-5" />
                <p className="mr-6">115</p>
                <input
                  type="text"
                  className="border ml-4 rounded-lg w-2/4 text-center placeholder-center"
                  placeholder="Comment here"
                />
                <IoSendOutline className="ml-8 mt-1 w-5 h-5" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
}

export default HomePost;
