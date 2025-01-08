import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => (
  <div className="bg-light p-3" style={{ width: '25%', borderRight: '1px solid #ddd' }}>
    <h5>Contacts</h5>
    <ListGroup>
      <ListGroup.Item action>John Doe</ListGroup.Item>
      <ListGroup.Item action>Jane Smith</ListGroup.Item>
      <ListGroup.Item action>Chat Group</ListGroup.Item>
    </ListGroup>
  </div>
);

export default Sidebar;