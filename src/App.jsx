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
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const username = import.meta.env.VITE_USERNAME;
  const token = import.meta.env.VITE_WEBSOCKET_TOKEN;
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [chatsResponse, activeUsersResponse] = await Promise.all([
          axios.get(`${apiUrl}/messages/chats?user=${username}`),
          axios.get(`${apiUrl}/users/active`),
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
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      if (message.type === 'direct') {
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
      } else if (message.type === 'readReceipt') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id == message.messageId
              ? { ...msg, read: true }
              : msg
          )
        );
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
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [websocketUrl, token]);

  const fetchMessageHistory = async (user) => {
    try {
      const response = await axios.get(`${apiUrl}/messages/direct`, {
        params: { user1: username, user2: user },
      });

      setMessages(
        response.data.map((msg) => ({
          ...msg,
          read: Boolean(msg.read),
        }))
      );
      setUnreadCounts((prev) => ({ ...prev, [user]: 0 }));
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
      setMessages((prev) => [...prev, { sender: username, recipient: selectedUser, text, read: false }]);
    }
  };

  const handleTyping = (status) => {
    if (ws && selectedUser) {
      ws.send(JSON.stringify({ type: 'typing', recipient: selectedUser, status }));
    }
  };

  const handleReadMessage = (messageId) => {
    if (ws) {
      console.log("Sending ACK " + messageId)
      ws.send(JSON.stringify({ type: 'readReceipt', messageId }));
    }
  };


  return (
    <WebSocketProvider ws={ws}>
      <Navbar />
      <div className="d-flex" style={{ height: '90vh' }}>
        <Sidebar
          contacts={contacts}
          onSelectUser={handleSelectUser}
          unreadCounts={unreadCounts}
        />
        <ChatArea
          selectedUser={selectedUser}
          messages={messages.filter(
            (msg) => msg.sender === selectedUser || msg.recipient === selectedUser
          )}
          typingIndicator={typingStatus[selectedUser] || false}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onReadMessage={handleReadMessage}
        />
      </div>
    </WebSocketProvider>
  );
};

export default App;