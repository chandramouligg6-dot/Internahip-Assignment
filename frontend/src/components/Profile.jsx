import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);

      } catch {
        setError('Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchProfile();
  }, );

  if (error) {
    return (
      <p style={{ color: '#ef4444', textAlign: 'center' }}>
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p style={{ color: 'white', textAlign: 'center' }}>
        Loading...
      </p>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>👤 My Profile</h2>

      <div style={styles.infoRow}>
        <span style={styles.label}>Name</span>
        <span style={styles.value}>{user.name}</span>
      </div>

      <div style={styles.infoRow}>
        <span style={styles.label}>Email</span>
        <span style={styles.value}>{user.email}</span>
      </div>

      <div style={styles.infoRow}>
        <span style={styles.label}>Role</span>
        <span style={styles.badge}>
          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
      </div>

      <div style={styles.infoRow}>
        <span style={styles.label}>Joined</span>
        <span style={styles.value}>
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
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
    marginBottom: '30px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #0d9488',
  },
  label: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  value: {
    color: 'white',
    fontSize: '14px',
  },
  badge: {
    backgroundColor: '#0d9488',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
  },
};

export default Profile;