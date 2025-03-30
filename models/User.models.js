import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const newSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email: {
        type : String,
        required : true,
    },
    password :{
        type : String,
        required : true,
    },
    phone :{
        type : String,
        required : true,
    },
    role:{
        type : String,
        enum : ["admin", "user"],
        default: "user",
    },
    isVerified :{
        type: Boolean,
        default : false,
    },
    verificationToken :{
        type : String,
    },
    verificationTokenExpiry :{
        type : Date,
    },
},
{timestamps: true,}
)


newSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

newSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", newSchema);

export default User;