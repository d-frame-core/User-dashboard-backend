/** @format */

import mongoose from 'mongoose';

interface LearnMoreAttrs {
  title: string;
  text: string;
}

interface LearnMoreDoc extends mongoose.Document {
  title: string;
  text: string;
}

interface LearnMoreModel extends mongoose.Model<LearnMoreDoc> {
  build(attrs: LearnMoreAttrs): LearnMoreDoc;
}

const learnMoreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

learnMoreSchema.statics.build = (attrs: LearnMoreAttrs) => {
  return new LearnMore(attrs);
};

const LearnMore = mongoose.model<LearnMoreDoc, LearnMoreModel>(
  'LearnMore',
  learnMoreSchema
);

export { LearnMore };
