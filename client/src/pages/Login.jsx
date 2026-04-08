import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, dark, toggleDark } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="container" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
    }}>
      <div style={{ position: 'fixed', top: '24px', right: '24px' }}>
        <button className="theme-btn" onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="main-card" style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
        <div className="logo-section" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1>Login</h1>
          <p>Access your contacts</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <label className="form-label">Email</label>
              <input 
                className="input-field" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input 
                className="input-field" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          <button className="primary-btn" type="submit" style={{ width: '100%', marginBottom: '16px' }}>
            <LogIn size={18} /> Login
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/signup" className="action-link" style={{ display: 'inline' }}>Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
