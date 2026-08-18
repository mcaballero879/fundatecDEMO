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
    },

    // Actualizar un usuario existente
    updateUser: async (id, userData) => {
        try {
            // Verifica que lleve la barra '/' separando la ruta del id
            const response = await api.put(`/api/v1/usuarios/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al actualizar el usuario";
        }
    },

    // Eliminar un usuario
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/api/v1/usuarios/definitivo/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al eliminar el usuario";
        }
    }
};