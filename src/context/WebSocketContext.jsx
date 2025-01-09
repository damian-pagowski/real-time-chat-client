import React, { createContext, useContext } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ ws, children }) => (
  <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
);

export const useWebSocket = () => useContext(WebSocketContext);
