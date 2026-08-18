import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', DNI: '', email: '', password: '', role: 'student' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const data = await userService.getAllUsers();
      // Filtrar solo alumnos
      setStudents(data.filter(u => u.role === 'student'));
    } catch (err) {
      console.error("Error al cargar alumnos");
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userService.updateUser(editingId, formData);
        alert('Alumno actualizado correctamente');
      } else {
        await userService.createUser(formData);
        alert('Alumno creado correctamente');
      }
      setFormData({ name: '', DNI: '', email: '', password: '', role: 'student' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Error en la operación');
    }
  };

  const handleEdit = (student) => {
    setFormData({ name: student.name, DNI: student.DNI, email: student.email, password: '', role: 'student' });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      await userService.deleteUser(id);
      fetchStudents();
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Gestión de Alumnos (CRUD)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="form-input" />
        <input type="text" placeholder="DNI" value={formData.DNI} onChange={e => setFormData({...formData, DNI: e.target.value})} required className="form-input" />
        <input type="email" placeholder="Correo" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="form-input" />
        <input type="password" placeholder="Contraseña" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} {...(!editingId && {required: true})} className="form-input" />
        <button type="submit" className="btn-primary">{editingId ? 'Actualizar Alumno' : 'Crear Alumno'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', DNI: '', email: '', password: '', role: 'student' }); }} className="btn-secondary">Cancelar</button>}
      </form>

      <h3>Lista de Alumnos</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map(s => (
          <li key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <span>{s.name} - {s.DNI} ({s.email})</span>
            <div>
              <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Editar</button>
              <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};