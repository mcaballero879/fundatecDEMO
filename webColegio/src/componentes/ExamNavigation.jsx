export function ExamNavigation({ totalQuestions, currentIndex, answers, onSelectIndex, onSubmit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = answers[index] !== undefined;
          const isCurrent = currentIndex === index;

          return (
            <button
              key={index}
              onClick={() => onSelectIndex(index)}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                border: isCurrent ? '2px solid #1976d2' : '1px solid #ccc',
                background: isAnswered ? '#4caf50' : '#fff',
                color: isAnswered ? '#fff' : '#333',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={onSubmit}
        style={{
          background: '#d32f2f',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Finalizar Examen
      </button>
    </div>
  );
}