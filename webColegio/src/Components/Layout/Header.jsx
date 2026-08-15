import React, { useState } from 'react';
import '../../assets/css/Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fundetec-header">
      <div className="header-container">
        {/* Logo / Marca */}
        <div className="header-logo">
          <div className="logo-graphic">
            <span className="logo-text">Fundetec</span>
          </div>
        </div>

        {/* Botón Menú Hamburguesa para Móviles */}
        <button className="menu-toggle-btn" onClick={toggleMenu} aria-label="Abrir menú">
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Menú de Navegación */}
        <nav className={`header-nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <a href="#inicio" className="nav-item" onClick={toggleMenu}>INICIO</a>
          <a href="#quienes-somos" className="nav-item active" onClick={toggleMenu}>QUIENES SOMOS</a>
          <a href="#novedades" className="nav-item" onClick={toggleMenu}>NOVEDADES</a>
          <a href="#vinculacion" className="nav-item" onClick={toggleMenu}>VINCULACIÓN E INVESTIGACIÓN</a>
          <a href="#somos-uvt" className="nav-item" onClick={toggleMenu}>SOMOS UVT</a>
          <a href="#capacitaciones" className="nav-item" onClick={toggleMenu}>CAPACITACIONES</a>
          <a href="#contacto" className="nav-item" onClick={toggleMenu}>CONTACTO</a>
        </nav>

        {/* Botón Destacado y Redes Sociales */}
        <div className={`header-actions ${isMenuOpen ? 'open' : ''}`}>
          <button className="btn-la-fundacion" onClick={() => alert('La Fundación')}>
            LA FUNDACIÓN
          </button>
          
          <div className="header-social-icons">
            <a href="#youtube" aria-label="YouTube" className="social-link">▶</a>
            <a href="#instagram" aria-label="Instagram" className="social-link">📷</a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-link">in</a>
            <a href="#facebook" aria-label="Facebook" className="social-link">f</a>
          </div>
        </div>
      </div>
    </header>
  );
};