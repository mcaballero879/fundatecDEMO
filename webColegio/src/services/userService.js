import { api } from './api';

export const userService = {
    // Obtener todos los usuarios
    getAllUsers: async () => {
        try {
            const response = await api.get('/api/v1/usuarios');
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al obtener los usuarios";
        }
    },

    // Crear un nuevo usuario (incluyendo el DNI y el Rol)
    createUser: async (userData) => {
        try {
            // userData debe contener: { name, DNI, email, password, role }
            const response = await api.post('/api/v1/usuarios', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al crear el usuario";
        }
    }
};