import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Tag, Trash2, Edit3, Plus, Search } from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:5000/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setContacts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', email: '', phone: '', category: 'General' });
      fetchContacts();
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchContacts();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const handleEdit = (contact) => {
    setFormData({ name: contact.name, email: contact.email, phone: contact.phone, category: contact.category });
    setEditingId(contact._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>📇 Modern Contacts</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="input-grid">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Work">Work</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary">
          {editingId ? <><Edit3 size={18} /> Update Contact</> : <><Plus size={18} /> Add Contact</>}
        </button>
      </form>

      <div className="search-bar" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <Search size={18} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search contacts..." 
          style={{ border: 'none', background: 'transparent', width: '100%', marginLeft: '10px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px' }}>Loading contacts...</p>
        ) : filteredContacts.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px', color: '#94a3b8' }}>No contacts found.</p>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact._id} className="contact-card">
              <h3>{contact.name}</h3>
              <p><Mail size={14} inline /> {contact.email}</p>
              <p><Phone size={14} inline /> {contact.phone}</p>
              <span className="tag">{contact.category}</span>
              <div className="actions">
                <button 
                  className="btn-icon" 
                  onClick={() => handleEdit(contact)}
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  className="btn-icon btn-delete" 
                  onClick={() => handleDelete(contact._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
