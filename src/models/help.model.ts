/** @format */

import mongoose from 'mongoose';

interface HelpAttrs {
  title: string;
  text: string;
}

interface HelpDoc extends mongoose.Document {
  title: string;
  text: string;
}

interface HelpModel extends mongoose.Model<HelpDoc> {
  build(attrs: HelpAttrs): HelpDoc;
}

const helpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

helpSchema.statics.build = (attrs: HelpAttrs) => {
  return new Help(attrs);
};

const Help = mongoose.model<HelpDoc, HelpModel>('Help', helpSchema);

export { Help };
