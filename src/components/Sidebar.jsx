import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = ({ contacts, onSelectUser }) => (
    <div className="bg-light p-3" style={{ width: '25%', borderRight: '1px solid #ddd' }}>
        <h5>Contacts</h5>
        <ListGroup>
            {contacts.map((contact) => (
                <ListGroup.Item key={contact} action onClick={() => onSelectUser(contact)}>
                    {contact}
                </ListGroup.Item>
            ))}
        </ListGroup>
    </div>
);

export default Sidebar;