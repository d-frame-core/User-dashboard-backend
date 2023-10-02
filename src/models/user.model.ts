/** @format */

import mongoose from 'mongoose';

// Define the KYC2Details interface
interface KYC2Details {
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  doorno?: string;
  pincode?: string;
  dob?: string;
  annualIncome?: string;
  permanentAddress?: string;
}

interface DFrameUserAttrs {
  publicAddress: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  earnings?: string;
  profileImage?: string;
  address1?: {
    data?: string;
    image?: string;
    verified?: boolean;
  };
  address2?: {
    data?: string;
    image?: string;
    verified?: boolean;
  };
  userData?: {
    dataDate: string;
    urlData: {
      urlLink: string;
      timestamps: string[];
      tags: string[];
    }[];
  }[];
  referrals?: string;
  kyc1?: {
    status?: boolean;
    verified?: boolean;
    details?: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  kyc2?: {
    status?: boolean;
    verified?: boolean;
    details?: KYC2Details;
  };
  kyc3?: {
    status?: boolean;
    verified?: boolean;
  };
}

interface DFrameUserDoc extends mongoose.Document {
  publicAddress: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  earnings?: string;
  profileImage?: string;
  address1?: {
    data?: string;
    submitted?: true;
    verified?: boolean;
  };
  address2?: {
    data?: string;
    submitted?: true;
    verified?: boolean;
  };
  userData?: {
    dataDate: string;
    urlData: {
      urlLink: string;
      timestamps: string[];
      tags: string[];
    }[];
  }[];
  referrals?: string;
  kyc1?: {
    status?: boolean;
    verified?: boolean;
    details?: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  kyc2?: {
    status?: boolean;
    verified?: boolean;
    details?: KYC2Details;
  };
  kyc3?: {
    status?: boolean;
    verified?: boolean;
  };
}

const dFrameUserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, required: true, unique: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    userName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    earnings: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    address1: {
      data: { type: String, default: '' },
      image: { type: String, default: '' },
      verified: { type: Boolean, default: false },
    },
    address2: {
      data: { type: String, default: '' },
      image: { type: String, default: '' },
      verified: { type: Boolean, default: false },
    },
    userData: [
      {
        dataDate: String,
        urlData: [
          {
            urlLink: String,
            timestamps: [String],
            tags: [String],
          },
        ],
      },
    ],
    referrals: { type: String, default: '' },
    kyc1: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      details: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        userName: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        email: { type: String, default: '' },
      },
    },
    kyc2: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      details: {
        gender: { type: String, default: '' },
        country: { type: String, default: '' },
        state: { type: String, default: '' },
        city: { type: String, default: '' },
        street: { type: String, default: '' },
        doorno: { type: String, default: '' },
        pincode: { type: String, default: '' },
        dob: { type: String, default: '' },
        annualIncome: { type: String, default: '' },
        permanentAddress: { type: String, default: '' },
      },
    },
    kyc3: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

dFrameUserSchema.statics.build = (attrs: DFrameUserAttrs) => {
  return new DFrameUser(attrs);
};

const DFrameUser = mongoose.model<DFrameUserDoc>(
  'DFrameUser',
  dFrameUserSchema
);

export { DFrameUser };
