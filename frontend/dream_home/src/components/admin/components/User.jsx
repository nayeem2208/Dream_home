import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/adminaxios";
import {AiOutlineSearch} from 'react-icons/ai'
import {MdClear} from 'react-icons/md'


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
    <div className="pt-16 px-6 mt-3">
      <p className="flex justify-center text-xl font-bold">Users</p>
      <div className="w-full  min-h-screem rounded-md mb-12 shadow-xl flex-col p-6">
        <div className="pb-4  ">
          {/* <label for="table-search" className="sr-only">
            Search
          </label> */}
          <div className="relative flex p-3">

            <input
              type="text"
              id="table-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block p-2 pl-10 text-sm shadow rounded-lg"
              placeholder="Search for Users"
            />
            <button onClick={searchUser}><AiOutlineSearch className="w-6 h-6 mx-4"/></button>
            <button onClick={clearSearch}><MdClear className="w-6 h-6"/></button>
          </div>
        </div>
        <table className="rounded-md mb-2 shadow-lg bg-gray-200 w-full p">
          <thead >
            <tr >
              <th className="text-lg font-bold px-6 py-3 text-center">
                User
              </th>
              <th className="text-lg font-bold px-6 py-3 text-center">
                Email
              </th>
              <th className="text-lg font-bold px-6 py-3 text-center">
                Phone
              </th>
              <th className="text-lg font-bold px-6 py-3 text-center">
                Image
              </th>
              <th className="text-lg font-bold px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="max-h-64">
            {users.length > 0 &&
              users.map((user) => (
                <tr className="shadow-lg">
                  
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium "
                  >
                    {user.username}
                  </th>
                  <td className="px-6 py-4 text-center">{user.email}</td>
                   <td className="px-6 py-4 text-center">{user.phone}</td>
                   <td className="px-6 py-4 text-center">
                    <div className="rounded-full overflow-hidden w-8 h-8 ml-12">
                      <img
                        src={`https://www.dreamhome.fun/images/${user.profilePic}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                   <td className="px-6 py-4 text-center">
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
