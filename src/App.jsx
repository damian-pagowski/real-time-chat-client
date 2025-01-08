import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { WebSocketProvider } from './context/WebSocketContext';

const App = () => {
  const [ws, setWs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([{"sender":"damian","text":"hujo","messageId":250,"timestamp":1736334695525,"type":"direct"}]);
  const [typingStatus, setTypingStatus] = useState({});

  const username = 'client'
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNsaWVudCIsImlhdCI6MTczNjMzMDcxN30.VQVUNrFaIXJfuq89bIB1yP7C0LKJupVFwS3KMLvSbRQ";



  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000/ws?token=${encodeURIComponent(token)}`);

    socket.onopen = () => {
      console.log('WebSocket connection opened (App)');
      setWs(socket);
    };


    socket.onmessage = (event) => {
      console.log('Raw WebSocket message received (App):', event.data);
      const message = JSON.parse(event.data);

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
      console.log('WebSocket connection closed (App)');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      socket.close();
    };
  }, []);

  const handleSendMessage = (text) => {
    console.log(text)
    console.log(selectedUser)
    if (ws && selectedUser) {

      const payload = JSON.stringify({
        type: 'direct',
        recipient: selectedUser,
        text,
      });

      console.log(JSON.stringify(payload))
      ws.send(payload);
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