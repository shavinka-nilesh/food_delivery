import express from 'express';
import { getSocials, updateSocials } from '../controllers/socialController.js';

const socialRouter = express.Router();

socialRouter.get("/get", getSocials);
socialRouter.post("/update", updateSocials);

export default socialRouter;
