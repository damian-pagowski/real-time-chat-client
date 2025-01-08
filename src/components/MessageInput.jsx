import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useWebSocket } from '../context/WebSocketContext';

const MessageInput = ({ onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const ws = useWebSocket();
    let typingTimeout;

    const handleSend = () => {
        if (message.trim() && ws) {
            const payload = JSON.stringify({
                type: 'direct',
                recipient: 'damian',
                text: message,
            });

            ws.send(payload);
            onMessageSent({ sender: 'You', text: message });
            setMessage('');
        }
    };

    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
            ws.send(JSON.stringify({ type: 'typing', recipient: 'damian', status: "startTyping" }));

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                setTyping(false);
                ws.send(JSON.stringify({ type: 'typing', recipient: 'damian', status: "stopTyping" }));
            }, 2000);
        };
    }

    return (
        <Form className="d-flex mt-2">
            <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }}
                className="me-2"
            />
            <Button variant="primary" onClick={handleSend}>
                Send
            </Button>
        </Form>
    );
};

export default MessageInput;