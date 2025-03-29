import mongoose from "mongoose";

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

const User = mongoose.model("User", newSchema);

export default User;