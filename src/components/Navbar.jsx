import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const AppNavbar = () => (
  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>WebSocketeer Chat</Navbar.Brand>
    </Container>
  </Navbar>
);

export default AppNavbar;