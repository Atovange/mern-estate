import bcryptjs from "bcryptjs";

import User from "../models/user.model.js"

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    await newUser.save()
        .then(dbResponse => {
            res.status(201).json({message: "User created successfully", db: dbResponse});
        })
        .catch(error => {
            res.status(400).json({error: error.message});
        });
    
}