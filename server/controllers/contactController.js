const Contact = require('../models/Contact');
const fs = require('fs');
const path = require('path');

const CONTACTS_FILE = path.join(__dirname, '../contacts.json');

// Get all contacts for logged in user
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a contact
exports.addContact = async (req, res) => {
  const { name, email, phone, category } = req.body;
  try {
    const newContact = new Contact({ 
      name, 
      email, 
      phone, 
      category: category || 'General',
      owner: req.user.id
    });
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    // Check owner
    if (contact.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    // Check owner
    if (contact.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
