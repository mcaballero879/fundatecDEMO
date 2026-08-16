export function ExamResult({ exam, answers, onRestart }) {
  // Calcular puntaje
  let score = 0;
  exam.questions.forEach((q, index) => {
    if (answers[index] === q.correct) {
      score += 1;
    }
  });

  const percentage = Math.round((score / exam.questions.length) * 100);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2>Resultados del Examen</h2>
      <p style={{ fontSize: '18px', color: '#555' }}>{exam.title}</p>
      
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: percentage >= 60 ? '#2e7d32' : '#c62828', margin: '20px 0' }}>
        {score} / {exam.questions.length}
      </div>
      
      <p>Calificación: <strong>{percentage}%</strong></p>
      <p>{percentage >= 60 ? '🎉 ¡Felicitaciones, has aprobado!' : '❌ No alcanzaste el puntaje mínimo.'}</p>

      <button
        onClick={onRestart}
        style={{
          marginTop: '20px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Volver al Inicio
      </button>
    </div>
  );
}