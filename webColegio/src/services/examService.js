import { api } from './api';

export const examService = {
    // Obtener exámenes (filtrando automáticamente según rol y email en el backend)
    getAuthorizedExams: async (userRole, userEmail, subject, grade) => {
        try {
            const response = await api.get('/api/v1/examenes/', {
                params: { role: userRole, email: userEmail, subject, grade }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al obtener exámenes autorizados";
        }
    },

    // NUEVO: Autorizar o desautorizar a un estudiante específico para un examen
    toggleStudentAccess: async (examId, studentEmail, authorize) => {
        try {
            const response = await api.put(`/api/v1/examenes/${examId}/authorize`, {
                studentEmail,
                authorize
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al modificar la autorización del alumno";
        }
    },

    createExam: async (examData) => {
        try {
            const response = await api.post('/api/v1/examenes/', examData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al crear el examen";
        }
    },

    deleteExam: async (id) => {
        try {
            const response = await api.delete(`/api/v1/examenes/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al eliminar el examen";
        }
    }
};