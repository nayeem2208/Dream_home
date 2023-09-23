import image from "../../../assets/armchair-green-living-room-with-copy-space.jpg";
import { AiOutlineLike } from "react-icons/ai"; // Example of an outline-style Like icon
import { AiTwotoneLike } from "react-icons/ai"; // Example of a two-tone style Like icon
import { BiComment } from "react-icons/bi"; // Comment icon
import { IoSendOutline } from "react-icons/io5"; // Send icon
import { GrFormNext, GrFormPrevious } from "react-icons/gr"; // Next and Previous icons from the Gr (React Icons Gr library)
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useEffect, useState } from "react";
import axios from 'axios'

function HomePost() {
  let [showMore, setShowmore] = useState(true);
  let [liked, setLiked] = useState(false);
  let [like, setLike] = useState(150);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        console.log('Fetching data...'); // Log a message to indicate that data fetching is in progress
        const response = await axios.get(`http://localhost:3000/getpost`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          
        });
        console.log('Data fetched:', response.data); // Log the fetched data
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors that occur during data fetching
      }
    };
  
    fetchData(); // Call the fetchData function when the component mounts
  
    // You can add dependencies here if necessary
  }, []);
  

  let showmoreToggle = () => {
    setShowmore(!showMore);
  };

  let likeToggle = () => {
    setLiked(!liked);
    if (liked) {
      setLike(like - 1);
    } else setLike(like + 1);
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div class="max-w-5xl items-center bg-white border  rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen ">
        <div class="p-5">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Noteworthy technology acquisitions 2021
            </h5>
          </a>

          <p class="mb-3 font-normal text-gray-700 dark:text-gray-700">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.Lorem Ipsum is simply dummy text
            of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard
            dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen book.Lorem
            Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book
          </p>
          <button
            onClick={showmoreToggle}
            class="inline-flex items-center px-3  text-sm font-medium text-center   "
          >
            Show more
            <svg
              class="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
        <a href="#">
          <div className="relative overflow-hidden h-96">
            <a href="#">
              <div className="relative overflow-hidden h-96">
                <Carousel className="px-2">
                  <div>
                    <img src={image} alt="Image 1" />
                  </div>
                  <div>
                    <img src={image} alt="Image 2" />
                  </div>
                  <div>
                    <img src={image} alt="Image 3" />
                  </div>
                </Carousel>
              </div>
            </a>
          </div>
        </a>

        <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
          <div className="flex ">
            {liked ? (
              <AiTwotoneLike
                onClick={likeToggle}
                className=" ml-8 mt-1 w-5 h-5 "
              />
            ) : (
              <AiOutlineLike
                onClick={likeToggle}
                className=" ml-8 mt-1 w-5 h-5 "
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

      {/* <div class="max-w-5xl items-center bg-white border  rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen ">
        <div class="p-5">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Noteworthy technology acquisitions 2021
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-700">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.Lorem Ipsum is simply dummy text
            of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book
          </p>
          <a
            href="#"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show more
            <svg
              class="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <a href="#">
          <div className="relative overflow-hidden h-96">
            <a href="#">
              <div className="relative overflow-hidden h-96">
                <Carousel className="px-2">
                  <div>
                    <img src={image} alt="Image 1" />
                  </div>
                  <div>
                    <img src={image} alt="Image 2" />
                  </div>
                  <div>
                    <img src={image} alt="Image 3" />
                  </div>
                </Carousel>
              </div>
            </a>
          </div>
        </a>

        <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
          <div className="flex ">
            <AiOutlineLike className=" ml-8 mt-1 w-5 h-5 " />
            <p className="mr-6">150</p>
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
      <div class="max-w-5xl items-center bg-white border  rounded-lg shadow dark:bg-gray-50 dark:border-gray-300 my-4 w-screen ">
        <div class="p-5">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Noteworthy technology acquisitions 2021
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-700">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
          <a
            href="#"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show more
            <svg
              class="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <a href="#">
          <div className="relative overflow-hidden h-96">
            <a href="#">
              <div className="relative overflow-hidden h-96">
                <Carousel className="px-2">
                  <div>
                    <img src={image} alt="Image 1" />
                  </div>
                  <div>
                    <img src={image} alt="Image 2" />
                  </div>
                  <div>
                    <img src={image} alt="Image 3" />
                  </div>
                </Carousel>
              </div>
            </a>
          </div>
        </a>

        <div className="bg-grey-300 h-12 justify-items-stretch mt-4">
          <div className="flex ">
            <AiOutlineLike className=" ml-8 mt-1 w-5 h-5 " />
            <p className="mr-6">150</p>
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
      </div> */}
    </div>
  );
}

export default HomePost;
