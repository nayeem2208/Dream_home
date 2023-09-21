import React, { useState } from "react";

function AddPost() {
  let [modalVisible, setModalVisible] = useState(false);
  let [heading,setheading]=useState('')

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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

                  <div className="p-6 space-y-3 flex flex-col">
                    <label htmlFor="Heading">Heading</label>
                    <input type="text" className="rounded-lg" onChange={(e)=>setheading(e.target.value)} />
                    <label htmlFor="description">Description</label>
                    <textarea type="text" className="rounded-lg" />
                    <label htmlFor="service">Service</label>
                    <input type="text" className="rounded-lg" />
                    <label htmlFor="Media">Media</label>
                    <input
                      type="file"
                      className="hidden" // Hide the default file input
                      id="fileInput" // Add an ID for easier styling
                      accept=".jpg, .jpeg, .png" // Specify accepted file types
                    />

                    <label
                      htmlFor="fileInput" // Associate the label with the file input
                      className="rounded-lg bg-mainColor py-2 px-4 text-white cursor-pointer hover:bg-hoverColor transition duration-300"
                    >
                      Choose a File
                    </label>
                  </div>

                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                    <button
                      data-modal-hide="defaultModal"
                      type="button"
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
