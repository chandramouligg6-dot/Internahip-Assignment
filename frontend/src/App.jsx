import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Connect The Stack</h2>
      <div style={styles.navLinks}>
        {!token && <Link to="/signup" style={styles.link}>Signup</Link>}
        {!token && <Link to="/login" style={styles.link}>Login</Link>}
        {token && <Link to="/profile" style={styles.link}>Profile</Link>}
        {token && role === 'admin' && <Link to="/admin" style={styles.link}>Admin Panel</Link>}
        {token && <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={styles.container}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1a1a2e',
    color: 'white',
  },
  logo: {
    margin: 0,
    color: '#0d9488',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: '#5eead4',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '0 20px',
  },
};

export default App;