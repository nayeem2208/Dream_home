import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AddPost from "./home/AddPost";
import HomePost from "./home/HomePost";

function Home() {
  let userInfo = useSelector((state) => state.auth);
  useEffect(() => {
    if (!userInfo) navigate("/");
  }, [userInfo]);
  return (
    <div className="px-24 pt-16">
      <AddPost/>
      <HomePost/>
    </div>
  );
}

export default Home;
