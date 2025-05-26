import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import historyRouter from './routes/historyRoutes.js';


const PORT = process.env.PORT || 4000
const app = express()
await connectDB()

app.use(express.json())
app.use(cors({
  origin: "https://ai-image-generator-mu-hazel.vercel.app",
  credentials: true, // only if you're using cookies/auth headers
}));


app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/history', historyRouter);

app.get('/', (req, res) => res.send('API Working'))

app.listen(PORT, ()=> console.log('Server running on port ' + PORT));