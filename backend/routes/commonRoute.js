import express from "express";
import { getAllItems } from "../controllers/commonController.js";
import { getAllMessages } from "../controllers/userController.js";

const commonRouter = express.Router();

commonRouter.get('/get-items', getAllItems)
commonRouter.get('/all-messages', getAllMessages)

export default commonRouter