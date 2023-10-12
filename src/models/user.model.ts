/** @format */

import mongoose from 'mongoose';

// Define interfaces for data structures

// KYC2Details interface
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
}

// Image interface for storing image data
interface Image {
  data: Buffer;
  contentType: 'image/jpeg' | 'image/png' | 'image/jpg';
}

// Define a string enum for KYC statuses
enum KYCStatus {
  Unsubmitted = 'unsubmitted',
  Unverified = 'unverified',
  Verified = 'verified',
  Stop = 'stop',
  Resubmit = 'resubmit',
  Resubmitted = 'resubmitted',
}

enum RewardCategory {
  KYC1 = 'KYC1',
  KYC2 = 'KYC2',
  KYC3 = 'KYC3',
  // Add other categories here as needed
}
// Updated DFrameUserAttrs interface
interface DFrameUserAttrs {
  publicAddress: string;
  address?: {
    data?: string;
    submitted?: boolean;
    addressProof?: Image; // Address proof image
  };
  referralCode?: string;
  kyc1?: {
    status?: KYCStatus;
    details?: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  kyc2?: {
    status?: KYCStatus;
    details?: KYC2Details;
  };
  kyc3?: {
    status?: KYCStatus;
    governmentProof1?: Image;
    governmentProof2?: Image;
    userPhoto?: Image;
  };
  permissions?: {
    location: boolean;
    cookies: boolean;
    callDataSharing: boolean;
    emailSharing: boolean;
    notification: boolean;
    storageOption: 'GCP' | 'IPFS';
  };
  profileImage?: Image;
  userData?: {
    dataDate: string;
    urlData: {
      urlLink: string;
      timestamps: string[];
      tags: string[];
      timespent: number[];
    }[];
  }[];
  rewards?: {
    verificationRewards?: {
      reward: number;
      timestamp: string[];
      rewardCategory: RewardCategory[];
      status: 'PAID' | 'UNPAID';
    };
    dailyRewards?: {
      browserDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      adRewards: {
        reward: number;
        adIds: string[];
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      emailDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      callDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      referralRewards: {
        reward: number;
        timestamp: string[];
        referrals: string[];
        status: 'PAID' | 'UNPAID';
      };
    };
  };
  userAds?: {
    date: string;
    ads: {
      adsId: string;
      rewards: number;
      status: 'SEEN' | 'UNSEEN';
    }[];
  }[];
}

// Updated DFrameUserDoc interface
interface DFrameUserDoc extends mongoose.Document {
  publicAddress: string;
  address?: {
    data?: string;
    submitted?: boolean;
    addressProof?: Image;
  };
  referralCode?: string;
  kyc1?: {
    status?: KYCStatus;
    details?: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  kyc2?: {
    status?: KYCStatus;
    details?: KYC2Details;
  };
  kyc3?: {
    status?: KYCStatus;
    governmentProof1?: Image;
    governmentProof2?: Image;
    userPhoto?: Image;
  };
  permissions?: {
    location: boolean;
    cookies: boolean;
    callDataSharing: boolean;
    emailSharing: boolean;
    notification: boolean;
    storageOption: 'GCP' | 'IPFS';
  };
  profileImage?: Image;
  userData?: {
    dataDate: string;
    urlData: {
      urlLink: string;
      timestamps: string[]; // Change this to a regular array
      tags: string[];
      timespent: number[];
    }[];
  }[];
  rewards?: {
    verificationRewards?: {
      reward: number;
      timestamp: string[];
      rewardCategory: RewardCategory[];
      status: 'PAID' | 'UNPAID';
    };
    dailyRewards?: {
      browserDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      adRewards: {
        reward: number;
        adIds: string[];
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      emailDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      callDataRewards: {
        reward: number;
        timestamp: string[];
        status: 'PAID' | 'UNPAID';
      };
      referralRewards: {
        reward: number;
        timestamp: string[];
        referrals: string[];
        status: 'PAID' | 'UNPAID';
      };
    };
  };
  userAds?: {
    date: string;
    ads: {
      adsId: string;
      rewards: number;
      status: 'SEEN' | 'UNSEEN';
    }[];
  }[];
}

// Define a mongoose schema for DFrameUser
const dFrameUserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, required: true, unique: true },
    address: {
      data: { type: String, default: '' },
      submitted: { type: Boolean, default: false },
      addressProof: { type: Object },
    },
    referralCode: { type: String, default: '' },
    kyc1: {
      status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
      },
      details: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        userName: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        email: { type: String, default: '' },
      },
    },
    kyc2: {
      status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
      },
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
      },
    },
    kyc3: {
      status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
      },
      governmentProof1: { type: Object },
      governmentProof2: { type: Object },
      userPhoto: { type: Object },
    },
    permissions: {
      location: { type: Boolean, default: true },
      cookies: { type: Boolean, default: true },
      callDataSharing: { type: Boolean, default: true },
      emailSharing: { type: Boolean, default: true },
      notification: { type: Boolean, default: true },
      storageOption: { type: String, enum: ['GCP', 'IPFS'], default: 'GCP' },
    },
    profileImage: { type: Object },
    userData: [
      {
        dataDate: String,
        urlData: [
          {
            urlLink: String, // Change this to a regular array
            timestamps: [String], // Change this to a regular array
            tags: [String], // Change this to a regular array
            timespent: [Number],
          },
        ],
      },
    ],
    rewards: {
      verificationRewards: {
        reward: { type: Number },
        timestamp: { type: [String] },
        rewardCategory: { type: [String], enum: Object.values(RewardCategory) },
        status: { type: String, enum: ['PAID', 'UNPAID'] },
      },
      dailyRewards: {
        browserDataRewards: {
          reward: { type: Number },
          timestamp: { type: [String] },
          status: { type: String, enum: ['PAID', 'UNPAID'] },
        },
        adRewards: {
          reward: { type: Number },
          adIds: { type: [String] },
          timestamp: { type: [String] },
          status: { type: String, enum: ['PAID', 'UNPAID'] },
        },
        emailDataRewards: {
          reward: { type: Number },
          timestamp: { type: [String] },
          status: { type: String, enum: ['PAID', 'UNPAID'] },
        },
        callDataRewards: {
          reward: { type: Number },
          timestamp: { type: [String] },
          status: { type: String, enum: ['PAID', 'UNPAID'] },
        },
        referralRewards: {
          reward: { type: Number },
          timestamp: { type: [String] },
          referrals: { type: [String] },
          status: { type: String, enum: ['PAID', 'UNPAID'] },
        },
      },
    },
    userAds: [
      {
        date: { type: String },
        ads: [
          {
            adsId: { type: String },
            rewards: { type: Number },
            status: { type: String, enum: ['SEEN', 'UNSEEN'] },
          },
        ],
      },
    ],
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

// Static method to build a new DFrameUser document
dFrameUserSchema.statics.build = (attrs: DFrameUserAttrs) => {
  return new DFrameUser(attrs);
};

// Create a mongoose model for DFrameUser
const DFrameUser = mongoose.model<DFrameUserDoc>(
  'DFrameUser',
  dFrameUserSchema
);

export { DFrameUser, KYCStatus };
