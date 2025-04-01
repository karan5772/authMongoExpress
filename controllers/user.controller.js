import User from "../models/User.models.js"
import sendMail from "../utils/sendMail.utils.js"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const regesterUser= async (req,res)=>{
    // take data from body
    const{name, email, password, phone}=req.body;

    //validate the data
    if(!name || !email || !phone ||!password){
        return res.status(400).json({
            success: false,
            message : "All feilds are required",
        })
    }

    //password length check
    if(password.length < 6){
        return res.status(400).json({
            success: false,
            message : "Password should be atleast 6 letters",
        })
        console.log(res.status);
    }

    // Let's now deal with the database
    try {
        //lets check if user is already in the db
        const existingUser = await User.findOne({
            email : email,
        });

        if(existingUser){
            return res.status(400).json({
                success: false,
                message : "User Already Exists",
            })
        }

        // encrypt the password


        //token generation 
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 10*60*60*1000;

        //creating  a new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            verificationToken : token,
            verificationTokenExpiry : tokenExpiry,
        })

        //sending email as token
        await sendMail(user.email, token);

        if(sendMail){
            return res.status(200).json({
                success : true,
                message : "User regestered, please verify by using the link in the email",
            })
        }

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        
    }
}

const verifyUser= async(req,res)=>{
    const { token } = req.params;
    const user= await User.findOne({
        verificationToken:token,
        verificationTokenExpiry : {$gt: Date.now()},
    });
    try {       
        if(user){
            user.isVerified = true,
            user.verificationToken = undefined,
            user.verificationTokenExpiry = undefined,
            
            await user.save();
            
            return res.status(200).json({
                success : true,
                message : "User is verified",
            });
        }
    } catch (error) {
        console.log("Cannot verify user /n err :",error);
        return res.status(200).json({
            success : false,
            message : "Internal server issue, user is not verfied",
        });
    }  
}

const login = async(req,res)=>{
    //take email and password
    const{email , password}= req.body;
    if(!password ||!email){
        return res.status(400).json({
            success: false,
            message : "All feilds are required",
        })
    }

    try {
        const user = await User.findOne({
            email,
        })

        if(!user){
            return res.status(400).json({
                success: false,
                message : "User is not regestered",
            })
        }

        //check weather the user is verified or not
        if(!user.isVerified)
        {
            return res.status(400).json({
                success: false,
                message : "User is not verified",
            })
        }

        //now lets compare and check the user and verify it

        const compPass = user.comparePassword(password);
        if(!compPass){
            return res.status(400).json({
                success: false,
                message : "Invalid email or password",
            });
        }

        //now make a token for the same
        const token = jwt.sign(
            {
                id : user._id, name:user.name,
            },
            process.env.SECRATE_KEY,
            {
                expiresIn : "24h",
            }
        )

        // now lets send the cookie in the response 
        res.cookie("token", token, 
            {
                maxAge : 24*60*60*1000,
                secure : true,
                httpOnly : true,
            }
        )

        res.status(200).json({
            succees : true ,
            message:"User logged in sucessfully",
            token,
            user : {
                id:user._id,
                name:user.name,
                role:user.role,
            }
        })

    } catch (err) {
        console.log("Cannot verify user for login /n err :",error);
        return res.status(200).json({
            success : false,
            message : "Internal server issue, user is not logged in",
        });
    }

}

export { regesterUser , verifyUser ,login };