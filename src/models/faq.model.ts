/** @format */

import mongoose from 'mongoose';

interface FaqAttrs {
  question: string;
  answer: string;
}

interface FaqDoc extends mongoose.Document {
  question: string;
  answer: string;
}

interface FaqModel extends mongoose.Model<FaqDoc> {
  build(attrs: FaqAttrs): FaqDoc;
}

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

faqSchema.statics.build = (attrs: FaqAttrs) => {
  return new Faq(attrs);
};

const Faq = mongoose.model<FaqDoc, FaqModel>('Faq', faqSchema);

export { Faq };
