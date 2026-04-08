import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Sun, Moon } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, dark, toggleDark } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(name, email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <div style={{ position: 'fixed', top: '24px', right: '24px' }}>
        <button className="theme-btn" onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="main-card">
        <div className="logo-section" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1>Sign Up</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <label className="form-label">Name</label>
              <input 
                className="input-field" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
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
            <UserPlus size={18} /> Sign Up
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" className="action-link" style={{ display: 'inline' }}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
