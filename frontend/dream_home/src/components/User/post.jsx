import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { IoSendOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentcount, setcommentcount] = useState(post.comments.length);
  // const [comment, setcomment] = useState(post.comments);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if the current user has liked this post
    setLiked(post.likes.some((like) => like.userId === userInfo.id));
  }, [post.likes, userInfo.id]);

  const handleLikeToggle = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/postlike?id=${post._id}&userId=${userInfo.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data === "liked") {
        setLiked(true);
        setLikeCount(likeCount + 1);
      } else if (response.data === "unliked") {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-5xl items-center bg-white border rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen">
      <div className="flex mx-5 my-4">
        <div className="h-12 w-12 rounded-full overflow-hidden top-8 left-16 mr-2">
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
        
        <Link to={`/user/usersprofile?username=${post.user.username}`}>
          <h5 className="text-2xl tracking-tight text-gray-900">
            {post.user.username}
          </h5>
        <p className="text-xs text-slate-700 font-thin">{post.dateOfPosted}</p>
        </Link>
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
          service: {post.service}
        </p>
      </div>
      {post.media.length > 0 && (
        <div>
          <Carousel className="px-2" useKeyboardArrows infiniteLoop>
            {post.media.map((image, imageIndex) => (
              <div className="slide" key={imageIndex}>
                <img
                  src={`http://localhost:3000/images/${image}`}
                  style={{ maxHeight: "80vh", width: "auto" }}
                  alt={`Image ${imageIndex + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
        <div className="flex">
          {liked ? (
            <AiTwotoneLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5"
            />
          ) : (
            <AiOutlineLike
              onClick={handleLikeToggle}
              className="ml-8 mt-1 w-5 h-5"
            />
          )}
          <p className="mr-6">{likeCount}</p>
          <BiComment className="mx-3 mt-1 w-5 h-5" />
          <p className="mr-6">{commentcount}</p>
          <input
            type="text"
            className="border ml-4 rounded-lg w-2/4 text-center placeholder-center"
            placeholder="Comment here"
          />
          <IoSendOutline className="ml-8 mt-1 w-5 h-5" />
        </div>
        {/* {commentcount>0&&} */}
      </div>
    </div>
  );
}

export default Post;
