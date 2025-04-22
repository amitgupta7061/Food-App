import bcrypt from 'bcrypt'
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import OrderModel from '../models/OrderModel.js';
import razorpay from 'razorpay';
import MessageModel from '../models/MessageModel.js';

export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:'All Fields are mandatory'
            })
        }

        const userData = await UserModel.findOne({email});
        if(!userData){
            return res.json({
                success:false,
                message:'User Not found'
            })
        }

        const isValid = await bcrypt.compare(password, userData.password);

        if(!isValid){
            return res.json({
                success:false,
                message:'Invalid Credential'
            })
        }

        const token = jwt.sign({id:userData._id, email, password}, process.env.JWT_SECRET, {expiresIn : '1d'});

        res.json({
            success:true,
            message:'Login successfully',
            token,
        })

    } catch (error) {
        console.log('Error in userlogin controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const userSignup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if(!email || !password || !fullName){
            return res.json({
                success:false,
                message:'All Fields are mandatory'
            })
        }

        const userData = await UserModel.findOne({email});
        if(userData){
            return res.json({
                success:false,
                message:'Email is already in use'
            })
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            fullName,
            email,
            password:hashed_password
        })

        const user = await newUser.save();
        
        const token = jwt.sign({id:user._id, email, password}, process.env.JWT_SECRET, {expiresIn : '1d'});

        res.json({
            success:true,
            message:'Account created successfully',
            token,
        })

    } catch (error) {
        console.log('Error in usersignup controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const userProfile = async (req, res) => {
    try {
        const {userId} = req.body;
        const profile = await UserModel.findById(userId).select('-password');

        res.json({
            success:true,
            profile,
        })
    } catch (error) {
        console.log('Error in userprofile controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const image = req.file;
        const {userId, fullName, phone, address, dob, gender} = req.body;

        if(!fullName || !phone || !address || !dob || !gender || !userId){
            return res.json({
                success:false,
                message:'Some Data is missing'
            })
        }
        await UserModel.findByIdAndUpdate(userId, {fullName, phone, address, dob, gender})

        if(image){
            const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:'image'})
            await UserModel.findByIdAndUpdate(userId, {image:imageUpload.secure_url});
        }

        res.json({
            success:true,
            message:'Profile updated Successfully',
        })
    } catch (error) {
        console.log('Error in updateprofile controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const placeOrder = async (req, res) => {
    try {
        const { userId, mode, items, totalPrice, payment } = req.body;

        if (!userId || !items || totalPrice == 0) {
            return res.json({
                success: false,
                message: "Missing required fields",
            });
        }

        const newOrder = new OrderModel({
            userId,
            mode,
            items,
            totalPrice,
            payment,
        });
        const savedOrder = await newOrder.save();

        res.json({
            success: true,
            message: "Order placed successfully",
            order: savedOrder,
        });
    } catch (error) {
        console.log('Error in placeorder controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const getOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "User orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.log('Error in getorders controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const {userId, orderId} = req.body;

        const order = await OrderModel.findOne({ _id: orderId, userId });

        if(order.status === "Accepted" || order.status === "Completed"){
            return res.json({
                success:false,
                message:"Order already processed and can't be cancelled."
            })
        }

        if(order.status === "Cancelled"){
            return res.json({
                success:false,
                message:"This order is already cancelled."
            })
        }

        order.status = "Cancelled";
        await order.save();

        res.json({
        success: true,
        message: "Your order has been cancelled successfully.",
        });
    } catch (error) {
        console.log('Error in cancelOrder controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
}

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

export const paymentRazorpay = async(req, res) => {
    try {
        const {orderId} = req.body;
        const order = await OrderModel.findById(orderId);

        if(!order || order.status === "Cancelled"){
            return res.json({
                success:false,
                message:'Order does not exist'
            })
        }

        const option = {
            amount:order.totalPrice * 100,
            currency:process.env.CURRENCY,
            receipt:orderId
        }


        const response = await razorpayInstance.orders.create(option);

        res.json({
            success:true,
            response,
        })
    } catch (error) {
        console.log('Error in paymentRazorpay controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid'){
            await OrderModel.findByIdAndUpdate(orderInfo.receipt, {isPaid:true})

            res.json({
                success:true,
                message:'Payment successfull'
            })
        } else{
            res.json({
                success:false,
                message:'Payment failed'
            })
        }
    } catch (error) {
        console.log('Error in paymentRazorpay controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {name, email, message} = req.body;

        if(!name || !email || !message){
            return res.json({
                success:false,
                message:'All fields are required.'
            })
        }
        const newMessage =  new MessageModel({
            name,
            email,
            message
        })

        await newMessage.save();

        res.json({
            success:true,
            message:'Your message has been sent successfully!'
        })
    } catch (error) {
        console.log('Error in paymentRazorpay controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
}

export const getAllMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({}).sort({createdAt:-1});

        res.json({
            success:true,
            messages
        })
    } catch (error) {
        console.log('Error in getAllMessages controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
    
}