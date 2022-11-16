import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
    publicAddress: string,
	reward_id: string, 
    rewardGained: Schema.Types.Decimal128
}

interface UserDoc extends mongoose.Document {
	publicAddress: string,
	reward_id: string, 
    rewardGained: Schema.Types.Decimal128
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
        publicAddress: {type: String, required: true},
        reward_id: {type: String},
        rewardGained: {type: Schema.Types.Decimal128}
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
	return new User_reward(attrs);
};

const User_reward = mongoose.model<UserDoc, UserModel>('User_reward', userSchema);

export {User_reward};
