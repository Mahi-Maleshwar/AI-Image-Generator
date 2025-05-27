import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


const BuyCredit = () => {

  const {user, backendUrl, loadCreditsData, token, setShowLogin} = useContext(AppContext)

  const navigate = useNavigate()
  const initPay = async (order)=>{
     if (!window.Razorpay) {
    toast.error("Razorpay SDK failed to load. Check your internet connection or script tag.");
    return;
  }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response)=>{
        console.log(response);
        navigate('/')
      },
      prefill: {
      name: user?.name,
      email: user?.email
    },
    }

    const rzp = new window.Razorpay(options)
    console.log("Razorpay Key ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    rzp.open()
    console.log(typeof window.Razorpay)

  }

  const paymentRazorpay = async (planId) => {
    try {
      if(!user){
        setShowLogin(true)
        return
      }
      console.log("User created:", user._id)
      console.log("User Created 1:", user.id)
      console.log("User created11: ", user?.id)
      const { data } = await axios.post(`${backendUrl}/api/user/pay-razor`, { planId, userId: user}, {headers: {
      Authorization: `Bearer ${token}` 
    }})
    console.log("Sending backend", {planId, userId: user})
   
    console.log(data)
      if (data.success){
        initPay(data.order)
      }
      console.log("Order received:", data.order);


    } catch (error) {
      toast.error(error.message)
    }
  } 
   return (
    <motion.div className='min-h-[80vh] text-center pt-14 mb-10'
    initial={{opacity: 0.2, y: 100}}
    transition={{ duration: 1}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{ once: true}}>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index)=>(
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'> 
              <span className='text-3xl font-medium'>${item.price} </span> / {item.credits} credits</p>
            <button onClick={()=>paymentRazorpay(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user ? 'Purchase' : 'Get Started'}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit