import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import {errorHandler} from "../utils/error.js";

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    if (
        !username ||
        !email ||
        !password ||
        email === '' ||
        password === '' ||
        username === ''
      ) {
        return next(errorHandler(400, 'All fields are required!'));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({message: "User created successfully"});
    } catch(error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    if (
        !email ||
        !password ||
        email === '' ||
        password === ''
      ) {
        return next(errorHandler(400, 'All fields are required!'));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "Wrong credentials"));

        const passwordIsValid = bcryptjs.compareSync(password, validUser.password);
        if (!passwordIsValid) return next(errorHandler(404, "Wrong credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: _, ...rest} = validUser._doc;
        res.cookie("access_token", token, {httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000)})
           .status(200)
           .json(rest);
    } catch(error) {
        next(error);
    }
}