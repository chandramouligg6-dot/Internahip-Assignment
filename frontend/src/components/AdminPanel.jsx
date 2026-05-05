import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || role !== 'admin') {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/admin',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.users);

      } catch {
        setError('Access denied or session expired.');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchUsers();
  }, );

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  if (error) {
    return (
      <p style={{ color: '#ef4444', textAlign: 'center' }}>
        {error}
      </p>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>👑 Admin Panel</h2>
      <p style={styles.subtitle}>Total Users: {users.length}</p>

      {users.map((user) => (
        <div key={user._id} style={styles.userRow}>
          <div>
            <p style={styles.name}>{user.name}</p>
            <p style={styles.email}>{user.email}</p>
            <span style={styles.badge}>
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </div>
          <button
            style={styles.deleteBtn}
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#162b44',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  title: {
    color: '#5eead4',
    textAlign: 'center',
    marginBottom: '5px',
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '25px',
  },
  userRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#0f1e2e',
    borderRadius: '8px',
    border: '1px solid #0d9488',
  },
  name: {
    color: 'white',
    margin: '0 0 4px 0',
    fontWeight: 'bold',
  },
  email: {
    color: '#94a3b8',
    margin: '0 0 6px 0',
    fontSize: '13px',
  },
  badge: {
    backgroundColor: '#0d9488',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminPanel;