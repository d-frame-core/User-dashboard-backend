/** @format */

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a single image
interface Image {
  data: Buffer;
  contentType: string;
}

// Define the interface for the Profile document
export interface AddressDocument extends Document {
  images: Image[];
  publicAddress: string;
}

// Define the schema for the Profile model
const addressImagesSchema = new Schema<AddressDocument>({
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  publicAddress: {
    type: String,
    required: true,
  },
});

// Create and export the Profile model
export const AddressProof = mongoose.model<AddressDocument>(
  'AddressProof',
  addressImagesSchema
);
