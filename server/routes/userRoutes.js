import express from 'express'

import {registerUser, loginUser, userCredits, paymentRazorpay} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'
import { forgotPassword, resetPassword } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razor', userAuth, paymentRazorpay)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword)

export default userRouter


// localhost:4000/api/user/register
// localhost:4000/api/user/login