import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"
import historyModel from "../models/historyModel.js";

export const generateImage = async (req, res) => {
    try {
        const {prompt} = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId)

        if(!prompt){
            return res.json({success: false, message: 'Missing Details'})
        }

        if(!user){
            return res.json({ success: false, message: 'User not found'});
        }

        if(user.creditBalance === 0 || user.creditBalance < 0){
            return res.json({success: false, message: 'No Credit Balance', creditBalance: user.creditBalance})
        }

        const formData = new FormData()

        formData.append('prompt', prompt)

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key' : process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer' 
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1})
        await historyModel.create({
            userId: user._id,
            prompt,
            imageUrl: resultImage
          });

        res.json({success: true, message: 'Image Generated', creditBalance: user.creditBalance - 1, resultImage})
      
          

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}