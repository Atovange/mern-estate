import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({message: "Api route is working!"});
}

export const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, "Unauthorized"));

    try {
        if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {new: true});

        const { password: _, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, "Unauthorized"));

    try {
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie("access_token");
        res.status(200).json("User has beed deleted");
    } catch(error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, "Unauthorized"));

    try {
        const listings = await Listing.find({ userRef: req.user.id });
        res.status(200).json(listings);
    } catch(error) {
        next(error);
    }
}