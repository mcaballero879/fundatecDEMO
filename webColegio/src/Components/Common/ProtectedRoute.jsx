import React from 'react';

export const ProtectedRoute = ({ currentUser, allowedRoles, children }) => {
  // 1. Si no hay usuario logueado, redirige o bloquea el acceso
  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Acceso Denegado</h3>
        <p>Debes iniciar sesión para acceder a esta sección.</p>
      </div>
    );
  }

  // 2. Si se requieren roles específicos y el usuario no los tiene
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Permisos Insuficientes</h3>
        <p>No tienes el rol autorizado para ver este contenido.</p>
      </div>
    );
  }

  // Si pasa las validaciones, renderiza el componente hijo
  return children;
};