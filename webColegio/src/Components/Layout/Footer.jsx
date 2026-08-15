import React from 'react';
import '../../assets/css/Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <h3>FUNDETEC</h3>
          <p>Perú 562, C1068 AAB, Buenos Aires, Argentina</p>
          <p>-</p>
          <p>inscripciones@fundetec.org.ar</p>
          
          <div className="footer-socials">
            {/* Puedes reemplazar los spans por iconos de react-icons si lo deseas */}
            <a href="#instagram" aria-label="Instagram" className="social-icon">📷</a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon">in</a>
            <a href="#facebook" aria-label="Facebook" className="social-icon">f</a>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-logos">
          <div className="footer-logo-item">
            <span className="logo-fundetec-text">Fundetec</span>
          </div>
          <div className="footer-logo-item">
            <span className="logo-copitec-text">COPITEC</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2026 por FUNDETEC.</p>
      </div>

      {/* Botón flotante de chat (estilo widget inferior derecho) */}
      <button className="chat-floating-btn" onClick={() => alert('Abriendo chat...')}>
        <span className="chat-icon">💬</span> ¡Vamos a chatear!
      </button>
    </footer>
  );
};