import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In dev, Vite proxies /socket.io to localhost:5000
    // In production, connects to same origin or window.location.origin
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server with ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinQueue = (queueId) => {
    if (socket && queueId) {
      socket.emit('join_queue', queueId);
    }
  };

  const leaveQueue = (queueId) => {
    if (socket && queueId) {
      socket.emit('leave_queue', queueId);
    }
  };

  const joinToken = (tokenId) => {
    if (socket && tokenId) {
      socket.emit('join_token', tokenId);
    }
  };

  const joinBusiness = (businessId) => {
    if (socket && businessId) {
      socket.emit('join_business', businessId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinQueue,
        leaveQueue,
        joinToken,
        joinBusiness,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
