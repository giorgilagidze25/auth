import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://reschoolexpres.vercel.app/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) navigate('/sign-in');
    else alert('Registration failed');
  };

  return (
<div className="min-h-screen flex justify-center bg-gray-100">
  <form onSubmit={handleSubmit} className="w-[600px] mt-[100px] h-[300px] p-[30px] border-[3px] border-black space-y-4 bg-white rounded-lg shadow-md">
    <input
      name="fullName"
      onChange={handleChange}
      placeholder="Full Name"
      required
      className="border p-2 w-full"
    />
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
    <button type="submit" className="bg-blue-500 text-white w-full py-2 hover:bg-blue-600 transition">
      Sign Up
    </button>
  </form>
</div>

  );
}
