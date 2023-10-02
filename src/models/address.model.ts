/** @format */

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Address document
interface AddressDoc extends Document {
  publicAddress: string;
  addressProof1: {
    data: Buffer;
    contentType: string;
  };
  addressProof2: {
    data: Buffer;
    contentType: string;
  };
}

// Define the schema for the Address model
const addressSchema: Schema<AddressDoc> = new Schema({
  publicAddress: {
    type: String,
    required: true,
    unique: true,
  },
  addressProof1: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'], // Specify allowed image types
      required: true,
    },
  },
  addressProof2: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'], // Specify allowed image types
      required: true,
    },
  },
});

// Create and export the Address model
export const Address = mongoose.model<AddressDoc>('Address', addressSchema);
