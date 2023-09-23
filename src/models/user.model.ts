/** @format */

// import mongoose from 'mongoose';

// interface UserAttrs {
// 	firstName: string;
// 	lastName: string;
// 	name: string;
// 	userName: string;
// 	address: string;
// 	phoneNumber: string;
// 	isActive: boolean;
// 	isEmailVerified: boolean;
// 	email: string;
// 	publicAddress: string;
// 	earnings: string;
// 	// firstLogin: boolean;
// }

// interface UserDoc extends mongoose.Document {
// 	firstName: string;
// 	lastName: string;
// 	name: string;
// 	userName: string;
// 	address: string;
// 	phoneNumber: string;
// 	isActive: boolean;
// 	isEmailVerified: boolean;
// 	email: string;
// 	publicAddress: string;
// 	earnings: string;
// 	// firstLogin: boolean;
// }

// interface UserModel extends mongoose.Model<UserDoc> {
// 	build(attrs: UserAttrs): UserDoc;
// }
// const userSchema = new mongoose.Schema(
// 	{
// 		firstName: {type: String, required: false},
// 		lastName: {type: String, required: false},
// 		name: {type: String},
// 		userName : {type: String},
// 		phoneNumber: {type: String},
// 		address: {type: String},
// 		email: {type: String, required: true},
// 		isActive: {type: Boolean, required: true},
// 		isEmailVerified: {type: Boolean, default: false},
// 		publicAddress: {type: String,required: true, unique: true},
// 		earnings: {type: String, required: true},
// 		// firstLogin: {type: Boolean, required: true},
// 	},
// 	{
// 		timestamps: true,
// 		toJSON: {
// 			transform(doc, ret) {
// 				/*
//                     '_id' is transformed to 'id' as later people can use different databases and different languages as part of microservices architecture so 'id' is more standard key in databases, only mongodb uses '_id'
//                 */
// 				ret.id = ret._id;
// 				delete ret._id;
// 				delete ret.__v;
// 			},
// 		},
// 	},
// );

// userSchema.statics.build = (attrs: UserAttrs) => {
// 	return new User(attrs);
// };

// const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// export {User};

/** @format */

import mongoose from 'mongoose';

interface UserAttrs {
  firstName: string;
  lastName: string;
  name: string;
  userName: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  isEmailVerified: boolean;
  email: string;
  publicAddress: string;
  earnings: string;
  userData: {
    dataDate: string;
    urlData: {
      urlLink: string;
      timestamps: string[];
      tags: string[];
    }[];
  }[];
}

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  name: string;
  userName: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  isEmailVerified: boolean;
  email: string;
  publicAddress: string;
  earnings: string;
  // firstLogin: boolean;
  userData: {
    dataDate: String;
    urlData: {
      urlLink: string;
      timestamps: string[];
      tags: string[];
    }[];
  }[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    name: { type: String },
    userName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    email: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, default: false },
    publicAddress: { type: String, required: true, unique: true },
    earnings: { type: String, required: true },
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
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        /*
                    '_id' is transformed to 'id' as later people can use different databases and different languages as part of microservices architecture so 'id' is more standard key in databases, only mongodb uses '_id'
                */
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
