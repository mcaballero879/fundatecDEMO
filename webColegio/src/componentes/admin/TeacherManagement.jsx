import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

export const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', DNI: '', email: '', password: '', role: 'teacher', subject: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchTeachers = async () => {
    try {
      const data = await userService.getAllUsers();
      // Filtrar solo profesores
      setTeachers(data.filter(u => u.role === 'teacher'));
    } catch (err) {
      console.error("Error al cargar profesores");
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Si estamos editando y la contraseña está vacía, la removemos del payload
      // para que el backend no la sobrescriba con un string vacío.
      const payload = { ...formData };
      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await userService.updateUser(editingId, payload);
        alert('Profesor actualizado correctamente');
      } else {
        await userService.createUser(payload);
        alert('Profesor creado correctamente');
      }
      setFormData({ name: '', DNI: '', email: '', password: '', role: 'teacher', subject: '' });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      // Manejamos si el error viene como string o como objeto Error
      const errorMessage = typeof err === 'string' ? err : (err.message || 'Error en la operación');
      alert(errorMessage);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({ name: teacher.name, DNI: teacher.DNI, email: teacher.email, password: '', role: 'teacher', subject: teacher.subject || '' });
    setEditingId(teacher._id);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este profesor?')) {
      await userService.deleteUser(id);
      fetchTeachers();
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Gestión de Profesores y Materias (CRUD)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="form-input" />
        <input type="text" placeholder="DNI" value={formData.DNI} onChange={e => setFormData({...formData, DNI: e.target.value})} required className="form-input" />
        <input type="email" placeholder="Correo" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="form-input" />
        <input type="password" placeholder="Contraseña" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} {...(!editingId && {required: true})} className="form-input" />
        <input type="text" placeholder="Materia Asignada (Ej: Redes)" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="form-input" />
        <button type="submit" className="btn-primary">{editingId ? 'Actualizar Profesor' : 'Crear Profesor'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', DNI: '', email: '', password: '', role: 'teacher', subject: '' }); }} className="btn-secondary">Cancelar</button>}
      </form>

      <h3>Lista de Profesores</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teachers.map(t => (
          <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <span>{t.name} - {t.DNI} | <strong>Materia: {t.subject || 'Sin asignar'}</strong></span>
            <div>
              <button onClick={() => handleEdit(t)} style={{ marginRight: '5px' }}>Editar</button>
              <button onClick={() => handleDelete(t._id)} style={{ color: 'red' }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};