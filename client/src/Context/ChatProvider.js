import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notify, setNotify] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log("Iam provider", userInfo);
    console.log("Iam chats", selectedChat);
    if (userInfo) {
      setUser(userInfo);
    } else {
      console.log("Erro in Context")
      navigate('/')
    }

  }, [navigate])

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notify, setNotify }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}




export default ChatProvider;