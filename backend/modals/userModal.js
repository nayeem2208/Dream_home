import mongoose from "mongoose";
import bcrypt from "bcrypt";

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  name:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  coverPic: {
    type: String,
  },
  aboutUs:{
    type:String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    default: "",
  },
  otpExpiration: {
    type: Date,
  },
  sub:{
    type:String,
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.methods.matchpassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const usermodel = mongoose.model("User", userSchema);

export default usermodel;
