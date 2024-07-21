const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "unstoppable"; // jwt secret used to sign the data

// ROUTE 1 : Create a user using POST "api/auth/createuser". No login required.
router.post(
  "/createuser",

  [
    // using express validator
    body("email").isEmail().withMessage("Invalid email format."),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Please enter a name with at least 3 characters."),
    check("password", "Password should be at least 5 characters long.")
      .not() // negates the result of next validator
      .isIn(["12345", "password", "god", "hacker", "abcde"])
      .withMessage("Do not use a common password.")
      .isLength({ min: 5 }),
  ],

  // If there are errors return bad request and errors
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() }); // bad request: 400 (client side error)
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        // if null then it doesn't exist
        return res.status(400).json({
          success,
          errors: [{ msg: "Sorry, a user with this email already exists." }],
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        phone: req.body.phone,
      });

      const data = {
        user: {
          id: user.id, // using id since it is the index in the db...which makes it easier to find the documents that match the query criteria.
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error"); // internal server error: 500 (server side error)
    }
  }
);

// ROUTE 2 : Authentication for user using api/auth/login. No login required.
router.post(
  "/login",

  [
    body("email").isEmail(),
    check("password", "Password cannot be blank.").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request: 400 (client side error)
    }
    const { email, password } = req.body;
    try {
      let success = false;
      let user = await User.findOne({ email });
      if (!user) {
        res
          .status(400)
          .json({ success, error: "Please login with correct credentials." });
      }

      let passwordCompare = await bcrypt.compare(password, user.password); // returs a promise...syntax: compare(password, hash)
      if (!passwordCompare) {
        res
          .status(400)
          .json({ success, error: "Please login with correct credentials." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3 : Get logged in user details using: "api/auth/getuser". Login required.
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
