import { useState, useEffect } from 'react';
import { examService } from '../../services/examService';

export const ExamManagement = ({ currentUser }) => {
  const [examData, setExamData] = useState({
    title: '',
    subject: currentUser.role === 'teacher' ? currentUser.subject || '' : '',
    grade: '',
    durationMinutes: 30,
    questions: []
  });

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  // Estados para la gestión de autorizaciones de alumnos
  const [examsList, setExamsList] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');

  // Cargar lista de exámenes al montar el componente
  useEffect(() => {
    fetchExams();
  }, [currentUser]);

  const fetchExams = async () => {
    try {
      const data = await examService.getAuthorizedExams(currentUser.role, currentUser.email);
      setExamsList(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al obtener exámenes para gestión:", err);
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!questionText) return alert("Escribe la pregunta");

    const formattedOptions = options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === parseInt(correctIndex)
    }));

    setExamData({
      ...examData,
      questions: [...examData.questions, { text: questionText, options: formattedOptions }]
    });

    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
  };

  const handleSaveExam = async () => {
    try {
      if (examData.questions.length === 0) {
        return alert("Debes agregar al menos una pregunta al examen.");
      }
      await examService.createExam(examData);
      alert("¡Examen creado y publicado exitosamente!");
      setExamData({ 
        title: '', 
        subject: currentUser.role === 'teacher' ? currentUser.subject || '' : '', 
        grade: '', 
        durationMinutes: 30, 
        questions: [] 
      });
      fetchExams(); // Recargar la lista
    } catch (err) {
      alert(err || "Error al guardar el examen");
    }
  };

  const handleToggleAccess = async (examId, authorize) => {
    if (!studentEmail) {
      alert("Por favor, ingresa el correo del estudiante en el campo de abajo.");
      return;
    }

    try {
      await examService.toggleStudentAccess(examId, studentEmail, authorize);
      alert(`Estudiante ${studentEmail} ${authorize ? 'autorizado' : 'desautorizado'} con éxito.`);
      fetchExams(); // Actualizar la lista para reflejar el cambio
    } catch (err) {
      alert("Error al modificar la autorización: " + err);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Gestión de Exámenes ({currentUser.role === 'teacher' ? 'Panel Profesor' : 'Panel Administrador'})</h2>
      
      {/* Sección 1: Crear Examen */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <h3>Crear Nuevo Examen</h3>
        <input
          type="text"
          placeholder="Título del Examen"
          className="form-input"
          value={examData.title}
          onChange={(e) => setExamData({ ...examData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Materia"
          className="form-input"
          value={examData.subject}
          disabled={currentUser.role === 'teacher'} 
          onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
        />
        <input
          type="text"
          placeholder="Grado / Curso"
          className="form-input"
          value={examData.grade}
          onChange={(e) => setExamData({ ...examData, grade: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duración en minutos"
          className="form-input"
          value={examData.durationMinutes}
          onChange={(e) => setExamData({ ...examData, durationMinutes: e.target.value })}
        />
      </div>

      <hr />

      {/* Agregar Preguntas */}
      <form onSubmit={handleAddQuestion} style={{ display: 'grid', gap: '10px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <h4>Agregar Pregunta (Total añadidas: {examData.questions.length})</h4>
        <input
          type="text"
          placeholder="Texto de la pregunta"
          className="form-input"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        {options.map((opt, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={`Opción ${idx + 1}`}
              className="form-input"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[idx] = e.target.value;
                setOptions(newOpts);
              }}
            />
            <label style={{ fontSize: '12px' }}>
              <input
                type="radio"
                name="correctOpt"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
              /> Correcta
            </label>
          </div>
        ))}
        <button type="submit" className="btn-secondary">Añadir Pregunta al Examen</button>
      </form>

      <button onClick={handleSaveExam} className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>
        Publicar Examen Completo
      </button>

      <hr style={{ margin: '40px 0' }} />

      {/* Sección 2: Panel para Gestionar Autorizaciones de Alumnos en Exámenes Existentes */}
      <div>
        <h3>Autorizar Estudiantes en Exámenes Existentes</h3>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}><strong>1. Escribe el correo del alumno a autorizar/revocar:</strong></label>
          <input
            type="email"
            placeholder="alumno@colegio.com"
            className="form-input"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
        </div>

        <h4>2. Selecciona el examen al que deseas aplicarlo:</h4>
        {examsList.length === 0 ? (
          <p>No hay exámenes creados todavía.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '15px' }}>
            {examsList.map((exam) => (
              <li key={exam._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>{exam.title}</strong>
                  <p style={{ margin: '3px 0', fontSize: '13px', color: '#666' }}>
                    Materia: {exam.subject} | Grado: {exam.grade}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '12px', color: '#888' }}>
                    Alumnos autorizados actualmente: {exam.authorizedStudents?.length || 0}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleToggleAccess(exam._id, true)} 
                    className="btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    Autorizar en este Examen
                  </button>
                  <button 
                    onClick={() => handleToggleAccess(exam._id, false)} 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: '#e74c3c', color: '#fff', border: 'none' }}
                  >
                    Revocar Acceso
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};