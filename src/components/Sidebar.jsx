import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = ({ contacts, onlineUsers, onSelectUser }) => {
  return (
    <div className="bg-light p-3" style={{ width: '25%', borderRight: '1px solid #ddd' }}>
      <h5>Contacts</h5>
      <ListGroup>
        {contacts.map((user, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between"
            action
            onClick={() => onSelectUser(user)}
          >
            <span>{user}</span>
            <span className={onlineUsers.includes(user) ? 'text-success' : 'text-muted'}>
              {onlineUsers.includes(user) ? '● Online' : '● Offline'}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;