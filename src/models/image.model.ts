/** @format */

import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Profile document
interface IProfile extends Document {
  profileImage: {
    data: Buffer;
    contentType: 'image/jpeg' | 'image/png' | 'image/jpg';
  };
  publicAddress: string;
}

// Define the profileImage schema
const profileImageSchema: Schema<IProfile> = new Schema({
  profileImage: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/jpg'],
      required: true,
    },
  },
  publicAddress: {
    type: String,
    required: true,
  },
});

// Create and export the Profile model
export const Profile = mongoose.model<IProfile>(
  'ProfileImage',
  profileImageSchema
);
