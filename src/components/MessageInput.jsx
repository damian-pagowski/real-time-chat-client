import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const typingTimeout = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    onTyping("startTyping");
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onTyping("stopTyping");
    }, 2000);
  };

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
