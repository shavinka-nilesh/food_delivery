import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// fetch user profile
const getUserProfile = async (req, res) => {
    try {
        // req.body.userId comes from authMiddleware
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }
        res.json({success: true, data: {name: user.name, email: user.email}});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error fetching profile"});
    }
}

// update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name } = req.body;
        // Only updating name for simplicity. Email/Password require more complex verification flows.
        await userModel.findByIdAndUpdate(req.body.userId, { name });
        res.json({success: true, message: "Profile updated successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error updating profile"});
    }
}

// admin login (with DB migration built-in)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Check if ANY admin exists in the database
        const adminCount = await adminModel.countDocuments();

        if (adminCount === 0) {
            // Migrational fallback: If no admin in DB, check against .env
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                // First successful login mints the DB Admin
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const newAdmin = new adminModel({
                    email: email,
                    password: hashedPassword,
                    image: ""
                });
                await newAdmin.save();

                const token = jwt.sign({id: "admin"}, process.env.JWT_SECRET);
                return res.json({success: true, token, migrated: true});
            } else {
                return res.json({success: false, message: "Invalid credentials"});
            }
        } else {
            // 2. Normal DB login flow
            const admin = await adminModel.findOne({email});
            if(!admin) {
                return res.json({success:false, message: "Admin does not exist"});
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if(!isMatch){
                return res.json({success:false, message: "Invalid credentials"});
            }

            const token = jwt.sign({id: "admin"}, process.env.JWT_SECRET);
            return res.json({success: true, token});
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error authenticating admin"});
    }
}

// Fetch Admin Details
const getAdminProfile = async (req, res) => {
    try {
        const admin = await adminModel.findOne({});
        if(!admin) {
            return res.json({success: false, message: "Admin not found in DB"});
        }
        res.json({success: true, data: { email: admin.email, image: admin.image }});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Error fetching admin profile"});
    }
}

// Update Admin Details
const updateAdminProfile = async (req, res) => {
    try {
        let updateData = {};
        const { email, password } = req.body;

        if (email) {
            if(!validator.isEmail(email)) return res.json({success:false, message: "Please enter a valid email"});
            updateData.email = email;
        }

        if (password) {
            if(password.length < 8) return res.json({success:false, message: "Password must be at least 8 characters"});
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Check if a new image was uploaded via multer
        let image_filename = null;
        if (req.file) {
            image_filename = `${req.file.filename}`;
            updateData.image = image_filename;
        }

        await adminModel.findOneAndUpdate({}, updateData); // Assuming single admin architecture
        res.json({success: true, message: "Admin profile updated successfully"});
        
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Error updating admin profile"});
    }
}

// admin: fetch all users
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}); // You might want to strip passwords in production: .select("-password")
        res.json({success: true, data: users});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error fetching users"});
    }
}

// admin: add user manually
const addUser = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const exists = await userModel.findOne({email})
        if(exists) { return res.json({success:false, message: "User already exists"}) }

        if(!validator.isEmail(email)) { return res.json({success:false, message: "Please enter a valid email"}) }
        if(password.length<8) { return res.json({success:false, message: "Please enter a strong password"}) }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({name, email, password: hashedPassword});
        await newUser.save();
        res.json({success:true, message: "Customer added successfully"});
    } catch(error){
        console.log(error);
        res.json({success:false, message:"Error adding customer"});
    }
}

// admin: remove user
const removeUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Customer removed successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error removing customer"});
    }
}

// admin: update user (name and email)
const updateUser = async (req, res) => {
    try {
        const { id, name, email } = req.body;
        
        // Simple validation
        if(email && !validator.isEmail(email)){
            return res.json({success:false, message: "Please enter a valid email"});
        }

        await userModel.findByIdAndUpdate(id, { name, email });
        res.json({success: true, message: "Customer updated successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error updating customer"});
    }
}

export {
    loginUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    adminLogin, 
    listUsers, 
    addUser, 
    removeUser, 
    updateUser,
    getAdminProfile,
    updateAdminProfile
}