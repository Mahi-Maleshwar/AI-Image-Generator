import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [mode, setMode] = useState('login');
  const { setShowLogin, backendUrl, setToken, setUser, loadCreditsData } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        const { data } = await axios.post(`${backendUrl}api/user/login`, { email, password });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          await loadCreditsData();
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else if (mode === 'signup') {
        const { data } = await axios.post(`${backendUrl}api/user/register`, { name, email, password });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else if (mode === 'forgot') {
        const { data } = await axios.post(`${backendUrl}api/user/forgot-password`, { email });

        if (data.success) {
          toast.success(data.message);
          setMode('login');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={onSubmitHandler}
        className='relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-sm'
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>
          {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Forgot Password'}
        </h1>

        <p className='text-sm text-center mb-4'>
          {mode === 'login'
            ? 'Welcome back! Please sign in to continue.'
            : mode === 'signup'
            ? 'Create an account to get started.'
            : 'Enter your email to reset your password.'}
        </p>

        {mode === 'signup' && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.profile_icon} className='w-5 h-5' alt='' />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='outline-none text-sm w-full'
              type='text'
              placeholder='Full Name'
              required
            />
          </div>
        )}

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} className='w-5 h-5' alt='' />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='outline-none text-sm w-full'
            type='email'
            placeholder='Email Id'
            required
          />
        </div>

        {mode !== 'forgot' && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.lock_icon} className='w-5 h-5' alt='' />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='outline-none text-sm w-full'
              type='password'
              placeholder='Password'
              required
            />
          </div>
        )}

        {mode === 'login' && (
          <p
            className='text-sm text-blue-600 my-4 cursor-pointer'
            onClick={() => setMode('forgot')}
          >
            Forgot Password?
          </p>
        )}

        <button className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
          {mode === 'login'
            ? 'Login'
            : mode === 'signup'
            ? 'Create Account'
            : 'Send Reset Link'}
        </button>

        {mode === 'login' ? (
          <p className='mt-5 text-center'>
            Don't have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setMode('signup')}>
              Sign Up
            </span>
          </p>
        ) : mode === 'signup' ? (
          <p className='mt-5 text-center'>
            Already have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setMode('login')}>
              Login
            </span>
          </p>
        ) : (
          <p className='mt-5 text-center'>
            Remember your password?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setMode('login')}>
              Back to Login
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt=''
          className='absolute top-5 right-5 cursor-pointer'
          onClick={() => setShowLogin(false)}
        />
      </motion.form>
    </div>
  );
};

export default Login;
