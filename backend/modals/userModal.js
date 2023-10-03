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
  isBlocked:{
    type:Boolean,
    default:false
  }
});

userSchema.methods.matchpassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const usermodel = mongoose.model("User", userSchema);

export default usermodel;
