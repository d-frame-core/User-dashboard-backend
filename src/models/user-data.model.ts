import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
	data: Schema.Types.Mixed,
    publicAddress: string
}

interface UserDoc extends mongoose.Document {
	data: Schema.Types.Mixed,
    publicAddress: string
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
		data: {type: Schema.Types.Mixed},
        publicAddress: {type: String, required: true}
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
	return new User_data(attrs);
};

const User_data = mongoose.model<UserDoc, UserModel>('user_data', userSchema);

export {User_data};
