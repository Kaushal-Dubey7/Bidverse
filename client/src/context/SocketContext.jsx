import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { token, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => {
            console.log('🔗 Connected to Socket Server');
            setConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔌 Disconnected from Socket Server');
            setConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        // Global listeners for personal notifications across the app
        socketInstance.on('new-notification', (notification) => {
            toast(notification.title, {
                icon: notification.type === 'won' ? '🎉' : notification.type === 'outbid' ? '⚠️' : '🔔',
                duration: 5000,
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [isAuthenticated, token]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
