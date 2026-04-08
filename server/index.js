const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// MERN Stack - MongoDB model
const Contact = require('./models/Contact'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}


// 🔌 MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contact-db';
let dbConnected = false;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (MERN Stack Active)');
    dbConnected = true;
  })
  .catch(err => {
    console.warn('⚠️  MongoDB connection failed. App will use Mock Data for now.');
    console.warn('   To fix this, ensure MongoDB is running or add ATLAS_URI to .env');
  });

const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Helper function to read contacts from JSON
const readLocalContacts = () => {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) return [];
    const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return [];
  }
};

// Helper function to write contacts to JSON
const writeLocalContacts = (contacts) => {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  } catch (err) {
    console.error('Error writing JSON file:', err);
  }
};

// API Routes
// 1. Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    if (!dbConnected) {
      console.log('📡 Serving from local JSON');
      return res.json(readLocalContacts());
    }
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add a contact
app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, category } = req.body;
  
  try {
    if (!dbConnected) {
      const contacts = readLocalContacts();
      const newContact = {
        _id: Date.now().toString(),
        name,
        email,
        phone,
        category: category || 'General',
        createdAt: new Date().toISOString()
      };
      contacts.unshift(newContact);
      writeLocalContacts(contacts);
      return res.status(201).json(newContact);
    }
    const newContact = new Contact({ name, email, phone, category: category || 'General' });
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    if (!dbConnected) {
      let contacts = readLocalContacts();
      contacts = contacts.filter(c => c._id !== req.params.id);
      writeLocalContacts(contacts);
      return res.json({ message: 'Contact deleted!' });
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update a contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    if (!dbConnected) {
      let contacts = readLocalContacts();
      const index = contacts.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Contact not found' });
      
      contacts[index] = { ...contacts[index], ...req.body };
      writeLocalContacts(contacts);
      return res.json(contacts[index]);
    }
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📭 Root route / Catch-all for SPA
app.get('*', (req, res) => {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(clientDistPath)) {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
    console.log(`🚀 MERN Server running on http://localhost:${PORT}`);
    console.log(`📡 MongoDB is configured to: ${MONGO_URI}`);
});

module.exports = app;
