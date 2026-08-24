import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";

// Get all public listings directly from PostgreSQL Database via API
export const getAllPublicListing = createAsyncThunk(
    "listing/getAllPublicListing",
    async () => {
        try {
            const { data } = await api.get("/api/listing/public");
            return data.listings || [];
        } catch (error) {
            console.log("Error fetching public listings from database:", error);
            return [];
        }
    }
);

// Get user listings directly from PostgreSQL Database via API
export const getAllUserListing = createAsyncThunk(
    "listing/getAllUserListing",
    async ({ getToken }) => {
        try {
            const token = await getToken();
            const { data } = await api.get("/api/listing/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            console.log("Error fetching user listings from database:", error);
            return { listings: [], balance: { earned: 0, withdrawn: 0, available: 0 } };
        }
    }
);

const initialState = {
    listings: [],
    userListings: [],
    balance: {
        earned: 0,
        withdrawn: 0,
        available: 0,
    },
    loading: false,
    error: null,
};

const listingSlice = createSlice({
    name: "listing",
    initialState,
    reducers: {
        setListings: (state, action) => {
            state.listings = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPublicListing.fulfilled, (state, action) => {
                if (action.payload) {
                    state.listings = action.payload;
                }
            })
            .addCase(getAllUserListing.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.listings) {
                        state.userListings = action.payload.listings;
                    }
                    if (action.payload.balance) {
                        state.balance = action.payload.balance;
                    }
                }
            });
    },
});

export const { setListings } = listingSlice.actions;
export default listingSlice.reducer;
