import { api } from './api';

// Función auxiliar interna para formatear las preguntas antes de enviarlas al backend
const formatExamPayload = (examData) => {
    if (!examData.questions) return examData;

    const formattedQuestions = examData.questions.map((q, qIndex) => {
        // Buscamos cuál opción marcó el usuario como correcta (isCorrect === true)
        const correctOpt = q.options.find(opt => opt.isCorrect);

        return {
            id: q.id || qIndex + 1,
            text: q.text,
            options: q.options.map((opt, optIdx) => ({
                id: opt.id || String(optIdx + 1),
                text: opt.text
            })),
            correct: q.correct || (correctOpt ? correctOpt.text : "")
        };
    });

    return {
        ...examData,
        questions: formattedQuestions
    };
};

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

    // Autorizar o desautorizar a un estudiante específico para un examen
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
            const payload = formatExamPayload(examData);
            const response = await api.post('/api/v1/examenes/', payload);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al crear el examen";
        }
    },

    // NUEVO: Función para editar un examen existente
    updateExam: async (id, examData) => {
        try {
            const payload = formatExamPayload(examData);
            const response = await api.put(`/api/v1/examenes/${id}`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || "Error al actualizar el examen";
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