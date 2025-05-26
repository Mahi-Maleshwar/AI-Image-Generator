import React, { useContext } from 'react'
import BuyCredit from './pages/BuyCredit'
import Home from './pages/Home'
import Result from './pages/Result'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import HistoryPage from './pages/HistoryPage'
import { AppContext } from './context/AppContext'

import ResetPassword from './components/ResetPassword'; // Adjust path if needed


const App = () => {

  const {showLogin} = useContext(AppContext);
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right'/>
      <Navbar />
      {showLogin && <Login/>}
      <Routes>
        <Route path='/'element={<Home />} />
        <Route path='/result' element={<Result />}/>
        <Route path='/buy' element={<BuyCredit />}/>
        <Route path="/history" element={<HistoryPage />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Footer/>
    </div>
    
  )
}

export default App