import { api } from './api';

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/api/v1/usuarios', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al registrar usuario";
        }
    },

    login: async (credentials) => {
        try {
            // credentials debe contener: { email, DNI, password }
            const response = await api.post('/api/v1/usuarios/login', credentials);
            const user = response.data.user;
            
            // Guardamos la sesión real en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        } catch (error) {
            throw error.response?.data?.error || "Correo, DNI o contraseña incorrectos";
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout: () => {
        localStorage.removeItem('currentUser');
    }
};