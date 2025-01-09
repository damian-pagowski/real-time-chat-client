import React, { useRef, useEffect } from "react";
import MessageInput from "./MessageInput";

const ChatArea = ({
  selectedUser,
  messages,
  typingIndicator,
  onSendMessage,
  onTyping,
  onReadMessage,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Send read receipts for unread messages
    messages
      .filter((msg) => msg.sender === selectedUser && !msg.read)
      // .forEach((msg) => console.log(msg))
      // Only unread messages from the selected user
      .forEach((msg) => onReadMessage(msg.id)); // Send read receipt for each unread message
  }, [messages, selectedUser, onReadMessage]);

  return (
    <div className="p-3 flex-grow-1 d-flex flex-column">
      <div className="mb-2">
        <h6>
          {selectedUser
            ? `Chat with: ${selectedUser}`
            : "Select a user to chat with"}
        </h6>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          height: "70%",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender || "Server"}:</strong> {msg.text}{" "}
            {msg.read ? (
              <span className="text-success">✔</span> // Tick for read messages
            ) : (
              <span className="badge bg-primary">Unread</span> // Badge for unread messages
            )}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="text-muted" style={{ height: "20px" }}>
        {typingIndicator && `${selectedUser} is typing...`}
      </div>
      <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
};

export default ChatArea;
