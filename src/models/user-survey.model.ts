import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
	response: Schema.Types.Mixed,
    walletAddress: string
}

interface UserDoc extends mongoose.Document {
	response: Schema.Types.Mixed,
    walletAddress: string
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
		response: {type: Schema.Types.Mixed},
        walletAddress: {type: String, required: true}
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
	return new User_survey(attrs);
};

const User_survey = mongoose.model<UserDoc, UserModel>('user_survey', userSchema);

export {User_survey};
