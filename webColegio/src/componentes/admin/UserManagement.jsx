import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    DNI: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      alert('¡Usuario creado exitosamente!');
      setFormData({ name: '', DNI: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      alert(err || 'Error al crear el usuario');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Gestión de Usuarios (Panel Admin)</h2>
      
      {/* Formulario de Creación de Usuarios */}
      <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '10px', marginBottom: '30px' }}>
        <h3>Crear Nuevo Usuario</h3>
        <input
          type="text"
          placeholder="Nombre Completo"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="DNI"
          className="form-input"
          value={formData.DNI}
          onChange={(e) => setFormData({ ...formData, DNI: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="form-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <select
          className="form-input"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="student">Alumno (Student)</option>
          <option value="teacher">Profesor (Teacher)</option>
          <option value="admin">Administrador (Admin)</option>
        </select>
        <button type="submit" className="btn-primary">Registrar Usuario</button>
      </form>

      {/* Listado de Usuarios */}
      <h3>Usuarios Registrados en el Sistema</h3>
      {loading ? <p>Cargando...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
        <ul className="exam-list">
          {users.map((u) => (
            <li key={u._id} className="exam-list-item" style={{display:'flex', justifyContent:'space-between', padding:'10px'}}>
              <div>
                <strong>{u.name}</strong> - DNI: {u.DNI}
                <p style={{margin:'2px 0', fontSize:'12px', color:'#666'}}>{u.email} | <em>Rol: {u.role}</em></p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};