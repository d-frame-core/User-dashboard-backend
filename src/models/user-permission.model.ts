import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
    publicAddress: string,
	permission_id: string, 
    isAllowed: boolean
}

interface UserDoc extends mongoose.Document {
	publicAddress: string,
	permission_id: string, 
    isAllowed: boolean
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
        publicAddress: {type: String, required: true},
        permission_id: {type: String},
        isAllowed: {type: Boolean}
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
	},
);

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User_permission(attrs);
};

const User_permission = mongoose.model<UserDoc, UserModel>('User_permission', userSchema);

export {User_permission};