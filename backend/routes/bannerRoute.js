import express from "express"
import multer from "multer"
import { addBanner, listBanner, removeBanner } from "../controllers/bannerController.js"


const bannerRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

bannerRouter.post("/add", upload.single("image"), addBanner);
bannerRouter.get("/list", listBanner);
bannerRouter.post("/remove", removeBanner);

export default bannerRouter;
