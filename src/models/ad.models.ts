/** @format */

import { Schema, Document, model } from 'mongoose';

interface IAd extends Document {
  clientId: string;
  sessionId: number;
  campaignName: string;
  campaignType: string;
  adName: string;
  socialMediaPages: Record<string, any>;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  audience: {
    location: string;
    ageFrom: number;
    ageTo: number;
    gender: string;
  };
  image: string;
  adContent: string;
  adImpressions: number;
  status: string;
  tags: string[];
  assignedUsers: number;
  users: any[]; // Replace with a more specific type if possible
  perDay: number;
  totalDays: number;
  bidAmount: number;
}

const adSchema = new Schema<IAd>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  sessionId: Number,
  campaignName: String,
  campaignType: String,
  adName: String,
  socialMediaPages: {},
  startDate: String,
  startTime: String,
  endDate: String,
  endTime: String,
  audience: {
    location: String,
    ageFrom: Number,
    ageTo: Number,
    gender: String,
  },
  image: String,
  adContent: String,
  adImpressions: Number,
  tags: [String], // Use an array of strings for tags
  assignedUsers: Number,
  users: [Schema.Types.Mixed], // Use a more specific type if possible
  perDay: Number,
  totalDays: Number,
  bidAmount: Number,
  status: {
    type: String,
    default: 'unverified',
  },
});

export default model<IAd>('Ad', adSchema);
