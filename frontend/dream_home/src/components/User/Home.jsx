import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Home() {
  let userInfo = useSelector((state) => state.auth);
  useEffect(() => {
    if (!userInfo) navigate("/");
  }, [userInfo]);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;
