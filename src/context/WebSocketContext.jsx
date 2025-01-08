import React, { createContext, useState, useEffect } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);



    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => React.useContext(WebSocketContext);
