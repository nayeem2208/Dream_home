import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);
  const [headerRefresh,setHeaderRefresh]=useState(false)
  const [unreadMessages,setUnreadMessages]=useState([])
  const [socket,setSocket]=useState(null)
  const [onlineUser,setOnlineUser]=useState([])

  return (
    <ChatContext.Provider
      value={{
        headerRefresh,
        setHeaderRefresh,
        socket,
        setSocket,
        onlineUser,
        setOnlineUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;