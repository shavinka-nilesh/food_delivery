import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" } // Allow avatar upload
}, { minimize: false })

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
