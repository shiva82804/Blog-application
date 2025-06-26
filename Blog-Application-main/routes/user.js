const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

// router.post("signin"); //  This line is invalid and will cause an error
// FIX: Commented out or provide correct route if needed

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  res.cookie().redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndcreateTokenForUser(
      email,
      password
    );
    // console.log("token", token);
    res.cookie("token", token).redirect("/");
  } catch (err) {
    res.render("signin", {
      error: "Incorrect Email or password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
