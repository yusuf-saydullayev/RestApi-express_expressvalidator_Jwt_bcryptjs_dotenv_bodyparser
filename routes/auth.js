const router = require("express").Router();
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post(
  "/register",
  [
    body("name").isLength({ max: 255 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // CHeck if user already registered
    const emailExsist = await User.findOne({ email: req.body.email });
    if (emailExsist) return res.status(400).send("Email already exist");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name.toLowerCase(),
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      res.send(error.message);
    }
  }
);

// Log in
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    // CHeck if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email is not found");
    // Password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid password");

    // Create token and send it
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
    res.header("auth_token", token).send(token);
  }
);

module.exports = router;
