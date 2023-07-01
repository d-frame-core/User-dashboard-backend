const Ad = require("../models/AdsModel");
const multer = require('multer');
const path = require('path');
const User = require('../models/UsersModel');

let fileName

// async await in multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        fileName = Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage });

const getAd = async (req, res) => {
    try {
        const foundAd = await Ad.find({adId: req.params.id}) 
        if(foundAd.length) {
            res.status(200).json(foundAd)
        } else {
            res.status(200).json({message: "No ad found"})
        }
    }
    catch(err) {
        res.status(500).json(err)
    }
}

const postAd = async (req, res) => {
    const newAd = new Ad({

        // uuid // nanoid
        adId: req.body.adId,
        clientId: req.body.clientId,
        sessionId: req.body.sessionId,
        campaignName: req.body.campaignName,
        campaignType: req.body.campaignType,
        campaignBudget: {
            perDay: req.body.perDay,
            totalDays: req.body.totalDays
        },
        adName: req.body.adName,
        socialMediaPages: req.body.socialMediaPages,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime,
        audience: {
            location: req.body.location,
            ageFrom: req.body.ageFrom,
            ageTo: req.body.ageTo,
            gender: req.body.gender
        },
        image: fileName,
        video: req.body.video,
        adContent: req.body.adContent,
        tags: req.body.tags
    })
    try {
        const savedAd = await newAd.save();

        const matchingUser = await User.find({
            tags: {
                $in: savedAd.tags
            }
        })

        console.log(matchingUser);
        
        const matchedUserIds = []

        matchingUser.forEach((user) => { 
            matchedUserIds.push(user._id)
        })

        await Ad.updateOne({_id: savedAd._id}, {$set: {users: matchedUserIds}})

        res.status(201).json({message: "Post created successfully", id: savedAd._id})
    } catch (err){
        console.log(err);
        res.status(400).json({message: "Some error occured"})
    }
}

const updateAd = (req, res) => {
    try {
        Ad.updateOne(
            {adId: req.params.id},
            {$set: req.body},
            (err) => {
            if(!err) {
                res.status(200).json({message: "Updated Successfully"});
            }
        })
    }
    catch (err) {
        res.status(500).json({message: "Error Occured", error: err})
    }
}

const deleteAd = (req, res) => {
    try {
        Ad.deleteOne({adId: req.params.id}, (err) => {
            if(!err) {
                res.status(200).json({message: "Deleted Successfully"});
            }
        }) 
    }
    catch(err) {
        res.status(500).json({message: "Error Occured", error: err})
    }
}

module.exports = {
    getAd, postAd, updateAd, deleteAd, upload
}
