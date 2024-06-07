import React, { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';
const WebSocketContext = createContext(null);
export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const connect = () => {
        const ws = io("ws://localhost:5000");
        setSocket(ws);
        return ws;
    };
    return (
        <WebSocketContext.Provider value={{ socket, connect}}>
            {children}
        </WebSocketContext.Provider>
    );
};
export const useWebSocket = () => useContext(WebSocketContext);
