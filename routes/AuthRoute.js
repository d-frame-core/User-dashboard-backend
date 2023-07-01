const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

// Generate JWT token route
router.post("/generate-token", function(req, res) {
  const token = authController.generateToken(req.body.user);
  res.json({ token });
});

// Refresh JWT token route
router.post("/refresh-token", function(req, res) {
  authController.refreshToken(req.headers.token)
    .then(newToken => {
      if (!newToken) {
        return res.status(401).json({ error: "Invalid token" });
      }
      //console.log(newToken)
      res.json({ token: newToken });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});




// Verify JWT token route
router.post("/verify-token", function(req, res) {
  const decoded = authController.verifyToken(req.headers.token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }
  res.json({ decoded });
});

// Protected route
router.get("/protected-route", function(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token is not provided." });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  const decoded = authController.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }

  const result = authController.refreshToken(token);
  if (result.error) {
    return res.status(401).json({ error: result.error });

  }

  res.set("Authorization", `Bearer ${result.token}`);
  res.json({ message: "Welcome to the protected route!" });
});

module.exports = router;

