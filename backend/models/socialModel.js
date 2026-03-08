import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" }
}, { minimize: false })

const socialModel = mongoose.models.social || mongoose.model("social", socialSchema);
export default socialModel;
