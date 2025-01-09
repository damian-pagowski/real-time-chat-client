import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
const AppNavbar = ({onLogout}) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand>WebSocketeer Chat</Navbar.Brand>
        <Button variant="outline-light" onClick={onLogout}>Logout</Button> {/* Added Logout button */}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;