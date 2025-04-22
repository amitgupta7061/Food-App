import express from 'express';
import { addItem, adminLogin, changeAvailability, deleteUsers, getAllMessage, getAllOrders, getAllUsers, getDashboardStats, removeItem, TakeAction } from '../controllers/adminController.js';
import {authAdmin} from '../middleware/authAdmin.js'
import upload from '../middleware/multer.js'

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin)

adminRouter.post('/add-item', authAdmin, upload.single('image'), addItem);
adminRouter.post('/remove-item', authAdmin, removeItem);

adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/all-orders', authAdmin, getAllOrders);
adminRouter.post('/action', authAdmin, TakeAction);

adminRouter.get('/all-users', authAdmin, getAllUsers);

adminRouter.get('/dashboard-data', authAdmin, getDashboardStats);

adminRouter.post('/delete-users', authAdmin, deleteUsers);

adminRouter.get('/get-message', authAdmin, getAllMessage)
export default adminRouter