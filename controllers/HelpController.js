const Help = require('../models/Helpmodel');

const HData = [
    {
        title: "Read More",
        text: "Details will be added in due time.",
      },
      {
        title: "Privacy Policy",
        text: "Here will be the Description for the Privacy policy.",
      },
      {
        title: "Support",
        text: "Here will be the Description for the Support.",
      },
      {
        title: "Terms of Service",
        text: "Details will be added in due time.",
      },
    ];
  
  exports.createHelp = async (req, res) => {
    try {
      const HelpArray = [];
  
      for (const data of HData) {
        const newHelp = new Help(data);
        await newHelp.save();
        HelpArray.push(newHelp);
      }
  
      res.status(201).json(HelpArray);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.getAllhelp = async (req, res) => {
    try {
      const help = await Help.find({});
      res.status(200).json(help);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.delete = async (req, res) => {
    try {
      await Help.deleteMany();
      res.json({ message: " deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.updateHelp = async (req, res) => {
    try {
      const help = await Help.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!help) {
        return res.status(404).json({ error: " not found" });
      }
      res.status(200).json(help);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.gethelpById = async (req, res) => {
    try {
      const help = await Help.findById(req.params.id);
      if (!help) {
        return res.status(404).json({ message: " entry not found" });
      }
      res.status(200).json(help);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  