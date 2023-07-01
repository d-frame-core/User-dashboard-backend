const mongoose = require('mongoose');

// Define schema for the FAQ data to be stored
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

// Create a model using the schema
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
