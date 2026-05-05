import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('name', response.data.user.name);

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back 👋</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleLogin}>
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
        <button style={styles.button} type="submit">
          Login
        </button>
      </form>

      <p style={styles.switchText}>
        Don't have an account?{' '}
        <Link to="/signup" style={styles.switchLink}>
          Sign Up
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

export default Login;