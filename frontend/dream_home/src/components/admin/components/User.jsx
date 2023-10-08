import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/adminaxios";
import {AiOutlineSearch} from 'react-icons/ai'
import {MdClear} from 'react-icons/md'
// import $ from "jquery"; // Import jQuery
// import "datatables.net"; // Import DataTables
// import "datatables.net-dt/css/jquery.dataTables.css";

function User() {
  const [users, setUser] = useState([]);
  const [userFilter,setUserFilter]=useState([])
  const [searchInput, setSearchInput] = useState("");

  
  useEffect(() => {
    const getUser = async () => {
      let res = await axiosInstance.get(`/getUser`);
      setUser(res.data);
      setUserFilter(res.data)
    };
    getUser();
  }, []);

  const blockHandler = async (id) => {
    try {
      let res = await axiosInstance.put(`/userblockmanagement?id=${id}`);
      setUser(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchUser = async (e) => {
    e.preventDefault()
    try {
      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      );
      setUser(filteredUsers);
      setSearchInput('')

    } catch (error) {
      console.log(error.message);
    }
  };

  
  const clearSearch = async (e) => {
    e.preventDefault()
    try {
      setUser(userFilter);
      setSearchInput('')

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mt-16 mx-3">
      <div className="relative overflow-x-auto   sm:rounded-lg">
        <div className="pb-4  ">
          {/* <label for="table-search" className="sr-only">
            Search
          </label> */}
          <div className="relative mt-1 flex">

            <input
              type="text"
              id="table-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for Users"
            />
            <button onClick={searchUser}><AiOutlineSearch className="w-6 h-6 mx-4"/></button>
            <button onClick={clearSearch}><MdClear className="w-6 h-6"/></button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  {/* <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <label for="checkbox-table-search-1" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.username}
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <div className="rounded-full overflow-hidden w-8 h-8">
                      <img
                        src={`http://localhost:3000/images/${user.profilePic}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <button
                        className="text-green-400"
                        onClick={() => blockHandler(user._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="text-red-600"
                        onClick={() => blockHandler(user._id)}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
