import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  Save, 
  Mail, 
  Phone, 
  Edit2, 
  Trash2 
} from 'lucide-react';

const API_URL = '/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [modal, setModal] = useState({ show: false, id: null });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setContacts(data);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch contacts');
    }
    setLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', phone: '', category: 'General' });
      setEditingId(null);
      fetchContacts();
    } catch (e) {
      alert('Operation failed');
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${modal.id}`);
      setModal({ show: false, id: null });
      fetchContacts();
    } catch (e) {
      alert('Delete failed');
    }
  };

  const filtered = Array.isArray(contacts) ? contacts.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo-section">
          <h1>Contacts Hub</h1>
          <p>Your Smart Contact Companion</p>
        </div>
        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <div className="main-card">
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div>
              <label className="form-label">Full Name</label>
              <input 
                className="input-field" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input 
                className="input-field" 
                type="email" 
                placeholder="john@example.com" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input 
                className="input-field" 
                placeholder="+1 (555) 000-0000" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select 
                className="input-field" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option>General</option>
                <option>Work</option>
                <option>Family</option>
                <option>Friends</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="primary-btn" type="submit">
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? 'Save Contact' : 'Create Contact'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="action-link" 
                onClick={() => { 
                  setEditingId(null); 
                  setForm({name:'', email:'', phone:'', category:'General'}); 
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="search-wrap">
        <div className="search-icon"><Search size={18} /></div>
        <input 
          className="input-field search-bar" 
          placeholder="Search your contacts directory..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="empty-view">Retrieving information...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-view">No contacts available to display.</div>
      ) : (
        <div className="contact-grid">
          {filtered.map(c => (
            <div key={c._id} className="contact-card">
              <div>
                <div className="card-title">{c.name}</div>
                {c.email && <div className="detail"><Mail size={14} /> {c.email}</div>}
                <div className="detail"><Phone size={14} /> {c.phone}</div>
                <div className="tag-badge">{c.category}</div>
              </div>
              <div className="card-actions">
                <button 
                  className="action-link" 
                  onClick={() => { 
                    setForm(c); 
                    setEditingId(c._id); 
                    window.scrollTo({top: 0, behavior: 'smooth'}); 
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  className="action-link delete-link" 
                  onClick={() => setModal({ show: true, id: c._id })}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.show && (
        <div className="overlay">
          <div className="modal">
            <h2>Delete entry?</h2>
            <p>This contact will be permanently removed from your MERN database.</p>
            <div className="modal-btns">
              <button 
                className="btn-m m-cancel" 
                onClick={() => setModal({ show: false, id: null })}
              >
                Cancel
              </button>
              <button className="btn-m m-delete" onClick={onDelete}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
