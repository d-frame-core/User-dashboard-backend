import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
    reward_type: string,
	task: string, 
    acceptance_criteria: string
}

interface UserDoc extends mongoose.Document {
	reward_type: string,
	task: string, 
    acceptance_criteria: string
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
        reward_type: {type: String},
        task: {type: String},
        acceptance_criteria: {type: Schema.Types.Decimal128}
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
	return new Reward(attrs);
};

const Reward = mongoose.model<UserDoc, UserModel>('Reward', userSchema);

export {Reward};
