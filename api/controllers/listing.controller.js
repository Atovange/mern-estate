import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found"));
        if (req.user.id != listing.userRef) return next(errorHandler(401, "Unauthorized"));
        
        const updatedListing = await Listing.findByIdAndUpdate(listing._id, req.body, {new: true});

        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found"));
        if (req.user.id != listing.userRef) return next(errorHandler(401, "Unauthorized"));
        
        await Listing.findByIdAndDelete(listing._id);

        return res.status(200).json("Listing deleted");
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found"));

        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

const parseQueryBoolean = (query) => {
    switch (query) {
        case "false": return false;
        case "true": return true;
        case undefined: return false;
        default: return false;
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const skip = parseInt(req.query.skip) || 0;

        const offer = parseQueryBoolean(req.query.offer);
        const furnished = parseQueryBoolean(req.query.furnished);
        const parking = parseQueryBoolean(req.query.parking);
        const rent = parseQueryBoolean(req.query.rent);
        const sell = parseQueryBoolean(req.query.sell);

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || "createdAt";

        const order = req.query.order || "desc";
        
        const query = {
            name: { $regex: searchTerm, $options: "i" },
            offer: offer ? true : { $in: [true, false] },
            furnished: furnished ? true : { $in: [true, false] },
            parking: parking ? true : { $in: [true, false] }
        };

        if (rent && sell) {
            query.type = { $in: ["rent", "sell"] };
        } else if (rent || sell) {
            query.type = rent ? "rent" : "sell";
        } else {
            query.type = { $in: ["rent", "sell"] };
        }

        const listings = await Listing.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ [sort]: order });

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}