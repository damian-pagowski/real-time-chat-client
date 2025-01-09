import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { WebSocketProvider } from './context/WebSocketContext';
import axios from 'axios';

const App = () => {
  const [ws, setWs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState({ chats: [], allUsers: [] }); 

  const username = import.meta.env.VITE_USERNAME;
  const token = import.meta.env.VITE_WEBSOCKET_TOKEN;
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  // Fetch chats and active users from the server
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [chatsResponse, activeUsersResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:3000/messages/chats?user=${username}`),
          axios.get('http://127.0.0.1:3000/users/active'),
        ]);

        const chats = chatsResponse.data
          .filter((chat) => chat.username !== username) 
          .map((chat) => ({
            username: chat.username,
            lastMessage: chat.lastMessage,
            lastInteraction: chat.last_interaction,
            online: activeUsersResponse.data.includes(chat.username),
          }));

        const allUsers = activeUsersResponse.data
          .filter((user) => user !== username)
          .filter((user) => !chats.some((chat) => chat.username === user));

        setContacts({ chats, allUsers });

        if (chats.length > 0) {
          setSelectedUser(chats[0].username);
          fetchMessageHistory(chats[0].username);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [username]);

  useEffect(() => {
    const socket = new WebSocket(`${websocketUrl}?token=${encodeURIComponent(token)}`);
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      if (message.type === 'direct') {
        setMessages((prev) => [...prev, message]);
      } else if (message.type === 'typing') {
        setTypingStatus((prev) => ({
          ...prev,
          [message.sender]: message.status === 'startTyping',
        }));
      } else if (message.type === 'presence') {
        setOnlineUsers((prev) => {
          const updatedUsers =
            message.status === 'online'
              ? [...new Set([...prev, message.user])]
              : prev.filter((user) => user !== message.user);

          setContacts((prevContacts) => {
            const updatedChats = prevContacts.chats.map((chat) =>
              chat.username === message.user
                ? { ...chat, online: message.status === 'online' }
                : chat
            );

            const updatedAllUsers =
              message.status === 'online'
                ? [...prevContacts.allUsers, message.user].filter(
                    (user) => !updatedChats.some((chat) => chat.username === user)
                  )
                : prevContacts.allUsers.filter((user) => user !== message.user);

            return { chats: updatedChats, allUsers: updatedAllUsers };
          });

          return updatedUsers;
        });
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      socket.close();
    };
  }, [websocketUrl, token]);

  const fetchMessageHistory = async (user) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/messages/direct`, {
        params: { user1: username, user2: user },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessageHistory(user);
  };

  const handleSendMessage = (text) => {
    if (ws && selectedUser) {
      const payload = {
        type: 'direct',
        recipient: selectedUser,
        text,
      };

      ws.send(JSON.stringify(payload));
      setMessages((prev) => [...prev, { sender: username, recipient: selectedUser, text }]);
    }
  };

  const handleTyping = (status) => {
    if (ws && selectedUser) {
      ws.send(JSON.stringify({ type: 'typing', recipient: selectedUser, status }));
    }
  };

  return (
    <WebSocketProvider ws={ws}>
      <Navbar />
      <div className="d-flex" style={{ height: '90vh' }}>
        <Sidebar
          contacts={contacts} 
          onSelectUser={handleSelectUser}
        />
        <ChatArea
          selectedUser={selectedUser}
          messages={messages.filter(
            (msg) => msg.sender === selectedUser || msg.recipient === selectedUser
          )}
          typingIndicator={typingStatus[selectedUser] || false}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      </div>
    </WebSocketProvider>
  );
};

export default App;