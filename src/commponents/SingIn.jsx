import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function SignIn() {
const [formData, setFormData] = useState({ email: '', password: '', photo: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  const loadingToast = toast.loading('Signing in...');

  try {
    const res = await fetch('https://reschoolexpres.vercel.app/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await res.json();
    Cookies.set('token', data.token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: 7,
    });

    toast.update(loadingToast, {
      render: 'Successfully signed in!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    });

    navigate('/dashboard');
  } catch (err) {
    toast.update(loadingToast, {
      render: err.message,
      type: 'error',
      isLoading: false,
      autoClose: 3000,
    });
    setError(err.message);
  }
};

  return (
    <div className="p-6 max-w-md mx-auto">
       <form onSubmit={handleSubmit} className="w-[600px] mt-[100px] h-[250px] p-[30px] border-[3px] border-black space-y-4 bg-white rounded-lg shadow-md">
  
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          required
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-2">Sign In</button>
      </form>
    </div>
  );
}
