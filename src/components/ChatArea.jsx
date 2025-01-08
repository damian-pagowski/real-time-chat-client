import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import MessageInput from './MessageInput';
const ChatArea = () => {
    const ws = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [typingIndicator, setTypingIndicator] = useState('');

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message)

                if (message.type === 'direct') {
                    console.log(message)
                    setMessages((prev) => [...prev, message]);
                } else if (message.type === 'typing') {
                    if (message.status === 'startTyping') {
                        setTypingIndicator(`${message.sender} is typing...`);
                    } else {
                        setTypingIndicator('');
                    }
                }

            };
        }
    }, [ws]);

    const handleMessageSent = (message) => {
        setMessages((prev) => [...prev, message]);
    };

    return (

        <div className="p-3 flex-grow-1 d-flex flex-column">
            <div
                style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    height: '70%',
                    overflowY: 'scroll',
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender || 'Server'}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <div className="text-muted" style={{ height: '20px' }}>
                {typingIndicator}
            </div>
            <MessageInput onMessageSent={handleMessageSent} />
        </div>
    );
}
export default ChatArea;