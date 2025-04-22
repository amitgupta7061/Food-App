import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mode:{
        type:String,
        default : "takeaway"
    },
    items: {
        type:String,
        required:true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    payment: {
        type: String,
        default: 'Cash',
    },
    isPaid:{
        type:Boolean,
        default:false,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Cancelled", "Completed"],
        default: "Pending",
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
