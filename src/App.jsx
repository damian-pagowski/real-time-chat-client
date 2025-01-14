import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { WebSocketProvider } from "./context/WebSocketContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  fetchChats,
  fetchActiveUsers,
  fetchMessageHistory
} from "./api/api";

import {
  sendMessage,
  sendTypingStatus,
  sendReadReceipt,
} from "./api/ws";


const App = () => {
  const [ws, setWs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState({ chats: [], allUsers: [] });
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!token || !username) {
      navigate("/login");
      return;
    }

    const fetchContacts = async () => {
      try {
        const [chats, activeUsers] = await Promise.all([
          fetchChats(token),
          fetchActiveUsers(token),
        ]);

        const chatList = chats
          .filter((chat) => chat !== username)
          .map((chat) => ({
            username: chat,
            online: activeUsers.includes(chat),
          }));

        const allUsers = activeUsers
          .filter((user) => user !== username)
          .filter((user) => !chatList.some((chat) => chat.username === user));

        setContacts({ chats: chatList, allUsers });

        if (chatList.length > 0) {
          setSelectedUser(chatList[0].username);
          const messages = await fetchMessageHistory(token, chatList[0].username);
          console.log("fetchMessageHistory" + JSON.stringify(messages))
          setMessages(messages);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [username, token]);

  const handleLogout = () => {
    localStorage.clear();
    setWs(null);
    setSelectedUser(null);
    setMessages([]);
    setTypingStatus({});
    setOnlineUsers([]);
    setContacts({ chats: [], allUsers: [] });
    setUnreadCounts({});
    navigate("/login");
  };

  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}?token=${encodeURIComponent(token)}`);

    socket.onopen = () => setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "direct") {
        setMessages((prev) => {
          const updatedMessages = [...prev, message];
          if (message.sender !== selectedUser) {
            setUnreadCounts((prevCounts) => ({
              ...prevCounts,
              [message.sender]: (prevCounts[message.sender] || 0) + 1,
            }));
          }
          return updatedMessages;
        });
      } else if (message.type === "readReceipt") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id == message.messageId ? { ...msg, read: true } : msg
          )
        );
      } else if (message.type === "typing") {
        setTypingStatus((prev) => ({
          ...prev,
          [message.sender]: message.status === "startTyping",
        }));
      } else if (message.type === "presence") {
        // Handle user presence
        const { status, user } = message;
        setOnlineUsers((prev) =>
          status === "online"
            ? [...new Set([...prev, user])]
            : prev.filter((u) => u !== user)
        );
      }
    };

    socket.onclose = () => setWs(null);

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const handleSelectUser = async (user) => {
    console.log("handleSelectUser: " + user)

    setSelectedUser(user);
    if (user) {
      const messages = await fetchMessageHistory(token, user);
      console.log("fetchMessageHistory" + JSON.stringify(messages))

      setMessages(messages);
      setUnreadCounts((prev) => ({ ...prev, [user]: 0 }));
    }
  };

  const handleSendMessage = (text) => {
    if (ws && selectedUser) {
      sendMessage(ws, selectedUser, text);
      setMessages((prev) => [
        ...prev,
        { sender: username, recipient: selectedUser, text, read: false },
      ]);
    }
  };

  const handleTyping = (status) => {
    if (ws && selectedUser) {
      sendTypingStatus(ws, selectedUser, status);
    }
  };

  const handleReadMessage = (messageId) => {
    if (ws) {
      sendReadReceipt(ws, messageId);
    }
  };

  return (
    <WebSocketProvider ws={ws}>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <div className="d-flex" style={{ height: "90vh" }}>
              <Sidebar
                contacts={contacts}
                onSelectUser={handleSelectUser}
                unreadCounts={unreadCounts}
                onlineUsers={onlineUsers}
              />
              <ChatArea
                selectedUser={selectedUser}
                messages={messages.filter(
                  (msg) =>
                    (msg.sender?.username ?? null) === selectedUser ||
                    (msg.recipient?.username ?? null) === selectedUser
                )}
                typingIndicator={typingStatus[selectedUser] || false}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                onReadMessage={handleReadMessage}
              />
            </div>
          }
        />
      </Routes>
    </WebSocketProvider>
  );
};

export default App;