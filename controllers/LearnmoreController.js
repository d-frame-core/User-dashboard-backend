const LearnMore = require("../models/LearnModel");

const learnMoreData = [
  {
    title: "Why D Frame?",
    text: "D Frame is a decentralised Data ecosystem to help people monetise their personal data with privacy, support businesses with dynamic value laden data and encourage developers to build for re-imagining the data economy. To earn a rightful passive income by viewing Advertisements of choice and Sharing your data with Industry, please install this application and secure a more safer future. Being Governed by the D Frame Foundation registered in the Netherlands, we hope to inspire trust and are dedicated to building financially sustainable livelihoods.",
  },
  {
    title: "What is the value of your Data?",
    text: "The value of your data is directly co-related with the price of data paid by the Advertiser or Data Collector from Industry in future. Based on your personal profile and interests, it is possible that certain people's data are more valuable in a collective data set at different time periods based on dynamic demand. The Ad Pricing is decided via the Data Valuation Engine (DVE). This is discussed in Detail in the White Paper. Through general demand-supply dynamics for certain types of Data determined via tags and actual Ad spent, the pricing is calculated. A base price of different data types is set and further calculations are processed. To be explored in the Alpha version.",
  },
  {
    title: "How safe is your data with us?",
    text: "With your prior permission, your data is processed, stored and timestamped (hashed) through support of Blockchains like Polygon and services like Mongo Data Base. We hope to empower full public transparency via the blockchain with personal privacy through encryption technologies. Only with your permission, would your data be accessed or used by third parties including us. Hence, there would be full compliance to GDPR and CCPA regulatory acts.",
  },
  {
    title: "How will you get your Token?",
    text: "The D Frame utility tokens are being generated on a Public Blockchain like Polygon. Hence, they can be easily accessed through third party interphases like Meta Mask and the D Frame Wallets. These tokens would be earned periodically with the users willingly sharing their data.",
  },
];

exports.createLearnMore = async (req, res) => {
  try {
    const learnMoreArray = [];

    for (const data of learnMoreData) {
      const learnMore = new LearnMore(data);
      await learnMore.save();
      learnMoreArray.push(learnMore);
    }

    res.status(201).json(learnMoreArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllLearnMore = async (req, res) => {
  try {
    const learnMore = await LearnMore.find({});
    res.status(200).json(learnMore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    await LearnMore.deleteMany();
    res.json({ message: "All surveys deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateLearnMore = async (req, res) => {
  try {
    const learnMore = await LearnMore.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!learnMore) {
      return res.status(404).json({ error: "LearnMore not found" });
    }
    res.status(200).json(learnMore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLearnMoreById = async (req, res) => {
  try {
    const learnMore = await LearnMore.findById(req.params.id);
    if (!learnMore) {
      return res.status(404).json({ message: "LearnMore entry not found" });
    }
    res.status(200).json(learnMore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
