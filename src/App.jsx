import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { WebSocketProvider } from './context/WebSocketContext';

const App = () => {
  const [ws, setWs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});

  const username = import.meta.env.VITE_USERNAME;
  const token = import.meta.env.VITE_WEBSOCKET_TOKEN;
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

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
        <Sidebar contacts={['damian', 'john', 'jane']} onSelectUser={setSelectedUser} />
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