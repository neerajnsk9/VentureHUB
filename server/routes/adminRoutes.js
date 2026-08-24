import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import { 
    changeStatus, 
    getAllListings, 
    getAllTransactions, 
    getAllWithdrawRequests, 
    getDashboard, 
    isAdmin, 
    markWithdrawalAsPaid 
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/isAdmin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboard);
adminRouter.get("/all-listings", protectAdmin, getAllListings);
adminRouter.put("/change-status/:listingId", protectAdmin, changeStatus);
adminRouter.get("/transactions", protectAdmin, getAllTransactions);
adminRouter.get("/withdraw-requests", protectAdmin, getAllWithdrawRequests);
adminRouter.put("/withdrawal-mark/:id", protectAdmin, markWithdrawalAsPaid);

export default adminRouter;