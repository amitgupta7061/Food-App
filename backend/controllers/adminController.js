import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import ItemModel from '../models/ItemModel.js';
import OrderModel from '../models/OrderModel.js'
import UserModel from '../models/UserModel.js'
import MessageModel from '../models/MessageModel.js';


export const adminLogin = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:'All fields are mandatory'
            })
        }
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "7d"});
            return res.json({
                success:true,
                message:'Login Successfully',
                token
            })
        } else{
            return res.json({
                success:false,
                message:'Invalid Credential'
            })
        }

    } catch (error) {
        console.log('Error in adminLogin controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const addItem = async (req, res) => {
    try {
        const {name, price, desc, category} = req.body;
        const image = req.file;

        if(!name || !price || !desc || !image || !category){
            return res.json({
                success:false,
                message:'All Fields are mandatory'
            })
        }

        const uploadImage = await cloudinary.uploader.upload(image.path, {resource_type:'image'});

        const newItem = new ItemModel({
            image:uploadImage.secure_url,
            name,
            price,
            desc,
            category
        })

        await newItem.save();

        res.json({
            success:true,
            message:'Item added Successfully'
        })
        
    } catch (error) {
        console.log('Error in addItem controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}


export const removeItem = async (req, res) => {
    try {
        const {itemId} = req.body;

        await ItemModel.findByIdAndDelete(itemId);

        res.json({
            success:true,
            message:'Item deleted Successfully'
        })
    } catch (error) {
        console.log('Error in remove controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const changeAvailability = async (req, res) => {
    try {
        const {itemId} = req.body;

        const item = await ItemModel.findById(itemId);
        if (item) {
            item.available = !item.available;
            await item.save();
        }

        res.json({
            success:true,
            message:'Availability changed'
        })
    } catch (error) {
        console.log('Error in changeavailability controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'fullName address phone email');

        res.json({
            success:true,
            orders
        })
    } catch (error) {
        console.log('Error in getAllorder controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const TakeAction = async (req, res) => {
    try {
        const {orderId, action} = req.body;

        const order = await OrderModel.findById(orderId);

        order.status = action;
        await order.save();

        res.json({
            success:true,
            message:'Action Taken Successfully',
        })
    } catch (error) {
        console.log('Error in TakeAction controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');

        res.json({
            success:true,
            users
        })
    } catch (error) {
        console.log('Error in getAllusers controller', error);
        res.json({
            success:false,
            message:'Internal server error'
        }) 
    }
}

export const getDashboardStats = async (req, res) => {
    try {
      const [userCount, orderCount, itemCount, paidOrders] = await Promise.all([
        UserModel.countDocuments(),
        OrderModel.countDocuments(),
        ItemModel.countDocuments(),
        OrderModel.find({ isPaid: true }, 'totalPrice')
      ]);
  
      const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
      res.json({
        success: true,
        stats: {
          users: userCount,
          orders: orderCount,
          items: itemCount,
          revenue: totalRevenue
        }
      });
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      res.json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

export const deleteUsers = async (req, res) => {
    try {
        const {userId} = req.body;
        await UserModel.findByIdAndDelete(userId);
        await OrderModel.deleteMany({ userId });
        res.json({
        success: true,
        message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteUsers controller', error);
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getAllMessage = async (req, res) => {
    try {
        const messages = await MessageModel.find();

        res.json({
            success:true,
            messages,
        })
    } catch (error) {
        console.error('Error in deleteUsers controller', error);
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
}