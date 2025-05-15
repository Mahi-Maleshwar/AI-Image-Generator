import express from 'express';
import historyModel from '../models/historyModel.js';
import userAuth from '../middlewares/auth.js';

const historyRouter = express.Router();

// Only Get user's image generation history
historyRouter.get('/', userAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const histories = await historyModel.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, histories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

export default historyRouter;
