const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileURL: {
      type: String,
      default: "/images/profile.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); // ✅ Add `next()` here too

  const salt = randomBytes(16).toString("hex"); // specify encoding
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex"); // ✅ use 'hex' to match comparison

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

userSchema.static(
  "matchPasswordAndcreateTokenForUser",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex"); // must match format stored

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");
    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", userSchema);
module.exports = User;
