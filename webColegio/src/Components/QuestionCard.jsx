export function QuestionCard({ question, selectedOption, onSelectOption }) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
      <h3>{question.text}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {question.options.map((option) => (
          <label 
            key={option.id} 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              cursor: 'pointer',
              background: selectedOption === option.id ? '#e8f5e9' : '#fafafa',
              borderColor: selectedOption === option.id ? '#4caf50' : '#ddd'
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onSelectOption(question.id, option.id)}
              style={{ marginRight: '10px' }}
            />
            {option.text}
          </label>
        ))}
      </div>
    </div>
  );
}