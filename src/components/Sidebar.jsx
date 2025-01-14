import React from "react";
import { ListGroup } from "react-bootstrap";

const Sidebar = ({ contacts, onSelectUser, unreadCounts, onlineUsers }) => {
  return (
    <div
      className="p-3"
      style={{ width: "25%", borderRight: "1px solid #ddd" }}
    >
      <h5>Chats</h5>
      <ListGroup>
        {contacts.chats.map((chat, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between bg-dark text-white"
            action
            onClick={() => onSelectUser(chat.username)}
          >
            <span>
              {chat.username || "Unknown"}
              {unreadCounts[chat.username] > 0 && (
                <span className="badge ms-2">
                  {unreadCounts[chat.username]}
                </span>
              )}
            </span>
            <span className={chat.online ? "text-success" : "text-danger"}>
              {chat.online ? "●" : "●"}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h5 className="mt-3">Active Users</h5>
      <ListGroup>
        {contacts.allUsers.map((user, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between"
            action
            onClick={() => onSelectUser(user)}
          >
            <span>{user}</span>
            <span className="text-success">●</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
