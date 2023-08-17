const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  password: String,
  firstName: String,
  lastName: String,
  mail: String,
  mobile: String,
  userRoleId: { type: Schema.Types.ObjectId, ref: "UserRole" },
  changeLog: [String],
  performedById: { type: Schema.Types.ObjectId, ref: "User" },
  performedT: String,
});

userSchema.methods.isPasswordCorrect = async function (providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
