/** @format */

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Kyc3 document
interface Kyc3Doc extends Document {
  publicAddress: string;
  photo: {
    data: Buffer;
    contentType: string;
  };
  governmentProof1: {
    data: Buffer;
    contentType: string;
  };
  governmentProof2: {
    data: Buffer;
    contentType: string;
  };
}

// Define the schema for the Kyc3 model
const kyc3Schema: Schema<Kyc3Doc> = new Schema({
  publicAddress: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'], // Specify allowed image types
      required: true,
    },
  },
  governmentProof1: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'], // Specify allowed image types
      required: true,
    },
  },
  governmentProof2: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'], // Specify allowed image types
      required: true,
    },
  },
});

// Create and export the Kyc3 model
export const Kyc3 = mongoose.model<Kyc3Doc>('Kyc3', kyc3Schema);
