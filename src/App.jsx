import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="d-flex" style={{ height: '90vh' }}>
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default App;