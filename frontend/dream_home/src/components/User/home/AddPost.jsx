import React from "react";


function AddPost() {
  return (
    <div>
      <div className=" flex flex-col justify-center items-center">
        <button
          type="button"
          className="h-9 mt-6 px-3 w-2/4 items-center text-neutral-800 my-4  bg-gradient-to-r from-teal-100 via-teal-200 to-teal-150 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-200 font-medium rounded-lg   "
        >
          Add a Post
        </button>

        
      </div>
    </div>
  );
}

export default AddPost;
