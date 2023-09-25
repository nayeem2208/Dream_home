import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAddPostMutation } from "../../../slices/userSlices/userApiSlice";

function AddPost() {

  let [modalVisible, setModalVisible] = useState(false);
  let [heading, setheading] = useState("");
  let [description, setDescription] = useState("");
  let [service, setService] = useState("");
  let [file, setFile] = useState([]);
  let [imagepreview, setImagePreveiw] = useState([]);
  // console.log(file)
  const { userInfo } = useSelector((state) => state.auth);
  let dispatch = useDispatch();
  let [addPost] = useAddPostMutation();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const uploadPostHandler = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("_id", userInfo.id);
      formData.append("heading", heading);
      formData.append("description", description);
      formData.append("service", service);
      file.forEach((selectedFile) => {
        formData.append("file", selectedFile);
      });

      // let res = await addPost(formData).unwrap();
      const response = await axios.put(
        `http://localhost:3000/uploadpost`,
        formData,
        {
          headers: {
            // Add any necessary headers, such as authentication headers
            // 'Authorization': `Bearer ${token}`, // Example for authentication
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      setModalVisible(false);
      setFile([])
      setImagePreveiw([])
      
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(()=>{

  },[])
 

  return (
    <div>
      <div className=" flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={toggleModal}
          className="h-9 mt-6 px-3 w-2/4 items-center text-neutral-800 my-4  bg-gradient-to-r from-teal-100 via-teal-200 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-200 font-medium rounded-lg   "
        >
          <b>Add a Post</b>
        </button>

        {modalVisible && (
          <div>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
              onClick={toggleModal}
            ></div>
            <div
              id="defaultModal"
              className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow text-neutral-800 my-4  bg-gradient-to-r from-teal-400 via-teal-300 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 ">
                      Create post
                    </h3>
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="defaultModal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form onSubmit={uploadPostHandler}>
                    <div className="p-6 space-y-3 flex flex-col">
                      <label htmlFor="Heading">Heading</label>
                      <input
                        type="text"
                        className="rounded-lg"
                        onChange={(e) => setheading(e.target.value)}
                      />
                      <label htmlFor="description">Description</label>
                      <textarea
                        type="text"
                        className="rounded-lg"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <label htmlFor="service">Service</label>
                      <input
                        type="text"
                        className="rounded-lg"
                        onChange={(e) => setService(e.target.value)}
                      />
                      <label htmlFor="Media">Media</label>
                      <input
                        type="file"
                        className="rounded-lg bg-mainColor py-2 px-4 text-white cursor-pointer hover:bg-hoverColor transition duration-300"
                        id="file"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        onChange={(e) => {
                          const selectedFiles = e.target.files;
                          const newFiles = [...file]; // Copy existing files
                          const newPreviews = [...imagepreview]; // Copy existing previews

                          for (let i = 0; i < selectedFiles.length; i++) {
                            const file = selectedFiles[i];
                            newFiles.push(file);
                            newPreviews.push(URL.createObjectURL(file));
                          }

                          setFile(newFiles);
                          setImagePreveiw(newPreviews);
                        }}
                      />

                      {/* Display image previews */}
                      <div className="grid grid-cols-3 gap-4 ">
                        {imagepreview.map((preview, index) => (
                          <img
                            // key={index}
                            src={preview}
                            alt={`Image Preview ${index}`}
                            className="max-w-xs max-h-32 mx-2"
                          />
                        ))}
                      </div>

                      {/* <label
                        htmlFor="fileInput" // Associate the label with the file input
                        className="rounded-lg bg-mainColor py-2 px-4 text-white cursor-pointer hover:bg-hoverColor transition duration-300"
                      >
                        Choose a File
                      </label> */}
                    </div>

                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                      <button
                        data-modal-hide="defaultModal"
                        type="submit"
                        className="text-white font-semibold  bg-mainColor hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                      >
                        Post
                      </button>
                      <button
                        data-modal-hide="defaultModal"
                        type="button"
                        onClick={toggleModal}
                        className="text-gray-500 font-semibold bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPost;
