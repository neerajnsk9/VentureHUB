import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
    addCredential, 
    addListing, 
    createPlanCheckout, 
    deleteUserListing, 
    getAllPublicListing, 
    getPublicStats,
    getAllUserListing, 
    getAllUserOrders, 
    getUserPlan, 
    selectStarterPlan, 
    activatePaidPlan, 
    markFeatured, 
    purchaseAccount, 
    toggleStatus, 
    updateListing, 
    withdrawAmount,
    getUserWithdrawals 
} from "../controllers/listingController.js";
import upload from "../configs/multer.js";

const listingRouter = express.Router();

// Plan Management Routes
listingRouter.get("/user-plan", protect, getUserPlan);
listingRouter.post("/select-starter-plan", protect, selectStarterPlan);
listingRouter.post("/activate-paid-plan", protect, activatePaidPlan);
listingRouter.post("/create-plan-checkout", protect, createPlanCheckout);

// Listing Creation Routes (supporting both / and /add)
listingRouter.post("/", upload.array("images", 5), protect, addListing);
listingRouter.post("/add", upload.array("images", 5), protect, addListing);

// Listing Update Routes (supporting /, /update, and /update/:id)
listingRouter.put("/", upload.array("images", 5), protect, updateListing);
listingRouter.put("/update", upload.array("images", 5), protect, updateListing);
listingRouter.put("/update/:id", upload.array("images", 5), protect, updateListing);

listingRouter.get("/public-stats", getPublicStats);
listingRouter.get("/public", getAllPublicListing);
listingRouter.get("/user", protect, getAllUserListing);
listingRouter.put("/:id/status", protect, toggleStatus);
listingRouter.delete("/:listingId", protect, deleteUserListing);
listingRouter.post("/add-credential", protect, addCredential);
listingRouter.get("/purchase-account/:listingId", protect, purchaseAccount);
listingRouter.post("/purchase-account/:listingId", protect, purchaseAccount);
listingRouter.put("/featured/:id", protect, markFeatured);
listingRouter.get("/user-orders", protect, getAllUserOrders);
listingRouter.post("/withdraw", protect, withdrawAmount);
listingRouter.get("/user-withdrawals", protect, getUserWithdrawals);

export default listingRouter;
