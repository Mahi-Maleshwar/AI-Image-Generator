import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'node:crypto';

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.json({success:false, message: 'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, email, password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token, user: {name: user.name, _id: user._id}})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token, user: {name: user.name, _id: user._id}})
        } else {
            return res.json({success: false, message: 'Invalid Credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const userCredits = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        res.json({success: true, credits: user.creditBalance, user: {name: user.name}})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async(req, res)=>{
    try {
        console.log(req.user.id)
        const userId = req.user.id;
        console.log("User:", userId)
        const { planId } = req.body;
        console.log(userId, planId)
        if(!userId || !planId){
            return res.json({success: false, message: 'Missing Details'})
        }

         const userExists = await userModel.exists({ _id: userId });
        if (!userExists) {
      return res.json({ success: false, message: 'User not found' });
    }

        let credits, plan, amount, date 
        switch (planId){
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10 
                break;
            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;
            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 500
                break;
            default:
                return res.json({success: false, message: 'Invalid Plan'})
        }

        date = Date.now();

        const transactionData = {
    userId, plan, amount, credits, date
}
const newTransaction = await transactionModel.create(transactionData)

const options = {
    amount: amount * 100,
    currency: process.env.CURRENCY,
    receipt: newTransaction._id.toString(),
}

const order = await razorpayInstance.orders.create(options);
console.log("Order:", order)

        res.json({ success: true, order });
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.json({ success: false, message: "Please provide email" });

    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User with this email does not exist" });

    // Generate reset token (random string or JWT)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and set to user model (for security)
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expiry (e.g., 1 hour)
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await user.save();

    // Construct reset URL
    const frontend_Url = process.env.FRONTEND_URL
    const resetUrl = `${frontend_Url}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please click this link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error sending email" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    if (!password) return res.json({ success: false, message: "Please provide a new password" });

    // Hash token received in URL
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Find user with token and check expiry
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

     if (!user) {
  console.log("User not found with this token or token expired.");
  return res.json({ success: false, message: "Invalid or expired token" });
}

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to reset password" });
  }
};

export {registerUser, loginUser, userCredits, paymentRazorpay, forgotPassword, resetPassword }