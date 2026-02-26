import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verify session on mount by hitting a protected profile route or refreshing the token
    useEffect(() => {
        const verifySession = async () => {
            try {
                // We use a silent instance or catch the error explicitly so it doesn't pollute the console
                // if the user is simply not logged in yet.
                await api.post('/auth/refresh');
                setUser({ authenticated: true });
            } catch (err) {
                // Expected if the user has no cookies yet (401). We just leave user as null.
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser({ authenticated: true, role: res.data.data.role });
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setUser({ authenticated: true, role: res.data.data.role });
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout error', err);
        }
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
