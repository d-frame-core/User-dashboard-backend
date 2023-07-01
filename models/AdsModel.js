const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    adId: Number,
    clientId: Number,
    sessionId: Number,
    campaignName: String,
    campaignType: String,
    campaignBudget: {
        perDay: Number,
        totalDays: Number
    },
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
        gender: String
    },
    image: String,
    adContent: String,
    tags: [],
    users: []
});

module.exports = new mongoose.model("Ad", adSchema)