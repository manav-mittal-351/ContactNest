const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// MERN Stack - MongoDB model
const Contact = require('./models/Contact'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// API Routes
// 1. Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    if (!dbConnected) {
       // Do not hardcode contacts. Return empty or inform the user clearly.
       return res.status(503).json({ 
         message: 'Database not connected. Please check your MongoDB setup.',
         isDisconnected: true 
       });
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
  if (!dbConnected) return res.status(503).json({ message: 'Database not available' });
  
  try {
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
    if (!dbConnected) return res.status(503).json({ message: 'Database not available' });
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update a contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not available' });
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📭 Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 MERN Server running on http://localhost:${PORT}`);
    console.log(`📡 MongoDB is configured to: ${MONGO_URI}`);
});
