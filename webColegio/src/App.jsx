import { useState, useEffect } from 'react';
import { Timer } from './components/Timer.jsx'
import { QuestionCard } from './components/QuestionCard.jsx';
import { ExamNavigation } from './components/ExamNavigation.jsx'
import { ExamResult } from './components/ExamResult.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { UserManagement } from './components/admin/UserManagement.jsx';
import { ExamManagement } from './components/admin/ExamManagement.jsx';
import { examService } from './services/examService';
import { authService } from './services/authService'; 
import { Footer } from './components/layout/Footer.jsx';
import { Header } from './components/Layout/Header.jsx';
import './assets/css/index.css';

export default function App() {
  const [step, setStep] = useState('login'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [authData, setAuthData] = useState({ name: '', DNI: '', email: '', password: '', role: 'student' });
  const [currentUser, setCurrentUser] = useState(null);

  const [examList, setExamList] = useState([]);
  const [examData, setExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistencia de sesión al cargar la página
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      setStep('select');
      fetchAuthorizedExams(savedUser);
    }
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Validar longitud de contraseña en el cliente antes de enviar
        if (authData.password.length < 8) {
          alert('La contraseña debe tener al menos 8 caracteres.');
          return;
        }
        await authService.register(authData);
        alert('¡Registro exitoso! Por favor inicia sesión.');
        setIsRegistering(false);
        setAuthData({ name: '', DNI: '', email: '', password: '', role: 'student' });
      } else {
        // Validación con el backend usando correo, DNI y contraseña
        const loggedUser = await authService.login({
          email: authData.email,
          DNI: authData.DNI,
          password: authData.password
        });

        setCurrentUser(loggedUser);
        setStep('select');
        fetchAuthorizedExams(loggedUser);
      }
    } catch (err) {
      alert(err || 'Ocurrió un error en la autenticación');
    }
  };

  // Función integrada para obtener los exámenes filtrados/autorizados según el rol y email
  const fetchAuthorizedExams = async (user) => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAuthorizedExams(user.role, user.email);
      setExamList(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || "Error al obtener exámenes autorizados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = (selectedExam) => {
    setExamData(selectedExam);
    setTimeLeft((selectedExam.durationMinutes || 30) * 60);
    setStep('welcome');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setExamData(null);
    setAnswers({});
    setStep('login');
    setAuthData({ name: '', DNI: '', email: '', password: '', role: 'student' });
  };

  return (
    <div className="app-container">
      <Header />
      <header className="app-header">
        <h1>Plataforma de Exámenes en Línea</h1>
        {currentUser && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <p style={{ margin: 0 }}>Usuario: <strong>{currentUser.name}</strong> | Rol: <strong>{currentUser.role}</strong></p>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>

      {/* Pantalla de Login / Registro */}
      {step === 'login' && !currentUser && (
        <div className="card">
          <h2>{isRegistering ? 'Registro de Usuario' : 'Iniciar Sesión'}</h2>
          <form onSubmit={handleAuthSubmit} className="form-group">
            {isRegistering && (
              <input
                type="text"
                placeholder="Nombre Completo"
                className="form-input"
                value={authData.name}
                onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                required
              />
            )}
            
            <input
              type="text"
              placeholder="DNI"
              className="form-input"
              value={authData.DNI}
              onChange={(e) => setAuthData({ ...authData, DNI: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Correo Electrónico"
              className="form-input"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Contraseña (mínimo 8 caracteres)"
              className="form-input"
              minLength={8}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              required
            />

            {isRegistering && (
              <select
                className="form-input"
                value={authData.role}
                onChange={(e) => setAuthData({ ...authData, role: e.target.value })}
                required
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            )}

            <button type="submit" className="btn-primary">
              {isRegistering ? 'Registrarse' : 'Ingresar'}
            </button>
          </form>

          <button onClick={() => setIsRegistering(!isRegistering)} className="btn-secondary">
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      )}

      {/* Selector de Vistas según Rol (Admin, Teacher, Student) */}
      {step === 'select' && (
        <ProtectedRoute currentUser={currentUser}>
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Vistas exclusivas para ADMIN */}
            {currentUser?.role === 'admin' && (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setStep('manage-users')} className="btn-secondary">Gestionar Usuarios</button>
                <button onClick={() => setStep('manage-exams')} className="btn-secondary">Crear Examen (Admin)</button>
              </div>
            )}

            {/* Vistas exclusivas para TEACHER */}
            {currentUser?.role === 'teacher' && (
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setStep('manage-exams')} className="btn-primary">Crear Examen de mi Materia</button>
              </div>
            )}

            {/* Lista de Exámenes Permitidos / Autorizados */}
            <div className="card" style={{ maxWidth: '100%' }}>
              <h2>Exámenes Disponibles</h2>
              {loading ? (
                <p>Cargando exámenes...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : examList.length === 0 ? (
                <p>No tienes exámenes habilitados en este momento.</p>
              ) : (
                <ul className="exam-list">
                  {examList.map((exam) => (
                    <li key={exam._id} className="exam-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                      <div>
                        <strong>{exam.title}</strong>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                          Materia: {exam.subject} | Grado: {exam.grade}
                        </p>
                        {currentUser?.role !== 'student' && (
                          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888' }}>
                            Alumnos autorizados: {exam.authorizedStudents?.length || 0}
                          </p>
                        )}
                      </div>

                      {currentUser?.role === 'student' ? (
                        <button onClick={() => handleSelectExam(exam)} className="btn-primary" style={{ padding: '8px 14px' }}>
                          Rendir Examen
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setExamData(exam);
                            setStep('manage-exam-students');
                          }} 
                          className="btn-secondary" 
                          style={{ padding: '8px 14px' }}
                        >
                          Gestionar Alumnos
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </ProtectedRoute>
      )}

      {/* Pantallas de Gestión Administrativa / Docente de Usuarios */}
      {step === 'manage-users' && (
        <ProtectedRoute currentUser={currentUser} allowedRoles={['admin']}>
          <div>
            <button onClick={() => setStep('select')} className="btn-secondary" style={{ margin: '15px' }}>← Volver</button>
            <UserManagement />
          </div>
        </ProtectedRoute>
      )}

      {/* Pantalla para Crear Exámenes */}
      {step === 'manage-exams' && (
        <ProtectedRoute currentUser={currentUser} allowedRoles={['admin', 'teacher']}>
          <div>
            <button onClick={() => setStep('select')} className="btn-secondary" style={{ margin: '15px' }}>← Volver</button>
            <ExamManagement currentUser={currentUser} />
          </div>
        </ProtectedRoute>
      )}

      {/* NUEVO: Panel específico para autorizar / desautorizar alumnos de un examen seleccionado */}
      {step === 'manage-exam-students' && examData && (
        <ProtectedRoute currentUser={currentUser} allowedRoles={['admin', 'teacher']}>
          <div className="card" style={{ maxWidth: '700px', margin: '20px auto' }}>
            <button onClick={() => setStep('select')} className="btn-secondary" style={{ marginBottom: '15px' }}>← Volver</button>
            
            <h3>Gestionar Autorizaciones</h3>
            <p>Examen: <strong>{examData.title}</strong></p>
            
            <div style={{ margin: '20px 0', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h4>Añadir alumno por correo</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="email"
                  id="newStudentEmail"
                  placeholder="correo.alumno@colegio.com"
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={async () => {
                    const emailInput = document.getElementById('newStudentEmail');
                    const email = emailInput.value;
                    if (!email) return alert("Ingresa un correo válido");
                    
                    try {
                      await examService.toggleStudentAccess(examData._id, email, true);
                      alert(`Alumno ${email} autorizado correctamente.`);
                      emailInput.value = '';
                      // Recargar datos actualizados del examen
                      const updatedExams = await examService.getAuthorizedExams(currentUser.role, currentUser.email);
                      setExamList(Array.isArray(updatedExams) ? updatedExams : [updatedExams]);
                      const current = updatedExams.find(e => e._id === examData._id);
                      if (current) setExamData(current);
                    } catch (err) {
                      alert("Error: " + err);
                    }
                  }}
                  className="btn-primary"
                >
                  Autorizar
                </button>
              </div>
            </div>

            <h4>Alumnos ya autorizados en este examen:</h4>
            {(!examData.authorizedStudents || examData.authorizedStudents.length === 0) ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay alumnos habilitados para este examen todavía.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '8px' }}>
                {examData.authorizedStudents.map((studentEmail, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <span>{studentEmail}</span>
                    <button 
                      onClick={async () => {
                        try {
                          await examService.toggleStudentAccess(examData._id, studentEmail, false);
                          alert(`Acceso revocado a ${studentEmail}`);
                          const updatedExams = await examService.getAuthorizedExams(currentUser.role, currentUser.email);
                          setExamList(Array.isArray(updatedExams) ? updatedExams : [updatedExams]);
                          const current = updatedExams.find(e => e._id === examData._id);
                          if (current) setExamData(current);
                        } catch (err) {
                          alert("Error: " + err);
                        }
                      }}
                      className="btn-secondary"
                      style={{ backgroundColor: '#ff4d4d', color: '#fff', padding: '4px 8px', fontSize: '12px', border: 'none' }}
                    >
                      Quitar Acceso
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ProtectedRoute>
      )}

      {/* Pantalla de Bienvenida al Examen */}
      {step === 'welcome' && examData && (
        <ProtectedRoute currentUser={currentUser}>
          <div className="card">
            <h2>Preparado para el Examen</h2>
            <p>Examen: <strong>{examData.title}</strong></p>
            <button onClick={() => setStep('exam')} className="btn-primary">Comenzar Ahora</button>
            <button onClick={() => setStep('select')} className="btn-secondary">← Volver</button>
          </div>
        </ProtectedRoute>
      )}

      {/* Sala de Examen */}
      {step === 'exam' && examData && (
        <ProtectedRoute currentUser={currentUser}>
          <div className="exam-room-container">
            <div className="exam-header-info">
              <span>Alumno: <strong>{currentUser?.name}</strong></span>
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={() => setStep('result')} />
            </div>

            <QuestionCard
              question={examData.questions[currentIndex]}
              selectedOption={answers[currentIndex]}
              onSelectOption={(qId, optId) => setAnswers({ ...answers, [currentIndex]: optId })}
            />

            <div className="navigation-bar">
              <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} className="nav-btn">Anterior</button>
              <button disabled={currentIndex === examData.questions.length - 1} onClick={() => setCurrentIndex(currentIndex + 1)} className="nav-btn">Siguiente</button>
            </div>

            <ExamNavigation
              totalQuestions={examData.questions.length}
              currentIndex={currentIndex}
              answers={answers}
              onSelectIndex={(index) => setCurrentIndex(index)}
              onSubmit={() => { if (window.confirm('¿Finalizar examen?')) setStep('result'); }}
            />
          </div>
        </ProtectedRoute>
      )}

      {step === 'result' && examData && (
        <ProtectedRoute currentUser={currentUser}>
          <ExamResult
            exam={examData}
            answers={answers}
            onRestart={() => { setStep('select'); setAnswers({}); setCurrentIndex(0); }}
          />
        </ProtectedRoute>
      )}

      <Footer />
    </div>
  );
}