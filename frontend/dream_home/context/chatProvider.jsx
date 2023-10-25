import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);
  const [headerRefresh,setHeaderRefresh]=useState(false)

  return (
    <ChatContext.Provider
      value={{
        notification,
        setNotification,
        headerRefresh,
        setHeaderRefresh
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