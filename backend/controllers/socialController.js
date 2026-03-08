import socialModel from "../models/socialModel.js";

// Fetch existing social links
const getSocials = async (req, res) => {
    try {
        let socials = await socialModel.findOne({});
        // Initialize an empty record if one doesn't exist yet
        if (!socials) {
            socials = new socialModel({ facebook: "", twitter: "", linkedin: "" });
            await socials.save();
        }
        res.json({ success: true, data: socials });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching social links" });
    }
}

// Update social links
const updateSocials = async (req, res) => {
    try {
        const { facebook, twitter, linkedin } = req.body;
        
        let socials = await socialModel.findOne({});
        if(!socials) {
            socials = new socialModel({ facebook, twitter, linkedin });
            await socials.save();
        } else {
            socials.facebook = facebook;
            socials.twitter = twitter;
            socials.linkedin = linkedin;
            await socials.save();
        }

        res.json({ success: true, message: "Social links updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating social links" });
    }
}

export { getSocials, updateSocials };
