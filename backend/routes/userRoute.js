import express from 'express';
import { cancelOrder, getOrders, paymentRazorpay, placeOrder, sendMessage, updateProfile, userLogin, userProfile, userSignup, verifyPayment } from '../controllers/userController.js';
import {authUser} from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/signup', userSignup);
userRouter.get('/profile', authUser, userProfile);

userRouter.post('/update-profile',upload.single('image'), authUser,  updateProfile);

userRouter.post('/place-order', authUser, placeOrder);
userRouter.get('/get-order', authUser, getOrders);
userRouter.post('/cancel-order', authUser, cancelOrder);

userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-payment', authUser, verifyPayment);

userRouter.post('/send-message', sendMessage);

export default userRouter;