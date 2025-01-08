import React, { createContext, useState, useEffect } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNsaWVudCIsImlhdCI6MTczNjMwODI2NH0.NndHSE4NM4tIl1F_jzJB22WHnH4wlcFPVVGyQjwODQ0';
        const socket = new WebSocket(`ws://localhost:3000/ws?token=${encodeURIComponent(token)}`);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setWs(socket);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.reason);
            setWs(null);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            console.log('Cleaning up WebSocket connection');
            socket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => React.useContext(WebSocketContext);
