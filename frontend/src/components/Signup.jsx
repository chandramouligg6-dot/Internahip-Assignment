import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        {
          name,
          email,
          password,
          role,
        }
      );

      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Account</h2>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button style={styles.button} type="submit">
          Sign Up
        </button>
      </form>

      <p style={styles.switchText}>
        Already have an account?{' '}
        <Link to="/login" style={styles.switchLink}>
          Login
        </Link>
      </p>
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
    marginBottom: '25px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #0d9488',
    backgroundColor: '#0f1e2e',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0d9488',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  success: {
    color: '#4ade80',
    textAlign: 'center',
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
  },
  switchText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '15px',
  },
  switchLink: {
    color: '#0d9488',
  },
};

export default Signup;