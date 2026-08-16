import { useEffect } from 'react';

export function Timer({ timeLeft, setTimeLeft, onTimeUp }) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, setTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ 
      background: timeLeft < 30 ? '#ffebee' : '#e3f2fd', 
      color: timeLeft < 30 ? '#c62828' : '#0d47a1',
      padding: '10px 15px', 
      borderRadius: '8px', 
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      ⏱️ Tiempo restante: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}